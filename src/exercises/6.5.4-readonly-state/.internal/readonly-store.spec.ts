import { describe, it, expect, vi } from 'vitest'
import { getActivePinia } from 'pinia'
import { computed } from 'vue'
import { defineReadonlyState } from '../readonly-state'
import { tipOnFail } from '@tests/utils'

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
