import { useEventListener } from '@vueuse/core'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { ComputedRef, Ref, computed, onMounted, onServerPrefetch, shallowReactive } from 'vue'

export interface UseQueryReturn<TResult = unknown, TError = Error> {
  data: ComputedRef<TResult | undefined>
  error: ComputedRef<TError | null>
  isLoading: Ref<boolean>
  refresh: () => Promise<void>
}

export interface UseDataFetchingQueryEntry<TResult = unknown, TError = Error> {
  data: () => TResult | undefined
  error: () => TError | null
  isLoading: () => boolean

  /**
   * Refreshes the data ignoring any cache but still decouples the refreshes (only one refresh at a time)
   * @returns a promise that resolves when the refresh is done
   */
  refresh: () => Promise<void>
  /**
   * Fetches the data but only if it's not already fetching
   * @returns a promise that resolves when the refresh is done
   */
  fetch: () => Promise<TResult>

  pending: null | {
    refreshCall: Promise<void>
    when: number
  }
  previous: null | {
    when: number
    data: TResult | undefined
    error: TError | null
  }
}

export type UseQueryKey = string | symbol

export interface UseQueryOptions<TResult = unknown> {
  // TODO: simplify by making this necessary
  key?: UseQueryKey
  fetcher: () => Promise<TResult>

  cacheTime?: number
  initialValue?: () => TResult
  refreshOnWindowFocus?: boolean
  refreshOnReconnect?: boolean
}
/**
 * Default options for `useQuery()`. Modifying this object will affect all the queries that don't override these
 */
export const USE_QUERY_DEFAULTS = {
  cacheTime: 1000 * 5,
  refreshOnWindowFocus: true as boolean,
  refreshOnReconnect: true as boolean,
} satisfies Partial<UseQueryOptions>
type UseQueryOptionsWithDefaults<TResult> = typeof USE_QUERY_DEFAULTS & UseQueryOptions<TResult>

export interface UseMutationsOptions<TResult = unknown> {
  key?: UseQueryKey
  mutator: () => Promise<TResult>

  cacheTime?: number
  initialValue?: () => TResult
  refreshOnWindowFocus?: boolean
  refreshOnReconnect?: boolean
}

const useDataFetchingStore = defineStore('data-fetching', () => {
  /**
   * - These are reactive because they are needed for SSR
   * - They are split into multiple stores to better handle reactivity
   * - With `shallowReactive()` we only observe the first level of the object, which is enough here as the user only
   *   gets read-only access to the data
   */
  const dataRegistry = shallowReactive(new Map<UseQueryKey, unknown>())
  const errorRegistry = shallowReactive(new Map<UseQueryKey, any>())
  const isLoadingRegistry = shallowReactive(new Map<UseQueryKey, boolean>())

  // no reactive on this one as it's only used internally and is not needed for hydration
  const queryEntriesRegistry = new Map<UseQueryKey, UseDataFetchingQueryEntry<unknown, unknown>>()

  function ensureEntry<TResult = unknown, TError = Error>({
    key,
    initialValue,
    cacheTime,
    fetcher,
  }: Omit<UseQueryOptionsWithDefaults<TResult>, 'key'> & { key: UseQueryKey }): UseDataFetchingQueryEntry<
    TResult,
    TError
  > {
    // ensure the data
    if (!dataRegistry.has(key)) {
      dataRegistry.set(key, initialValue?.() ?? undefined)
      errorRegistry.set(key, null)
      isLoadingRegistry.set(key, false)
    }

    // we need to repopulate the entry registry separately from data and errors
    if (!queryEntriesRegistry.has(key)) {
      const entry: UseDataFetchingQueryEntry<TResult, TError> = {
        data: () => dataRegistry.get(key) as TResult,
        error: () => errorRegistry.get(key) as TError,
        isLoading: () => isLoadingRegistry.get(key)!,
        pending: null,
        previous: null,
        async fetch(): Promise<TResult> {
          if (!entry.previous || isExpired(entry.previous.when, cacheTime)) {
            await (entry.pending?.refreshCall ?? entry.refresh())
          }

          return entry.data()! as TResult
        },
        async refresh() {
          // when if there an ongoing request
          if (entry.pending) {
            return entry.pending.refreshCall
          }
          isLoadingRegistry.set(key, true)
          errorRegistry.set(key, null)
          const nextPrevious: UseDataFetchingQueryEntry['previous'] = {
            when: 0,
            data: undefined,
            error: null,
          }

          entry.pending = {
            refreshCall: fetcher()
              .then(data => {
                nextPrevious.data = data
                dataRegistry.set(key, data)
              })
              .catch(error => {
                nextPrevious.error = error
                errorRegistry.set(key, error)
                throw error
              })
              .finally(() => {
                entry.pending = null
                nextPrevious.when = Date.now()
                isLoadingRegistry.set(key, false)
              }),
            when: Date.now(),
          }

          return entry.pending.refreshCall
        },
      }
      queryEntriesRegistry.set(key, entry)
    }

    return queryEntriesRegistry.get(key)! as UseDataFetchingQueryEntry<TResult, TError>
  }

  function invalidateEntry(key: string) {
    throw new Error('Not implemented: ' + key)
  }

  return {
    dataRegistry,
    errorRegistry,
    isLoadingRegistry,

    ensureEntry,
    invalidateEntry,
  }
})

export function useQuery<TResult, TError = Error>(_options: UseQueryOptions<TResult>): UseQueryReturn<TResult, TError> {
  const store = useDataFetchingStore()

  const options = {
    key: Symbol('anonymous'),
    ...USE_QUERY_DEFAULTS,
    ..._options,
  } satisfies UseQueryOptionsWithDefaults<TResult>

  const { data, error, isLoading, refresh } = store.ensureEntry<TResult, TError>(options)

  // only happens on server, app awaits this
  onServerPrefetch(async () => {
    // await new Promise(resolve => setTimeout(resolve, 100))
    return refresh()
  })

  // only happens on client
  // we could also call fetch instead but forcing a refresh is more interesting
  onMounted(refresh)
  // TODO: optimize so it doesn't refresh if we are hydrating

  if (IS_CLIENT) {
    if (options.refreshOnWindowFocus) {
      useEventListener(window, 'focus', refresh)
    }

    if (options.refreshOnReconnect) {
      useEventListener(window, 'online', refresh)
    }
  }

  return {
    data: computed(data),
    error: computed(error),
    isLoading: computed(isLoading),

    refresh,
  }
}

export function useMutation<TResult, TError = Error>({ key, mutator }: UseMutationsOptions<TResult, TError>) {}

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDataFetchingStore, import.meta.hot))
}

const IS_CLIENT = typeof window !== 'undefined'

function isExpired(lastRefresh: number, cacheTime: number): boolean {
  return lastRefresh + cacheTime < Date.now()
}

/**
 * Notes for exercise:
 * - Start only with the data, error, and isLoading, no cache, no refresh
 * - Start without the options about refreshing, and mutations
 */
