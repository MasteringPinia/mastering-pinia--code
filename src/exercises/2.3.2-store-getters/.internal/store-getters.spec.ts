import { mount } from '@vue/test-utils'
import TestComponent from '../index.vue'
import { describe, it, expect } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useDangoShop } from '../dango-shop'

describe('store getters', () => {
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
})
