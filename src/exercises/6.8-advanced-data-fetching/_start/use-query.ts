import { useEventListener } from '@vueuse/core'
import { type ComputedRef, computed, onMounted, onServerPrefetch, toValue, MaybeRefOrGetter, watch } from 'vue'
import { useDataFetchingStore } from './data-fetching-store'

export interface UseQueryReturn<TResult = unknown, TError = Error> {
  /**
   * Returns the data of the query if it resolved or the last known data
   */
  data: ComputedRef<TResult | undefined>
  /**
   * Returns the error of the query rejected
   */
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
  /**
   * Function that fetches the data.
   */
  query: () => Promise<TResult>

  /**
   * How long should the data be cached in milliseconds. Defaults to 5 seconds
   */
  cacheTime?: number

  /**
   * Function to compute the initial value of the data. Otherwise, it's set to `undefined` until the first fetch is done
   */
  initialValue?: () => TResult
}

/**
 * Default options for `useQuery()`. Modifying this object will affect all the queries that don't override these
 */
export const USE_QUERY_DEFAULTS = {
  cacheTime: 1000 * 5,
} satisfies Partial<UseQueryOptions>
export type UseQueryOptionsWithDefaults<TResult> = typeof USE_QUERY_DEFAULTS & UseQueryOptions<TResult>

export function useQuery<TResult, TError = Error>(_options: UseQueryOptions<TResult>): UseQueryReturn<TResult, TError> {
  const store = useDataFetchingStore()

  // TODO: implement
  return {
    data: computed(() => undefined),
    error: computed(() => null),
    isFetching: computed(() => false),
    refetch: () => Promise.resolve({} as TResult),
    refresh: () => Promise.resolve({} as TResult),
  }
}

/**
 * Notes for exercise:
 * - Start only with the data, error, and isLoading, no cache, no refresh
 * - Start without the options about refreshing, and mutations
 */
