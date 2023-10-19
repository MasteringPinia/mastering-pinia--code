import { describe, it, expect, vi } from 'vitest'
import { getActivePinia } from 'pinia'
import { computed, ref } from 'vue'
import { definePrivateStore } from '../private-store'
import { tipOnFail } from '@tests/utils'

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
