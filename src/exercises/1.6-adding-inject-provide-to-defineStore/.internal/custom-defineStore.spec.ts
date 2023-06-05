import { describe, it, expect, vi, beforeEach, afterAll } from 'vitest'
import { mount } from '@vue/test-utils'
import TestComponent from '../index.vue'
import { appPlugin } from '../my-pinia'
import { inject } from 'vue'
import { tipOnFail } from '@tests/utils'

describe('custom defineStore', () => {
  describe('usage of inject provide', () => {
    vi.mock('vue', async importOriginal => {
      const mod = await importOriginal<typeof import('vue')>()
      return {
        ...mod,
        inject: vi.fn(mod.inject),
        provide: vi.fn(mod.provide),
      }
    })

    beforeEach(() => {
      vi.clearAllMocks()
    })

    afterAll(() => {
      vi.restoreAllMocks()
    })

    it('is using inject provide', async () => {
      mount(TestComponent, { global: { plugins: [appPlugin] } })
      await tipOnFail(() => expect(inject).toHaveBeenCalled(), 'Did you call `inject` in `defineStore`?')
    })
  })

  it('increments the counters', async () => {
    const wrapper = mount(TestComponent, { global: { plugins: [appPlugin] } })
    await tipOnFail(
      () => wrapper.get('[data-test="increment"]').trigger('click'),
      'The increment button seems to be broken. Did you hide it maybe?',
    )
    expect(wrapper.get('[data-test="count"]').text()).toBe('1')
    await tipOnFail(
      () => wrapper.findAll('[data-test="increment"]').at(1)!.trigger('click'),
      `Couldn't find the second increment button. Make sure there are 3 <MyPage /> components.`,
    )
  })

  it('doubles the value', async () => {
    const wrapper = mount(TestComponent, { global: { plugins: [appPlugin] } })
    await wrapper.get('[data-test="increment"]').trigger('click')
    expect(wrapper.get('[data-test="double"]').text()).toBe('2')
    await wrapper.get('[data-test="increment"]').trigger('click')
    expect(wrapper.get('[data-test="double"]').text()).toBe('4')
  })

  it('keeps the counter after toggling', async () => {
    const wrapper = mount(TestComponent, { global: { plugins: [appPlugin] } })
    await wrapper.get('[data-test="increment"]').trigger('click')
    expect(wrapper.get('[data-test="count"]').text()).toBe('1')
    await tipOnFail(
      () => wrapper.get('[data-test="toggle"]').trigger('click'),
      'The toggle button seems to be broken. Did you remove it?',
    )
    await wrapper.get('[data-test="toggle"]').trigger('click')
    expect(wrapper.get('[data-test="count"]').text()).toBe('1')
  })

  it('can increment the counter after toggling', async () => {
    const wrapper = mount(TestComponent, { global: { plugins: [appPlugin] } })
    await wrapper.get('[data-test="toggle"]').trigger('click')
    await wrapper.get('[data-test="toggle"]').trigger('click')
    await wrapper.get('[data-test="increment"]').trigger('click')
    expect(wrapper.get('[data-test="count"]').text()).toBe('1')
    await wrapper.get('[data-test="increment"]').trigger('click')
    expect(wrapper.get('[data-test="count"]').text()).toBe('2')
  })

  it('doubles the value after toggling', async () => {
    const wrapper = mount(TestComponent, { global: { plugins: [appPlugin] } })
    await wrapper.get('[data-test="toggle"]').trigger('click')
    await wrapper.get('[data-test="toggle"]').trigger('click')
    await wrapper.get('[data-test="increment"]').trigger('click')
    expect(wrapper.get('[data-test="double"]').text()).toBe('2')
    await wrapper.get('[data-test="increment"]').trigger('click')
    expect(wrapper.get('[data-test="double"]').text()).toBe('4')
  })
})
