import { effectScope } from 'vue'

const stores = new WeakMap<() => unknown, unknown>()

const globalEffect = effectScope(true)

export function defineStore<R>(fn: () => R) {
  function useStore() {
    if (!stores.has(fn)) {
      const store = globalEffect
        .run(() =>
          // this one is nested in the global, so we don't pass true
          effectScope(),
        )!
        .run(() => fn())!

      stores.set(fn, store)
    }

    return stores.get(fn) as R
  }

  return useStore
}
