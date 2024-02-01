import { mount, renderToString } from '@vue/test-utils'
import ContactList from '../index.vue'
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { FunctionalComponent, h, nextTick, ref, useSlots } from 'vue'
import { type RouterLinkProps } from 'vue-router/auto'
import { mockHttpRequests } from '@tests/mocks/server'
import { createPinia, setActivePinia } from 'pinia'
import { useQuery, USE_QUERY_DEFAULTS } from '../use-query'
import { useMutation } from '../use-mutation'
import { getRouter } from 'vue-router-mock'
import { useDataFetchingStore } from '../data-fetching-store'
import { tipOnFail } from '@tests/utils'

describe('Data fetching', () => {
  beforeAll(() => {
    // avoid errors when using named navigations
    getRouter().addRoute({
      path: '/6.8-advanced-data-fetching/:id',
      name: '/6.8-advanced-data-fetching//[id]',
      component: () => 'Dummy Route',
    })
  })
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

  describe('useQuery', () => {
    it('ensureEntry: returns the same entry with the same key', async () => {
      const store = useDataFetchingStore()

      const entry = store.ensureEntry('test', {
        key: 'test',
        fetcher: () => Promise.resolve('hello'),
        ...USE_QUERY_DEFAULTS,
      })
      expect(entry).toBe(
        store.ensureEntry('test', {
          key: 'test',
          fetcher: () => Promise.resolve('hello'),
          ...USE_QUERY_DEFAULTS,
        }),
      )
    })

    it('fetches data', async () => {
      const wrapper = mount({
        template: `<p>{{ data }}</p>`,
        setup() {
          const { data } = useQuery({
            key: 'test',
            fetcher: () => Promise.resolve('hello'),
          })

          return {
            data,
          }
        },
      })

      await vi.runAllTimersAsync()

      expect(wrapper.text()).toContain('hello')
    })

    it('ensureEntry: it can call refetch', async () => {
      const store = useDataFetchingStore()

      const entry = store.ensureEntry('test', {
        key: 'test',
        fetcher: () => Promise.resolve('hello'),
        ...USE_QUERY_DEFAULTS,
      })
      expect(entry).toHaveProperty('refetch', expect.any(Function))
      await expect(entry.refetch()).resolves.toBe('hello')
    })

    it('refetch reuses pending fetches', async () => {
      const store = useDataFetchingStore()

      const fetcher = vi.fn().mockResolvedValue('hello')
      const entry = store.ensureEntry('test', {
        key: 'test',
        fetcher,
        ...USE_QUERY_DEFAULTS,
      })
      entry.refetch()
      entry.refetch()
      await vi.runAllTimersAsync()
      expect(fetcher).toHaveBeenCalledTimes(1)
    })

    it('useQuery: can use a reactive key', async () => {
      const wrapper = mount({
        template: `<p>{{ data }}</p>`,
        setup() {
          const key = ref('test')
          const { data } = useQuery({
            key,
            fetcher: () => Promise.resolve(key.value),
          })

          return {
            key,
            data,
          }
        },
      })

      await vi.runAllTimersAsync()
      tipOnFail(() => {
        expect(wrapper.text()).toContain('test')
      }, 'Use the "toValue()" helper from vue to get the value of a ref/getter/plain value')
    })

    it('useQuery: fetches again if the key changes', async () => {
      const fetcher = vi.fn()
      const wrapper = mount({
        template: `<p>{{ data }}</p>`,
        setup() {
          const key = ref('v1')
          fetcher.mockImplementation(() => Promise.resolve(key.value))
          const { data } = useQuery({
            key,
            fetcher,
          })

          return {
            key,
            data,
          }
        },
      })

      await vi.runAllTimersAsync()
      expect(wrapper.text()).toContain('v1')
      console.log(wrapper.vm.key)
      wrapper.vm.key = 'v2'
      console.log(wrapper.vm.key)
      await nextTick()
      await vi.runAllTimersAsync()
      await vi.runAllTimersAsync()
      console.log(wrapper.html())
      tipOnFail(() => {
        expect(fetcher).toHaveBeenCalledTimes(2)
      }, 'Use the "toValue()" helper from vue to get the value of a ref/getter/plain value')
    })
  })

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
