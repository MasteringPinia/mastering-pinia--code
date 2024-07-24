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
    isLoading.value = true
    try {
      const res = await (fn(...args) as ReturnType<Fn>)
      data.value = res
      error.value = null
      await options.onSuccess?.(res)
    } catch (err) {
      error.value = err
      options.onError?.(err)
    } finally {
      isLoading.value = false
    }
  }

  return {
    mutate,
    isLoading,
    data,
    error,
  }
}
