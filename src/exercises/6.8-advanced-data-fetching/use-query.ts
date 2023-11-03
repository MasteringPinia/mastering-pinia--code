import { useEventListener } from '@vueuse/core'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { ComputedRef, computed, onMounted, onServerPrefetch, shallowReactive, toValue } from 'vue'

export interface UseQueryReturn<TResult = unknown, TError = Error> {
  // data: () => TResult | undefined
  // error: () => TError | null
  // isFetching: () => boolean
  // isPending: () => boolean
  data: ComputedRef<TResult | undefined>
  error: ComputedRef<TError | null>
  isFetching: ComputedRef<boolean>
  isPending: ComputedRef<boolean>
  refresh: () => Promise<void>
}

export interface UseDataFetchingQueryEntry<TResult = unknown, TError = any> {
  data: () => TResult | undefined
  error: () => TError | null
  /**
   * Returns whether the request is still pending its first call
   */
  isPending: () => boolean
  /**
   * Returns whether the request is currently fetching data
   */
  isFetching: () => boolean

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
  key: UseQueryKey | (() => UseQueryKey)
  fetcher: () => Promise<TResult>

  cacheTime?: number
  initialValue?: () => TResult
  refetchOnWindowFocus?: boolean
  refetchOnReconnect?: boolean
}
/**
 * Default options for `useQuery()`. Modifying this object will affect all the queries that don't override these
 */
export const USE_QUERY_DEFAULTS = {
  cacheTime: 1000 * 5,
  refetchOnWindowFocus: true as boolean,
  refetchOnReconnect: true as boolean,
} satisfies Partial<UseQueryOptions>
type UseQueryOptionsWithDefaults<TResult> = typeof USE_QUERY_DEFAULTS & UseQueryOptions<TResult>

const useDataFetchingStore = defineStore('data-fetching', () => {
  /**
   * - These are reactive because they are needed for SSR
   * - They are split into multiple stores to better handle reactivity
   * - With `shallowReactive()` we only observe the first level of the object, which is enough here as the user only
   *   gets read-only access to the data
   */
  const dataRegistry = shallowReactive(new Map<UseQueryKey, unknown>())
  const errorRegistry = shallowReactive(new Map<UseQueryKey, any>())
  const isFetchingRegistry = shallowReactive(new Map<UseQueryKey, boolean>())

  // no reactive on this one as it's only used internally and is not needed for hydration
  const queryEntriesRegistry = new Map<UseQueryKey, UseDataFetchingQueryEntry<unknown, unknown>>()

  function ensureEntry<TResult = unknown, TError = Error>(
    key: UseQueryKey,
    { fetcher, initialValue, cacheTime }: UseQueryOptionsWithDefaults<TResult>,
  ): UseDataFetchingQueryEntry<TResult, TError> {
    // ensure the data
    console.log('⚙️ Ensuring entry', key)
    if (!dataRegistry.has(key)) {
      dataRegistry.set(key, initialValue?.() ?? undefined)
      errorRegistry.set(key, null)
      isFetchingRegistry.set(key, false)
    }

    // we need to repopulate the entry registry separately from data and errors
    if (!queryEntriesRegistry.has(key)) {
      const entry: UseDataFetchingQueryEntry<TResult, TError> = {
        data: () => dataRegistry.get(key) as TResult,
        error: () => errorRegistry.get(key) as TError,
        isPending: () => !entry.previous,
        isFetching: () => isFetchingRegistry.get(key)!,
        pending: null,
        previous: null,
        async fetch(): Promise<TResult> {
          if (!entry.previous || isExpired(entry.previous.when, cacheTime)) {
            if (entry.previous) {
              console.log(`⬇️ fetching "${String(key)}". expired ${entry.previous?.when} / ${cacheTime}`)
            }
            await (entry.pending?.refreshCall ?? entry.refresh())
          }

          return entry.data()! as TResult
        },
        async refresh() {
          console.log('🔄 refreshing', key)
          // when if there an ongoing request
          if (entry.pending) {
            console.log('  -> skipped!')
            return entry.pending.refreshCall
          }
          isFetchingRegistry.set(key, true)
          errorRegistry.set(key, null)
          const nextPrevious = {
            when: 0,
            data: undefined as TResult | undefined,
            error: null as TError | null,
          } satisfies UseDataFetchingQueryEntry['previous']

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
                entry.previous = nextPrevious
                isFetchingRegistry.set(key, false)
              }),
            when: Date.now(),
          }

          return entry.pending.refreshCall
        },
      }
      queryEntriesRegistry.set(key, entry)
    }

    const entry = queryEntriesRegistry.get(key)!
    // automatically try to refresh the data if it's expired
    entry.fetch()

    return entry as UseDataFetchingQueryEntry<TResult, TError>
  }

  function invalidateEntry(key: string) {
    throw new Error('Not implemented: ' + key)
  }

  return {
    dataRegistry,
    errorRegistry,
    isLoadingRegistry: isFetchingRegistry,

    ensureEntry,
    invalidateEntry,
  }
})

export function useQuery<TResult, TError = Error>(_options: UseQueryOptions<TResult>): UseQueryReturn<TResult, TError> {
  const store = useDataFetchingStore()

  const options = {
    ...USE_QUERY_DEFAULTS,
    ..._options,
  } satisfies UseQueryOptionsWithDefaults<TResult>

  const entry = computed(() => store.ensureEntry<TResult, TError>(toValue(options.key), options))

  // only happens on server, app awaits this
  onServerPrefetch(async () => {
    await entry.value.refresh()
    // NOTE: workaround to https://github.com/vuejs/core/issues/5300
    // eslint-disable-next-line
    queryReturn.data.value, queryReturn.error.value, queryReturn.isFetching.value, queryReturn.isPending.value
  })

  // only happens on client
  // we could also call fetch instead but forcing a refresh is more interesting
  onMounted(entry.value.refresh)
  // TODO: optimize so it doesn't refresh if we are hydrating

  if (IS_CLIENT) {
    if (options.refetchOnWindowFocus) {
      useEventListener(window, 'focus', () => {
        entry.value.refresh()
      })
    }

    if (options.refetchOnReconnect) {
      useEventListener(window, 'online', () => {
        entry.value.refresh()
      })
    }
  }

  const queryReturn = {
    data: computed(() => entry.value.data()),
    error: computed(() => entry.value.error()),
    isFetching: computed(() => entry.value.isFetching()),
    isPending: computed(() => entry.value.isPending()),
    // error: () => entry.value.error(),
    // isFetching: () => entry.value.isFetching(),
    // isPending: () => entry.value.isPending(),

    refresh: () => entry.value.refresh(),
  } satisfies UseQueryReturn<TResult, TError>

  return queryReturn
}

type _MutatorKeys<TParams extends readonly any[], TResult> = readonly (
  | string
  | ((context: { variables: TParams; result: TResult }) => string)
)[]

export interface UseMutationsOptions<TResult = unknown, TParams extends readonly unknown[] = readonly []> {
  /**
   * The key of the mutation. If the mutation is successful, it will invalidate the query with the same key and refetch it
   */
  mutator: (...args: TParams) => Promise<TResult>
  keys?: _MutatorKeys<TParams, TResult>
}
// export const USE_MUTATIONS_DEFAULTS = {} satisfies Partial<UseMutationsOptions>

export interface UseMutationReturn<
  TResult = unknown,
  TParams extends readonly unknown[] = readonly [],
  TError = Error,
> {
  data: ComputedRef<TResult | undefined>
  error: ComputedRef<TError | null>
  isPending: ComputedRef<boolean>

  mutate: (...params: TParams) => Promise<void>
  reset: () => void
}

export function useMutation<TResult = unknown, TParams extends readonly unknown[] = readonly []>(
  options: UseMutationsOptions<TResult, TParams>,
) {
  console.log(options)
  // const store = useDataFetchingStore()
  // const mutationReturn = {} satisfies UseMutationReturn<TResult, TParams, TError>
  // return mutationReturn
}

// useMutation({
//   async mutator(one: string, other?: number) {
//     return { one, other: other || 0 }
//   },
//   keys: ['register', ({ variables: [one], result }) => `register:${one}` + result.one],
// })

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
