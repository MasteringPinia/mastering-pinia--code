import { EffectScope, InjectionKey, Plugin, effectScope, inject } from 'vue'

export function defineStore<R>(fn: () => R) {
  function useStore() {
    const globalEffect = inject(effectKey)
    const stores = inject(storesMapKey)
    if (!globalEffect || !stores) {
      throw new Error('No global effect found. Did you call `useStore()` outside of a component?')
    }

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

const effectKey = Symbol('my-store-effect') as InjectionKey<EffectScope>
const storesMapKey = Symbol('stores-map') as InjectionKey<WeakMap<() => unknown, unknown>>

export const appPlugin: Plugin = app => {
  const globalEffect = effectScope(true)
  app.provide(effectKey, globalEffect)
  app.provide(storesMapKey, new WeakMap())
}
