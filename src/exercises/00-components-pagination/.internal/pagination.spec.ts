import { mount } from '@vue/test-utils'
import AppPaginator from '../AppPaginator.vue'
import { describe, it, expect } from 'vitest'

describe('AppPaginator', () => {
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
})
