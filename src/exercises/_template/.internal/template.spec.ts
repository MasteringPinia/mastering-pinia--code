import { mount } from '@vue/test-utils'
import TestComponent from '../index.vue'
import { describe, it, expect } from 'vitest'


describe('TODO:', () => {
  it('mounts a component', async () => {
    const wrapper = mount(TestComponent)

    expect(wrapper.text()).toContain('Template to start')
  })
})
