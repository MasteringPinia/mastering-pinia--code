import { mount } from '@vue/test-utils'
import TestComponent from '../pages/todo-list-1.vue'
import { describe, it, expect, beforeAll, vi, afterAll } from 'vitest'
import { isReactive, isRef, toRaw } from 'vue'

describe.sequential('Destructing one', () => {
  beforeAll(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterAll(() => {
    vi.spyOn(console, 'warn').mockRestore()
  })

  it('(1) destructs state correctly from the store', async () => {
    const wrapper = mount(TestComponent)

    expect(wrapper.vm).toHaveProperty('list')
    // @ts-expect-error: internal
    const internalInstance: any = toRaw(wrapper.vm.$.devtoolsRawSetupState)
    expect(isRef(internalInstance.list)).toBe(true)
  })

  it('(1) destructs getters correctly from the store', async () => {
    const wrapper = mount(TestComponent)

    expect(wrapper.vm).toHaveProperty('finished')
    // @ts-expect-error: internal
    const internalInstance: any = toRaw(wrapper.vm.$.devtoolsRawSetupState)
    expect(isRef(internalInstance.finished)).toBe(true)
  })

  it('(1) destructs actions correctly from the store', async () => {
    const wrapper = mount(TestComponent)

    expect(wrapper.vm).toHaveProperty('add')
    // @ts-expect-error: internal
    const internalInstance: any = toRaw(wrapper.vm.$.devtoolsRawSetupState)
    expect(isReactive(internalInstance.add)).toBe(false)
    expect(isRef(internalInstance.add)).toBe(false)
  })
})
