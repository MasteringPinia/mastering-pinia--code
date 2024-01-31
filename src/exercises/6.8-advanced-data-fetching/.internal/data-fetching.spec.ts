import { mount, renderToString } from '@vue/test-utils'
import ContactList from '../index.vue'
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { FunctionalComponent, h, useSlots } from 'vue'
import { type RouterLinkProps } from 'vue-router/auto'
import { mockHttpRequests } from '@tests/mocks/server'
import { createPinia, setActivePinia } from 'pinia'
import { useQuery } from '../use-query'
import { useMutation } from '../use-mutation'

describe('Data fetching', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.useFakeTimers()
  })
  afterAll(() => {
    vi.restoreAllMocks()
  })
  // must be set after timers
  mockHttpRequests()

  const RouterLink = (props => {
    const slots = useSlots()
    return h('a', typeof props.to === 'object' ? { ...props.to } : { ...props }, slots.default?.())
  }) satisfies FunctionalComponent<RouterLinkProps>

  describe('Contact List features', () => {
    it('renders on the server', async () => {
      const html = await renderToString(ContactList, {
        global: {
          stubs: { RouterLink },
        },
      })

      expect(html).toContain('Ana Naas')
    })

    it('displays all elements when input is empty', async () => {
      const wrapper = mount(ContactList, {
        global: {
          stubs: { RouterLink },
        },
      })

      await vi.runAllTimersAsync()
      await wrapper.find('input[type=search]').setValue('nothing')
      await vi.runAllTimersAsync()
      await wrapper.find('input[type=search]').setValue('')
      await vi.runAllTimersAsync()

      // all contacts
      expect(wrapper.findAll('li')).toHaveLength(5)
    })

    it('filters contacts when searching', async () => {
      const wrapper = mount(ContactList, {
        global: {
          stubs: { RouterLink },
        },
      })

      await vi.runAllTimersAsync()
      await wrapper.find('input[type=search]').setValue('Eduardo')
      await vi.runAllTimersAsync()

      expect(wrapper.findAll('li')).toHaveLength(1)
    })
  })
})
