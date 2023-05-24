import { mount } from '@vue/test-utils'
import TestComponent from '../index.vue'
import { describe, it, expect } from 'vitest'
import { nextTick } from 'vue'
import { tipOnFail } from '@tests/utils'

describe('Tab Manager', () => {
  it('shows 4 tabs buttons', async () => {
    const wrapper = mount(TestComponent)
    await nextTick()

    const buttons = wrapper.findAll('button')
    expect(buttons).toHaveLength(4)
  })

  it('shows the correct tab content', async () => {
    const wrapper = mount(TestComponent)
    await nextTick()

    expect(wrapper.get('h2').text()).toContain('This is Tab 1')
  })

  it('disables the current tab button', async () => {
    const wrapper = mount(TestComponent)
    await nextTick()

    const buttons = wrapper.findAll('button')

    for (let i = 0; i < 4; i++) {
      expect(buttons[i].text()).toContain(`Tab ${i + 1} / 4`)
      if (i === 0) {
        expect(buttons[i].attributes('disabled')).not.toBeUndefined()
      } else {
        expect(buttons[i].attributes('disabled')).toBeUndefined()
      }
    }
  })

  it('changes the content when clicking on a tab button', async () => {
    const wrapper = mount(TestComponent)
    await nextTick()

    tipOnFail(() => {
      expect(wrapper.findAll('button')).toHaveLength(4)
    }, `Make sure to use <button> elements to allow changing the current tab. There should be 4 buttons rendered in your template unless you changed the value of the "n" variable in "index.vue".`)

    await wrapper.findAll('button').at(1)!.trigger('click')
    expect(wrapper.get('h2').text()).toContain('This is Tab 2')
    expect(wrapper.findAll('button').at(1)!.attributes('disabled')).not.toBeUndefined()
    expect(wrapper.findAll('button').at(0)!.attributes('disabled')).toBeUndefined()
  })

  it('adapts if the amount of tabs change', async () => {
    const wrapper = mount(TestComponent)
    await nextTick()

    await wrapper.get('[data-test="current-tab"]').setValue(7)
    const buttons = wrapper.findAll('button')
    expect(buttons).toHaveLength(7)
    for (let i = 0; i < 7; i++) {
      expect(buttons[i].text()).toContain(`Tab ${i + 1} / 7`)
    }
  })
})
