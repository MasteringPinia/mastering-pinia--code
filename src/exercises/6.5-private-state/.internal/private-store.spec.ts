import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, getActivePinia, setActivePinia } from 'pinia'
import { definePrivateState } from '../private-state'
import { computed, ref, toRaw } from 'vue'
import { defineReadonlyState } from '../readonly-state'
import { definePrivateStore } from '../private-store'
import { isComputed, tipOnFail } from '@tests/utils'
import { useAuthStore } from '../stores/auth'
import { mockHttpRequests } from '@tests/mocks/server'

describe('Private state', () => {
  mockHttpRequests()
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('auth store', () => {
    it('hides the currentUser property from state', async () => {
      const auth = useAuthStore()

      expect(auth.$state).not.toHaveProperty('currentUser')
    })

    it('exposes the current user as a getter', async () => {
      const auth = useAuthStore()

      expect(auth.$state).not.toHaveProperty('currentUser')
      expect(auth).toHaveProperty('currentUser')
      expect(isComputed(toRaw(auth).currentUser)).toBe(true)
    })

    it('creates a currentUser property in the pinia state', () => {
      useAuthStore()

      expect(JSON.stringify(getActivePinia()?.state.value)).includes('"currentUser":null')
    })

    it('can run login and logout actions', async () => {
      const auth = useAuthStore()

      expect(auth.currentUser).toBe(null)
      await auth.login('email', 'password')
      expect(auth.currentUser).not.toBe(null)
      await auth.logout()
      expect(auth.currentUser).toBe(null)
    })
  })

  describe('definePrivateState', () => {
    it('does not expose the state', async () => {
      const store = definePrivateState(
        'id',
        () => ({ count: 0 }),
        () => {
          return {}
        },
      )()

      expect(store).not.toHaveProperty('count')
      expect(store.$state).not.toHaveProperty('count')
    })

    it('creates two stores to implement the private state', async () => {
      const store = definePrivateState(
        'id',
        () => ({ count: 0 }),
        () => {
          return {}
        },
      )()

      const pinia = getActivePinia()!

      expect(Object.keys(pinia.state.value)).toHaveLength(2)
      tipOnFail(() => {
        expect(store.$id).toBe('id')
      }, 'The store should preserve the "id" passed to your custom "defineStore" function')
    })

    it('passes the private state as the first argument', async () => {
      const spy = vi.fn(priv => {
        function increment() {
          priv.count++
        }
        return { increment }
      })

      definePrivateState('id', () => ({ count: 0 }), spy)()

      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(expect.objectContaining({ count: 0 }))
    })

    it('can compute values from the private state', async () => {
      const store = definePrivateState(
        'id',
        () => ({ count: 0 }),
        priv => {
          const double = computed(() => priv.count * 2)
          function increment() {
            priv.count++
          }
          return { double, increment }
        },
      )()

      expect(store.double).toBe(0)
      store.increment()
      expect(store.double).toBe(2)
    })
  })

  describe('definePrivateStore', () => {
    it('creates two stores to implement the private state', async () => {
      const store = definePrivateStore(
        'id',
        () => ({ count: ref(0) }),
        () => {
          return {}
        },
      )()

      const pinia = getActivePinia()!

      expect(Object.keys(pinia.state.value)).toHaveLength(2)
      tipOnFail(() => {
        expect(store.$id).toBe('id')
      }, 'The store should preserve the "id" passed to your custom "defineStore" function')
    })

    it('does not expose the state', async () => {
      const store = definePrivateStore(
        'id',
        () => ({ count: ref(0) }),
        () => {
          return {}
        },
      )()

      expect(store).not.toHaveProperty('count')
      expect(store.$state).not.toHaveProperty('count')
    })

    it('can compute values from the private state', async () => {
      const store = definePrivateStore(
        'id',
        () => ({ count: ref(0) }),
        priv => {
          const double = computed(() => priv.count * 2)
          function increment() {
            priv.count++
          }
          return { double, increment }
        },
      )()

      expect(store.double).toBe(0)
      store.increment()
      expect(store.double).toBe(2)
    })

    it('passes the private state as the first argument', async () => {
      const spy = vi.fn(priv => {
        function increment() {
          priv.count++
        }
        return { increment }
      })

      definePrivateStore('id', () => ({ count: ref(0) }), spy)()

      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(expect.objectContaining({ count: 0 }))
    })

    it('also receives actions', async () => {
      const spy = vi.fn(() => {
        return {}
      })

      definePrivateStore(
        'id',
        () => {
          const count = ref(0)
          function increment() {
            count.value++
          }
          const double = computed(() => count.value * 2)
          return { count, increment, double }
        },
        spy,
      )()

      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          $id: expect.any(String),
          count: 0,
          increment: expect.any(Function),
          double: 0,
        }),
      )
    })
  })

  describe('defineReadonlyState', () => {
    it('creates two stores to implement the readonly state', async () => {
      const store = defineReadonlyState(
        'id',
        () => ({ count: 0 }),
        () => {
          return {}
        },
      )()

      const pinia = getActivePinia()!

      expect(Object.keys(pinia.state.value)).toHaveLength(2)
      tipOnFail(() => {
        expect(store.$id).toBe('id')
      }, 'The store should preserve the "id" passed to your custom "defineStore" function')
    })

    it('exposes the state', async () => {
      const store = defineReadonlyState(
        'id',
        () => ({ count: 0 }),
        () => {
          return {}
        },
      )()

      expect(store.count).toBe(0)
      expect(store.$state).not.toHaveProperty('count')
    })

    it('cannot mutate the readonly state outside', () => {
      const store = defineReadonlyState(
        'id',
        () => ({ count: 0 }),
        () => {
          return {}
        },
      )()

      expect(() => {
        // @ts-expect-error: should not be able to mutate
        store.count++
      }).toThrow()
      expect(store.count).toBe(0)
    })

    it('passes the readonly state as the first argument', async () => {
      const spy = vi.fn(priv => {
        function increment() {
          priv.count++
        }
        return { increment }
      })

      defineReadonlyState('id', () => ({ count: 0 }), spy)()

      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(expect.objectContaining({ count: 0 }))
    })

    it('can compute values from the readonly state', async () => {
      const store = defineReadonlyState(
        'id',
        () => ({ count: 0 }),
        priv => {
          const double = computed(() => priv.count * 2)
          function increment() {
            priv.count++
          }
          return { double, increment }
        },
      )()

      expect(store.double).toBe(0)
      store.increment()
      expect(store.double).toBe(2)
    })
  })
})
