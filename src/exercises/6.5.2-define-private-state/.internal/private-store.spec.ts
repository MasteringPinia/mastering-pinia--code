import { describe, it, expect, vi } from 'vitest'
import { getActivePinia } from 'pinia'
import { definePrivateState } from '../private-state'
import { computed } from 'vue'
import { tipOnFail } from '@tests/utils'

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
