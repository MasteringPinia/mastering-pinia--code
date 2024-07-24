import { shallowRef } from 'vue'

export function useMutation<Fn extends (...args: unknown[]) => unknown>(
  fn: Fn,
  options: {
    onSuccess?: (data: Awaited<ReturnType<Fn>>) => unknown
    onError?: (error: any) => unknown
  } = {},
) {
  const isLoading = shallowRef(false)
  const error = shallowRef<any>(null)
  const data = shallowRef<ReturnType<Fn> | null>(null)

  async function mutate(...args: Parameters<Fn>) {
    // ...
  }

  return {
    mutate,
    isLoading,
    data,
    error,
  }
}
