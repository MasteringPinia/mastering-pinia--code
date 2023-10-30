import { mount } from '@vue/test-utils'
import TestComponent from '../pages/index/todo-list-2.vue'
import { describe, it, expect, vi, beforeEach, afterEach, SpyInstance } from 'vitest'
import { isRef, toRef, toRefs, toRaw } from 'vue'
import { setActivePinia, storeToRefs } from 'pinia'
import { tipOnFail } from '@tests/utils'

vi.mock('vue', async importOriginal => {
  const original = (await importOriginal()) as typeof import('vue')
  return {
    ...original,
    // @ts-ignore: ???
    toRef: vi.fn(original.toRef),
    toRefs: vi.fn(original.toRefs),
  }
})

vi.mock('pinia', async importOriginal => {
  const original = (await importOriginal()) as typeof import('pinia')
  return {
    ...original,
    storeToRefs: vi.fn(original.storeToRefs),
  }
})

describe('broken stores', () => {
  describe('Destructing two', () => {
    beforeEach(() => {
      vi.spyOn(console, 'warn').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('do we need that many toRef(s)/storeToRefs?', async () => {
      mount(TestComponent)
      const totalCalls =
        (toRef as unknown as SpyInstance).mock.calls.length +
        (toRefs as unknown as SpyInstance).mock.calls.length +
        (storeToRefs as unknown as SpyInstance).mock.calls.length
      tipOnFail(() => {
        expect(totalCalls).toBe(1)
      }, "You don't need more than one of these functions to destructure the store. You can use `toRef()`, `toRefs()`, or `storeToRefs()`.")
    })

    it('actions should not be refs', async () => {
      const wrapper = mount(TestComponent)
      // @ts-expect-error: internal
      const internalInstance: any = toRaw(wrapper.vm.$.devtoolsRawSetupState)

      tipOnFail(() => {
        expect(!('add' in internalInstance) || !isRef(internalInstance.add)).toBe(true)
        expect(!('update' in internalInstance) || !isRef(internalInstance.update)).toBe(true)
      }, 'Make sure to **not** use `toRef()`, `toRefs()`, or `storeToRefs()` on actions. You can simply destructure them from the store or use them directly.')
    })

    it('should not call useStore within component actions', async () => {
      const wrapper = mount(TestComponent)

      // using vi.mock didn't work
      setActivePinia(undefined)

      tipOnFail(() => {
        // @ts-expect-error: not typed
        wrapper.vm.text = 'hello'
        // @ts-expect-error: not typed
        wrapper.vm.addTodo()
      }, 'You are not supposed to call `useStore()` within a component method. You can simply call it within `setup` and use it everywhere.')
    })
  })
})
