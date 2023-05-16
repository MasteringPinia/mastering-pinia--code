import { mount } from '@vue/test-utils'
import TestComponent from '../index.vue'
import { describe, it, expect } from 'vitest'
import { createPinia } from 'pinia'

describe('TODO:', () => {
  it('mounts a component', async () => {
    const wrapper = mount(TestComponent, {
      global: {
        plugins: [createPinia()],
      },
    })

    expect(wrapper.text()).toContain('Template to start')
  })
})
