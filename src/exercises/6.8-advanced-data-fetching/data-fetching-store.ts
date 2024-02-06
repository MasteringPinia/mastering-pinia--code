import { acceptHMRUpdate, defineStore } from 'pinia'
import { shallowReactive } from 'vue'
import type { UseQueryOptionsWithDefaults } from './use-query'

export interface UseDataFetchingQueryEntry<TResult = unknown, TError = any> {
  /**
   * Returns the data of the query if it resolved or the last known data
   */
  data: () => TResult | undefined
  /**
   * Returns the error of the query rejected
   */
  error: () => TError | null
  /**
   * Returns whether the request is currently fetching data
   */
  isFetching: () => boolean

  /**
   * Refreshes the data ignoring any cache but still decouples the fetch (only one fetch at a time)
   * @returns a promise that resolves when the fetch is done
   */
  refetch: () => Promise<TResult>
  /**
   * Refreshes the data only if the data isn't fresh.
   * @returns a promise that resolves when the refresh is done
   */
  refresh: () => Promise<TResult>

  /**
   * Pending entry while `refreshCall` promise is pending
   */
  pending: null | {
    refreshCall: Promise<TResult>
    when: number
  }

  /**
   * When was this query settled (either resolved or rejected). Obtained with `Date.now()`
   */
  when: number
}

export const useDataFetchingStore = defineStore('6.8-data-fetching', () => {
  /**
   * NOTE:
   * - These are reactive because they contain state that needs to be serialized
   * - They are split into multiple Maps to better handle reactivity but it's not necessary
   * - With `shallowReactive()` we only observe the first level of the object, which is enough here as the user only
   *   gets read-only access to the data
   */

  /**
   * Stores the `data` for each query
   */
  const dataRegistry = shallowReactive(new Map<string, unknown>())
  /**
   * Stores the `error` for each query
   */
  const errorRegistry = shallowReactive(new Map<string, any>())
  /**
   * Stores whether the query is currently fetching data or not (`isFetching`)
   */
  const isFetchingRegistry = shallowReactive(new Map<string, boolean>())

  // no reactive on this one as it's only used internally and is not needed for hydration
  const queryEntriesRegistry = new Map<string, UseDataFetchingQueryEntry<unknown, unknown>>()

  /**
   * Ensures that the entry exists in the registry and returns it
   *
   * @param key - key of the query
   * @param options - useQuery options
   */
  function ensureEntry<TResult = unknown, TError = Error>(
    key: string,
    { query, initialValue, cacheTime }: UseQueryOptionsWithDefaults<TResult>,
  ): UseDataFetchingQueryEntry<TResult, TError> {
    // ensure the data
    console.log('⚙️ Ensuring entry', key)
    // Consider the data fresh by default. Using 0 will also work, it depends on how you want to handle the cache
    let when = Date.now()
    if (!dataRegistry.has(key)) {
      dataRegistry.set(key, initialValue?.() ?? undefined)
      errorRegistry.set(key, null)
      isFetchingRegistry.set(key, false)
      // if there is no data, we need to fetch it, so we expire it
      when = 0 // will force a refetch
    }

    // we need to repopulate the entry registry separately from data and errors
    if (!queryEntriesRegistry.has(key)) {
      console.log(`📝 Creating entry "${key} when: ${when}`)
      const entry: UseDataFetchingQueryEntry<TResult, TError> = {
        data: () => dataRegistry.get(key) as TResult,
        error: () => errorRegistry.get(key) as TError,
        isFetching: () => isFetchingRegistry.get(key)!,
        pending: null,
        async refresh(): Promise<TResult> {
          if (isExpired(entry.when, cacheTime)) {
            if (entry.when) {
              console.log(`🗑️ "${String(key)}" expired ${entry.when} / ${cacheTime}`)
            }
            await (entry.pending?.refreshCall ?? entry.refetch())
          }

          return entry.data()!
        },
        async refetch() {
          console.log('🔄 refetching', key)
          // when if there an ongoing request
          if (entry.pending) {
            console.log('  -> skipped!')
            return entry.pending.refreshCall
          }
          isFetchingRegistry.set(key, true)

          entry.pending = {
            refreshCall: query()
              .then(data => {
                errorRegistry.set(key, null)
                dataRegistry.set(key, data)
                return data
              })
              .catch(error => {
                errorRegistry.set(key, error)
                // we could also always catch the data
                throw error
              })
              .finally(() => {
                entry.pending = null
                entry.when = Date.now()
                isFetchingRegistry.set(key, false)
              }),
            when: Date.now(),
          }

          return entry.pending.refreshCall
        },
        when,
      }
      queryEntriesRegistry.set(key, entry)
    }

    const entry = queryEntriesRegistry.get(key)!

    return entry as UseDataFetchingQueryEntry<TResult, TError>
  }

  /**
   * Invalidates a query entry, forcing a refetch of the data if `refresh` is true
   *
   * @param key - the key of the query to invalidate
   * @param refresh - whether to force a refresh of the data
   */
  function invalidateEntry(key: string, refresh = false) {
    const entry = queryEntriesRegistry.get(key)
    if (!entry) {
      // nothing to invalidate
      return
    }

    // will force a fetch next time
    entry.when = 0

    if (refresh) {
      // reset any pending request
      entry.pending = null
      // force refresh
      entry.refetch()
    }
  }

  return {
    dataRegistry,
    errorRegistry,
    isFetchingRegistry,

    ensureEntry,
    invalidateEntry,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDataFetchingStore, import.meta.hot))
}

function isExpired(lastRefresh: number, cacheTime: number): boolean {
  return lastRefresh + cacheTime < Date.now()
}
