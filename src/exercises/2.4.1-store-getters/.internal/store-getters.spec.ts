import { mount } from '@vue/test-utils'
import TestComponent from '../index.vue'
import { describe, it, expect } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useDangoShop } from '../dango-shop'
import { nextTick } from 'vue'

describe('store getters', () => {
  it('has a totalPrice getter', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const dangoShop = useDangoShop()
    expect(dangoShop.totalPrice).toBe(0)
    dangoShop.amount = 1
    await nextTick()
    expect(dangoShop.totalPrice).toBe(350)
    dangoShop.amount = 98
    await nextTick()
    expect(dangoShop.totalPrice).toBe(34300)
  })

  it('displays the total amount without a discount', async () => {
    setActivePinia(undefined)

    const wrapper = mount(TestComponent, {
      global: {
        plugins: [createPinia()],
      },
    })
    const dangoShop = useDangoShop()
    dangoShop.amount = 1
    await nextTick()
    expect(wrapper.get('[data-test="price-message"]').text()).toContain('¥350')
  })

  it('discounts the price when the amount is 3 or more', async () => {
    setActivePinia(undefined)

    const wrapper = mount(TestComponent, {
      global: {
        plugins: [createPinia()],
      },
    })
    const dangoShop = useDangoShop()
    dangoShop.amount = 3
    await nextTick()
    expect(wrapper.get('[data-test="price-message"]').text()).toContain('¥945')
  })

  it('discounts the price when the amount is 5 or more', async () => {
    setActivePinia(undefined)

    const wrapper = mount(TestComponent, {
      global: {
        plugins: [createPinia()],
      },
    })
    const dangoShop = useDangoShop()
    dangoShop.amount = 5
    await nextTick()
    expect(wrapper.get('[data-test="price-message"]').text()).toContain('¥1488')
  })

  it('discounts the price when the amount is 10 or more', async () => {
    setActivePinia(undefined)

    const wrapper = mount(TestComponent, {
      global: {
        plugins: [createPinia()],
      },
    })
    const dangoShop = useDangoShop()
    dangoShop.amount = 10
    await nextTick()
    expect(wrapper.get('[data-test="price-message"]').text()).toContain('¥2800')
  })

  it('displays the total amount even with a discount', async () => {
    setActivePinia(undefined)

    const wrapper = mount(TestComponent, {
      global: {
        plugins: [createPinia()],
      },
    })
    const dangoShop = useDangoShop()
    dangoShop.amount = 3
    await nextTick()
    expect(wrapper.get('[data-test="price-message"]').text()).toContain('¥945')
  })

  it('does not display the discount message when the amount is less than 3', async () => {
    setActivePinia(undefined)

    const wrapper = mount(TestComponent, {
      global: {
        plugins: [createPinia()],
      },
    })
    const dangoShop = useDangoShop()
    dangoShop.amount = 2
    await nextTick()
    expect(wrapper.get('[data-test="price-message"]').text()).toContain('¥700')
  })

  it('does not display the discount price when the amount is less than 3', async () => {
    setActivePinia(undefined)

    const wrapper = mount(TestComponent, {
      global: {
        plugins: [createPinia()],
      },
    })
    const dangoShop = useDangoShop()
    dangoShop.amount = 2
    await nextTick()
    expect(wrapper.get('[data-test="price-message"]').text()).not.toContain(/¥700\s*¥700/)
  })

  it('displays the amount without the discount alongside the discounted price', async () => {
    setActivePinia(undefined)

    const wrapper = mount(TestComponent, {
      global: {
        plugins: [createPinia()],
      },
    })
    const dangoShop = useDangoShop()
    dangoShop.amount = 3
    await nextTick()
    expect(wrapper.get('[data-test="price-message"]').text()).toContain('¥945')
    expect(wrapper.get('[data-test="price-message"]').text()).toContain('¥1050')
  })

  it('displays how much the person is saving', async () => {
    setActivePinia(undefined)

    const wrapper = mount(TestComponent, {
      global: {
        plugins: [createPinia()],
      },
    })
    const dangoShop = useDangoShop()
    dangoShop.amount = 3
    await nextTick()
    expect(wrapper.get('[data-test="price-message"]').text()).toContain('¥105')

    dangoShop.amount = 5
    await nextTick()
    expect(wrapper.get('[data-test="price-message"]').text()).toContain('¥262')

    dangoShop.amount = 98
    await nextTick()
    expect(wrapper.get('[data-test="price-message"]').text()).toContain('¥6860')
  })
})
