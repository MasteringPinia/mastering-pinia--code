import { computed, type ComputedRef } from 'vue'
import { useDataFetchingStore } from './data-fetching-store'

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

export function useMutation<TResult, TParams extends readonly unknown[], TError = Error>(
  options: UseMutationsOptions<TResult, TParams>,
): UseMutationReturn<TResult, TParams, TError> {
  console.log(options)
  const store = useDataFetchingStore()
  // const mutationReturn = {} satisfies UseMutationReturn<TResult, TParams, TError>
  // return mutationReturn
}

// useMutation({
//   async mutator(one: string, other?: number) {
//     return { one, other: other || 0 }
//   },
//   keys: ['register', ({ variables: [one], result }) => `register:${one}` + result.one],
// })
