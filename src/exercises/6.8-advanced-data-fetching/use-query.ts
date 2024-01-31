import { useEventListener } from '@vueuse/core'
import { type ComputedRef, computed, onMounted, onServerPrefetch, toValue, MaybeRefOrGetter, watch } from 'vue'
import { useDataFetchingStore } from './data-fetching-store'

export interface UseQueryReturn<TResult = unknown, TError = Error> {
  data: ComputedRef<TResult | undefined>
  error: ComputedRef<TError | null>
  /**
   * Returns whether the request is currently fetching data
   */
  isFetching: ComputedRef<boolean>

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
}

export interface UseQueryOptions<TResult = unknown> {
  /**
   * key to identify the query.
   */
  key: MaybeRefOrGetter<string>
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
export type UseQueryOptionsWithDefaults<TResult> = typeof USE_QUERY_DEFAULTS & UseQueryOptions<TResult>

export function useQuery<TResult, TError = Error>(_options: UseQueryOptions<TResult>): UseQueryReturn<TResult, TError> {
  const store = useDataFetchingStore()

  const options = {
    ...USE_QUERY_DEFAULTS,
    ..._options,
  } satisfies UseQueryOptionsWithDefaults<TResult>

  const entry = computed(() => store.ensureEntry<TResult, TError>(toValue(options.key), options))

  // only happens on server, app awaits this
  onServerPrefetch(async () => {
    await entry.value.refetch()
  })

  // only happens on client
  onMounted(() => {
    // ensures the entry is fetched when needed
    watch(
      entry,
      entry => {
        entry.refresh()
      },
      { immediate: true },
    )
  })

  if (IS_CLIENT) {
    if (options.refetchOnWindowFocus) {
      useEventListener(window, 'visibilitychange', () => {
        entry.value.refetch()
      })
    }

    if (options.refetchOnReconnect) {
      useEventListener(window, 'online', () => {
        entry.value.refetch()
      })
    }
  }

  const queryReturn = {
    // we could optimize this by creating the computed properties only once per entry
    // but that requires further refactoring 🤓
    data: computed(() => entry.value.data()),
    error: computed(() => entry.value.error()),
    isFetching: computed(() => entry.value.isFetching()),

    refresh: () => entry.value.refresh(),
    refetch: () => entry.value.refetch(),
  } satisfies UseQueryReturn<TResult, TError>

  return queryReturn
}

/**
 * Notes for exercise:
 * - Start only with the data, error, and isLoading, no cache, no refresh
 * - Start without the options about refreshing, and mutations
 */

const IS_CLIENT = typeof window !== 'undefined'
