import { describe, it, expect } from 'vitest'
import TestComponent from '../index.vue'
import CustomTest from './CustomTest.vue'
import { mount } from '@vue/test-utils'
import { useCountStore } from '../store'
import { defineStore } from '../my-pinia'
import { computed, isRef, nextTick, ref } from 'vue'

describe('custom defineStore', () => {
  it('useCountStore returns the same store object when called twice', async () => {
    const a = useCountStore()
    const b = useCountStore()
    expect(a).toBe(b)
  })

  it('uses the same store in two different components', async () => {
    const wrapper = mount(TestComponent)
    const wrapper2 = mount(TestComponent)
    const store = useCountStore()

    if (isRef(store.n)) {
      store.n.value = 10
    } else {
      // @ts-ignore: bonus exercise
      store.n = 10
    }
    await nextTick()

    expect(wrapper.find('[data-test=count]').text()).toBe('10')
    expect(wrapper2.find('[data-test=count]').text()).toBe('10')
  })

  it('defineStore defines a store', async () => {
    const useStore = defineStore(() => {
      const n = ref(0)
      const increment = (amount = 1) => {
        n.value += amount
      }
      const double = computed(() => n.value * 2)

      return { n, double, increment }
    })

    // @ts-ignore: ???
    const wrapper = mount(CustomTest, {
      props: { useStore },
    })

    expect(wrapper.find('[data-test=count]').text()).toBe('0')
    await wrapper.find('[data-test=increment]').trigger('click')
    expect(wrapper.find('[data-test=count]').text()).toBe('1')

    const store = useStore()
    if (isRef(store.n)) {
      store.n.value++
    } else {
      // @ts-ignore: bonus exercise
      store.n++
    }
    await nextTick()
    expect(wrapper.find('[data-test=count]').text()).toBe('2')
  })
})
