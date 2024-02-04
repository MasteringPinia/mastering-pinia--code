import { computed, ref, type ComputedRef, shallowRef } from 'vue'
import { useDataFetchingStore } from './data-fetching-store'

type _MutationKeys<TParams extends readonly any[], TResult> = readonly (
  | string
  | ((context: { variables: TParams; result: TResult }) => string)
)[]

export interface UseMutationsOptions<TResult = unknown, TParams extends readonly unknown[] = readonly []> {
  /**
   * Mutator function that will be called when `mutate()` is called
   */
  mutation: (...args: TParams) => Promise<TResult>
  /**
   * keys related to the data the mutation affects. If the mutation is successful, it will invalidate the query with the
   * same key and refetch it
   */
  keys?: _MutationKeys<TParams, TResult>
}

export interface UseMutationReturn<
  TResult = unknown,
  TParams extends readonly unknown[] = readonly [],
  TError = Error,
> {
  data: ComputedRef<TResult | undefined>
  error: ComputedRef<TError | null>
  isFetching: ComputedRef<boolean>

  mutate: (...params: TParams) => Promise<TResult>
}

export function useMutation<TResult, TParams extends readonly unknown[], TError = Error>(
  options: UseMutationsOptions<TResult, TParams>,
): UseMutationReturn<TResult, TParams, TError> {
  const store = useDataFetchingStore()

  function mutate(...args: TParams) {
    // TODO: implement
    return Promise.resolve({} as TResult)
  }

  // TODO: implement
  return {
    data: computed(() => undefined),
    isFetching: computed(() => false),
    error: computed(() => null),
    mutate,
  }
}
