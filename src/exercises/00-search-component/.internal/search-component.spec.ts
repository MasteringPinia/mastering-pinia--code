import { mockHttpRequests, delay } from '@tests/mocks/server'
import TestComponent from '../index.vue'
import { disableAutoUnmount, enableAutoUnmount, mount } from '@vue/test-utils'
import { getRouter } from 'vue-router-mock'
import { useQueryParam } from '../useQueryParam'
import AppPaginator from '../AppPaginator.vue'
import { describe, it, expect, beforeEach, afterEach, afterAll, vi, SpyInstance } from 'vitest'

// TODO: add other tests for the instructions

describe('Search Component', () => {
  let router = getRouter()
  let pushSpy = router.push as SpyInstance

  mockHttpRequests()

  enableAutoUnmount(afterEach)
  afterAll(disableAutoUnmount)

  beforeEach(async () => {
    router = getRouter()
    pushSpy = router.push as SpyInstance
    router.reset()
    await router.push('/')
    vi.clearAllMocks()
  })

  afterAll(async () => {
    await router.getPendingNavigation()
    vi.restoreAllMocks()
  })

  it('can change the page', async () => {
    const wrapper = mount(TestComponent, { attachTo: document.body })
    await wrapper.get('form input').setValue('sales')
    await wrapper.get('form').trigger('submit')
    await delay(20)
    await wrapper.get('button[data-test=next]').trigger('click')
    await router.getPendingNavigation()
    expect(wrapper.get('[data-test=text]').text()).toBe('2 / 5')
  })

  it('computes the total number of pages', async () => {
    const wrapper = mount(AppPaginator, {
      props: {
        currentPage: 1,
        perPage: 10,
        total: 50,
      },
    })

    expect(wrapper.get('[data-test=text]').text()).toBe('1 / 5')
  })

  it('disables the previous button on the first page', async () => {
    const wrapper = mount(AppPaginator, {
      props: {
        currentPage: 1,
        perPage: 10,
        total: 50,
      },
    })

    expect(wrapper.get('[data-test=previous]').attributes('disabled')).toBeDefined()
    expect(wrapper.get('[data-test=next]').attributes('disabled')).toBeUndefined()
  })

  it('disables the next button on the last page', async () => {
    const wrapper = mount(AppPaginator, {
      props: {
        currentPage: 5,
        perPage: 10,
        total: 50,
      },
    })

    expect(wrapper.get('[data-test=next]').attributes('disabled')).toBeDefined()
    expect(wrapper.get('[data-test=previous]').attributes('disabled')).toBeUndefined()
  })

  it('handles the amount of pages correctly', async () => {
    const wrapper = mount(AppPaginator, {
      props: {
        currentPage: 1,
        perPage: 10,
        total: 51,
      },
    })

    expect(wrapper.get('[data-test=text]').text()).toBe('1 / 6')
  })

  it('triggers changes of the page when pressing next', async () => {
    const wrapper = mount(AppPaginator, {
      props: {
        currentPage: 1,
        perPage: 10,
        total: 51,
      },
    })

    await wrapper.get('[data-test=next]').trigger('click')
    expect(wrapper.emitted('update:currentPage')).toEqual([[2]])
  })

  it('show results when using the form', async () => {
    const wrapper = mount(TestComponent)
    await wrapper.get('form input').setValue('sales')
    await wrapper.get('form').trigger('submit')
    await delay(20)

    const contacts = wrapper.findAll('ul li')
    expect(contacts.length).toBe(12)
    contacts.forEach((contact, i) => {
      expect(contact.text().trim()).toMatchSnapshot(`contact i${i}`)
    })
  })

  it.todo('shows an empty results message')
  it.todo('can customize with a slot #no-results the empty results message')
  it.todo('shows an error message')
  it.todo('can customize with a slot #error the error message')
  it.todo('customize the results of SearchPaginator')
  it.todo('displays a loading state while fetching')
  it.todo('waits 200ms before displaying the loading state')

  // describe('router', () => {

  it('uses the searchText query for the search', async () => {
    await router.setQuery({ searchText: 'john' })
    const wrapper = mount(TestComponent)
    expect(wrapper.get<HTMLInputElement>('form input').element.value).toBe('john')
  })

  it.todo('uses the page query for the search')

  it('updates the input with searchQuery when navigating', async () => {
    const wrapper = mount(TestComponent)
    await router.setQuery({ searchText: 'john' })
    expect(router.currentRoute.value.query.searchText).toBe('john')
    expect(wrapper.get<HTMLInputElement>('form input').element.value).toBe('john')
  })

  it('saves the search text on the url', async () => {
    const wrapper = mount(TestComponent)
    // expect(pushSpy.callCount).toBe(1)
    await wrapper.get('form input').setValue('jason')
    await wrapper.get('form').trigger('submit')
    await router.getPendingNavigation()
    // expect(pushSpy.callCount).toBe(2)
    expect(router.currentRoute.value.query).toMatchObject({
      searchText: 'jason',
    })

    it('calls router.push() once when changing multiple query params', async () => {
      pushSpy.mockClear()
      const wrapper = mount({
        setup() {
          const a = useQueryParam('a')
          const b = useQueryParam('b')

          return { a, b }
        },
        render: () => null,
      })

      expect(pushSpy).toHaveBeenCalledTimes(0)

      wrapper.vm.a = 'c'
      wrapper.vm.b = 'c'
      expect(pushSpy).toHaveBeenCalledTimes(0)

      await delay(20)
      expect(pushSpy).toHaveBeenCalledTimes(1)
    })
  })

  // })
})
