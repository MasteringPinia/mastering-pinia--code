import { mount, renderToString } from '@vue/test-utils'
import ContactList from '../index.vue'
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { FunctionalComponent, defineComponent, h, nextTick, ref, useSlots } from 'vue'
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
      component: defineComponent({ setup: () => 'Dummy Route' }),
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

    it('fetches data automatically', async () => {
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

    it('useQuery: refetch returns a promise that resolves the value', async () => {
      const wrapper = mount({
        template: `<p>{{ data }}</p>`,
        setup() {
          let n = 0
          return {
            ...useQuery({
              key: 'test',
              fetcher: () => Promise.resolve(n++),
            }),
          }
        },
      })

      await vi.runAllTimersAsync()
      expect(wrapper.text()).toContain('0')
      // @ts-expect-error: vue test utils bug
      const promise = wrapper.vm.refetch().catch(() => {})
      expect(promise).toBeInstanceOf(Promise)
      expect(wrapper.text()).toContain('0')
      await expect(promise).resolves.toBe(1)
      expect(wrapper.text()).toContain('1')
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

    it('keeps the old data while fetching new data', async () => {
      const wrapper = mount({
        template: `<p>{{ data }}</p>`,
        setup() {
          let n = 0
          const { data, refetch } = useQuery({
            key: 'test',
            fetcher: () => Promise.resolve(n++),
          })

          return {
            refetch,
            data,
          }
        },
      })

      await vi.runAllTimersAsync()
      // @ts-expect-error: vue test utils bug
      wrapper.vm.refetch().catch(() => {})
      expect(wrapper.text()).toContain('0')
      await vi.runAllTimersAsync()
      expect(wrapper.text()).toContain('1')
    })

    it('keeps the old data if the fetch fails', async () => {
      const fetcher = vi.fn().mockResolvedValue('hello')
      const wrapper = mount({
        template: `<p>{{ data }}</p>`,
        setup() {
          const { data, refetch } = useQuery({
            key: 'test',
            fetcher,
          })

          return {
            refetch,
            data,
          }
        },
      })

      await vi.runAllTimersAsync()
      fetcher.mockRejectedValueOnce(new Error('fail'))
      // @ts-expect-error: vue test utils bug
      wrapper.vm.refetch().catch(() => {})
      await vi.runAllTimersAsync()
      expect(wrapper.text()).toContain('hello')
    })

    it('useQuery: has an isFetching property', async () => {
      const wrapper = mount({
        template: `<p>{{ isFetching }}</p>`,
        setup() {
          const { isFetching, refetch } = useQuery({
            key: 'test',
            fetcher: () => Promise.resolve('hello'),
          })

          return {
            refetch,
            isFetching,
          }
        },
      })

      await vi.runAllTimersAsync()
      expect(wrapper.text()).toContain('false')
      // @ts-expect-error: vue test utils bug
      wrapper.vm.refetch().catch(() => {})
      await nextTick()
      expect(wrapper.text()).toContain('true')
      await vi.runAllTimersAsync()
      expect(wrapper.text()).toContain('false')
    })

    it('useQuery: has an error property', async () => {
      const fetcher = vi.fn().mockResolvedValue('hello')
      const wrapper = mount({
        template: `<p>{{ error }}</p>`,
        setup() {
          const { error, refetch } = useQuery({
            key: 'test',
            fetcher,
          })

          return {
            refetch,
            error,
          }
        },
      })

      await vi.runAllTimersAsync()
      expect(wrapper.vm.error).toBe(null)
      fetcher.mockRejectedValueOnce(new Error('fail'))
      // @ts-expect-error: vue test utils bug
      wrapper.vm.refetch().catch(() => {})
      await vi.runAllTimersAsync()
      expect(wrapper.vm.error).toBeInstanceOf(Error)
    })

    it('useQuery: the error is null when the fetch succeeds', async () => {
      const fetcher = vi.fn().mockRejectedValueOnce(new Error('fail'))
      const wrapper = mount({
        template: `<p>{{ error }}</p>`,
        setup() {
          return useQuery({ key: 'test', fetcher })
        },
      })

      await vi.runAllTimersAsync()
      fetcher.mockResolvedValueOnce('hello')
      // @ts-expect-error: vue test utils bug
      wrapper.vm.refetch().catch(() => {})
      await vi.runAllTimersAsync()
      expect(wrapper.vm.error).toBe(null)
    })

    it('useQuery: refetch() should throw errors only when manually called', async () => {
      const store = useDataFetchingStore()
      const entry = store.ensureEntry('test', {
        key: 'test',
        fetcher: () => Promise.reject(new Error('fail')),
        ...USE_QUERY_DEFAULTS,
      })
      const result = await entry.refresh().catch(e => e)
      console.log(result)
      tipOnFail(() => {
        expect(result).toBeInstanceOf(Error)
      }, 'Make sure "refresh()" and "refetch()" throw errors **only** when manually called. You should still **catch** the errors when calling these within the store and useQuery() since the user cannot catch them.')
    })

    it('ensureQuery: refresh deduplicates calls', async () => {
      const store = useDataFetchingStore()
      const fetcher = vi.fn().mockResolvedValue('hello')
      const entry = store.ensureEntry('test', {
        key: 'test',
        fetcher,
        ...USE_QUERY_DEFAULTS,
      })
      entry.refresh()
      entry.refresh()
      await vi.runAllTimersAsync()
      expect(fetcher).toHaveBeenCalledTimes(1)
    })

    it('ensureQuery: refresh() skips fetching only if cache is not expired', async () => {
      const store = useDataFetchingStore()
      const fetcher = vi.fn().mockResolvedValue('hello')
      const entry = store.ensureEntry('test', {
        key: 'test',
        fetcher,
        ...USE_QUERY_DEFAULTS,
        cacheTime: 10,
      })
      await entry.refresh()
      await vi.runAllTimersAsync()
      expect(fetcher).toHaveBeenCalledTimes(1)
      vi.advanceTimersByTime(5)
      await entry.refresh()
      await entry.refresh()
      expect(fetcher).toHaveBeenCalledTimes(1)

      vi.advanceTimersByTime(11)
      await entry.refresh()
      expect(fetcher).toHaveBeenCalledTimes(2)
    })
  })

  describe('useMutation', () => {
    it('changes isFetching', async () => {
      const wrapper = mount({
        template: `<p>{{ isFetching }}</p>`,
        setup() {
          return {
            ...useMutation({
              keys: ['test'],
              mutator: () => Promise.resolve('hello'),
            }),
          }
        },
      })

      await vi.runAllTimersAsync()
      expect(wrapper.text()).toContain('false')
      // @ts-expect-error: vue test utils bug
      wrapper.vm.mutate()
      await nextTick()
      expect(wrapper.text()).toContain('true')
      await vi.runAllTimersAsync()
      expect(wrapper.text()).toContain('false')
    })

    it('changes data', async () => {
      const wrapper = mount({
        template: `<p>{{ data }}</p>`,
        setup() {
          return {
            ...useMutation({
              keys: ['test'],
              mutator: () => Promise.resolve('hello'),
            }),
          }
        },
      })

      // @ts-expect-error: vue test utils bug
      wrapper.vm.mutate()
      await vi.runAllTimersAsync()
      expect(wrapper.text()).toContain('hello')
    })

    it('changes error', async () => {
      const wrapper = mount({
        template: `<p>{{ error }}</p>`,
        setup() {
          return {
            ...useMutation({
              keys: ['test'],
              mutator: () => Promise.reject(new Error('fail')),
            }),
          }
        },
      })

      expect(wrapper.vm.error).toBe(null)
      // @ts-expect-error: vue test utils bug
      wrapper.vm.mutate()
      await vi.runAllTimersAsync()
      expect(wrapper.vm.error).toBeInstanceOf(Error)
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
