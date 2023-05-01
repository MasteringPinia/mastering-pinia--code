import { mount } from '@vue/test-utils'
import TestComponent from '../index.vue'
import { describe, it, expect } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useDangoShop } from '../dango-shop'
import { nextTick } from 'vue'

describe('store state', () => {
  it('has cartAmount number state', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const dangoShop = useDangoShop()

    expect(dangoShop.$state).toHaveProperty('cartAmount', expect.any(Number))
  })

  it('uses the store within the index.vue', async () => {
    setActivePinia(undefined)

    mount(TestComponent, {
      global: {
        plugins: [createPinia()],
      },
    })

    const dangoShop = useDangoShop()
    expect(dangoShop.$state).toHaveProperty('cartAmount', expect.any(Number))
  })

  it('adds 1 to the cartAmount when clicking on the add button', async () => {
    const wrapper = mount(TestComponent, {
      global: {
        plugins: [createPinia()],
      },
    })

    const dangoShop = useDangoShop()
    dangoShop.cartAmount = 0
    await nextTick()
    await wrapper.get('[data-test="btn-add"]').trigger('click')
    expect(dangoShop.cartAmount).toBe(1)
    await wrapper.get('[data-test="btn-add"]').trigger('click')
    expect(dangoShop.cartAmount).toBe(2)
  })

  it('removes 1 to the cartAmount when clicking on the remove button', async () => {
    const wrapper = mount(TestComponent, {
      global: {
        plugins: [createPinia()],
      },
    })

    const dangoShop = useDangoShop()
    dangoShop.cartAmount = 2
    await nextTick()
    await wrapper.get('[data-test="btn-remove"]').trigger('click')
    expect(dangoShop.cartAmount).toBe(1)
    await wrapper.get('[data-test="btn-remove"]').trigger('click')
    expect(dangoShop.cartAmount).toBe(0)
  })

  it('displays the right amount of dangos', async () => {
    const wrapper = mount(TestComponent, {
      global: {
        plugins: [createPinia()],
      },
    })

    const dangoShop = useDangoShop()
    dangoShop.cartAmount = 0
    await nextTick()
    expect(wrapper.findAll('[data-test="dangos"]>div')).toHaveLength(0)
    dangoShop.cartAmount = 1
    await nextTick()
    expect(wrapper.findAll('[data-test="dangos"]>div')).toHaveLength(1)
    dangoShop.cartAmount = 2
    await nextTick()
    expect(wrapper.findAll('[data-test="dangos"]>div')).toHaveLength(2)
  })

  it('disables the add button if the cartAmount is more than 99', async () => {
    const wrapper = mount(TestComponent, {
      global: {
        plugins: [createPinia()],
      },
    })

    const dangoShop = useDangoShop()
    dangoShop.cartAmount = 99
    await nextTick()
    expect(wrapper.find('[data-test="btn-add"]').attributes('disabled')).toBe(undefined)
    dangoShop.cartAmount = 100
    await nextTick()
    expect(wrapper.find('[data-test="btn-add"]').attributes('disabled')).toBeDefined()
    dangoShop.cartAmount = 103
    await nextTick()
    expect(wrapper.find('[data-test="btn-add"]').attributes('disabled')).toBeDefined()
  })

  it('disables the remove button if the cartAmount is less than 1', async () => {
    const wrapper = mount(TestComponent, {
      global: {
        plugins: [createPinia()],
      },
    })

    const dangoShop = useDangoShop()
    dangoShop.cartAmount = 1
    await nextTick()
    expect(wrapper.find('[data-test="btn-remove"]').attributes('disabled')).toBe(undefined)
    dangoShop.cartAmount = 0
    await nextTick()
    expect(wrapper.find('[data-test="btn-remove"]').attributes('disabled')).toBeDefined()
  })

  it('shows the reset button if the cartAmount is more than 49', async () => {
    const wrapper = mount(TestComponent, {
      global: {
        plugins: [createPinia()],
      },
    })

    const dangoShop = useDangoShop()
    dangoShop.cartAmount = 49
    await nextTick()
    expect(wrapper.find('[data-test="btn-reset"]').exists()).toBe(false)
    dangoShop.cartAmount = 50
    await nextTick()
    expect(wrapper.find('[data-test="btn-reset"]').exists()).toBe(true)
    dangoShop.cartAmount = 53
    await nextTick()
    expect(wrapper.find('[data-test="btn-reset"]').exists()).toBe(true)
  })

  it('resets the cartAmount when clicking on the reset button', async () => {
    const wrapper = mount(TestComponent, {
      global: {
        plugins: [createPinia()],
      },
    })

    const dangoShop = useDangoShop()
    dangoShop.cartAmount = 50
    await nextTick()
    expect(wrapper.find('[data-test="btn-reset"]').exists()).toBe(true)
    await wrapper.get('[data-test="btn-reset"]').trigger('click')
    expect(dangoShop.cartAmount).toBe(0)
  })

  it('displays a message when the cartAmount is more than 49', async () => {
    const wrapper = mount(TestComponent, {
      global: {
        plugins: [createPinia()],
      },
    })

    const dangoShop = useDangoShop()
    dangoShop.cartAmount = 49
    await nextTick()
    expect(wrapper.find('[data-test="msg-huge-order"]').exists()).toBe(false)
    dangoShop.cartAmount = 50
    await nextTick()
    expect(wrapper.find('[data-test="msg-huge-order"]').exists()).toBe(true)
    dangoShop.cartAmount = 53
    await nextTick()
    expect(wrapper.find('[data-test="msg-huge-order"]').exists()).toBe(true)
  })
})
