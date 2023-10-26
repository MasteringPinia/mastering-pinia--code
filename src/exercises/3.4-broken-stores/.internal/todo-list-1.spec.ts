import { mount } from '@vue/test-utils'
import TestComponent from '../pages/index/todo-list-1.vue'
import { describe, it, expect, beforeAll, vi, afterAll } from 'vitest'
import { isReactive, isRef, toRaw } from 'vue'
import { tipOnFail } from '@tests/utils'

describe('broken stores', () => {
  describe('Destructuring one', () => {
    beforeAll(() => {
      vi.spyOn(console, 'warn').mockImplementation(() => {})
    })

    afterAll(() => {
      vi.spyOn(console, 'warn').mockRestore()
    })

    it('destructs state correctly from the store', async () => {
      const wrapper = mount(TestComponent)

      expect(wrapper.vm).toHaveProperty('list')
      // @ts-expect-error: internal
      const internalInstance: any = toRaw(wrapper.vm.$.devtoolsRawSetupState)
      tipOnFail(() => {
        expect(isRef(internalInstance.list)).toBe(true)
      }, 'Make sure to use `toRef()`, `toRefs()`, or `storeToRefs()` to destructure the store.')
    })

    it('destructs getters correctly from the store', async () => {
      const wrapper = mount(TestComponent)

      expect(wrapper.vm).toHaveProperty('finished')
      // @ts-expect-error: internal
      const internalInstance: any = toRaw(wrapper.vm.$.devtoolsRawSetupState)
      expect(isRef(internalInstance.finished)).toBe(true)
    })

    it('destructs actions correctly from the store', async () => {
      const wrapper = mount(TestComponent)

      expect(wrapper.vm).toHaveProperty('add')
      // @ts-expect-error: internal
      const internalInstance: any = toRaw(wrapper.vm.$.devtoolsRawSetupState)

      // do this to fail the test until the fix the first test
      expect(isRef(internalInstance.list)).toBe(true)

      expect(isReactive(internalInstance.add)).toBe(false)
      expect(isRef(internalInstance.add)).toBe(false)
    })
  })
})
