import { mount } from '@vue/test-utils'
import TestComponent from '../index.vue'
import { describe, it, expect } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useDango } from '../dango'
import { nextTick } from 'vue'

describe('store getters', () => {
  it('has a totalPrice getter', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const dangoShop = useDango()
  })

  it('displays the total amount without a discount', async () => {
    setActivePinia(undefined)

    const wrapper = mount(TestComponent, {
      global: {
        plugins: [createPinia()],
      },
    })
    const dangoShop = useDango()
    dangoShop.amount = 1
    await nextTick()
    expect(wrapper.get('[data-test="price-message"]').text()).toContain('¥350')
  })
})
