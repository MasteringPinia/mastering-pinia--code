import { shallowRef } from 'vue'

export function useAsyncData<R>(fn: () => Promise<R>) {
  const data = shallowRef<R>()

  fn().then(result => {
    data.value = result
  })

  return {
    data,
  }
}
