import Component from '../index.vue'
import { useLocalStorage } from '../useLocalStorage'
import { mount } from '@vue/test-utils'
import { nextTick, Ref } from 'vue'
import { describe, it, expect, beforeEach, afterAll, vi } from 'vitest'

describe('Local Storage Composable', () => {
  const warnSpy = vi.spyOn(console, 'warn')
  const addEventListenerSpy = vi.spyOn(window, 'addEventListener')
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  afterAll(() => {
    vi.restoreAllMocks()
  })

  function tipMissingEventListener() {
    if (!addEventListenerSpy.mock.calls.some(args => args[0] === 'storage' && typeof args[1] === 'function')) {
      console.log(
        '__MESSAGE[tip] There is an event emitted by window when the local storage changes. You might want to lookup "storage event" on MDN',
      )
    }
  }

  function wrappedWithComponent(...args: Parameters<typeof useLocalStorage>) {
    let data!: Ref
    mount({
      setup() {
        data = useLocalStorage(...args)
        return () => null
      },
    })

    return data
  }

  function triggerStorageEvent(key: string, value: any) {
    const newValue = value != null ? JSON.stringify(value) : value
    const oldValue = localStorage.getItem(key)
    const storageEvent = new StorageEvent('storage', { key, newValue, oldValue })

    window.dispatchEvent(storageEvent)
  }

  it('sets the initial value to the provided parameter', async () => {
    const data = wrappedWithComponent('@test', 'initial value')
    expect(data.value).toBe('initial value')
  })

  it('data can be changed like a regular ref', async () => {
    const data = wrappedWithComponent('@test', 0)
    data.value = 3
    expect(data.value).toBe(3)
  })

  it('saves data to localStorage when changed', async () => {
    const data = wrappedWithComponent('@test', 0)
    tipMissingEventListener()
    data.value = 3
    await nextTick()
    expect(localStorage.getItem('@test')).toBe('3')
  })

  it('the input is connected to the local storage', async () => {
    let wrapper = mount(Component)
    await wrapper.find('[data-test=name]').setValue('Foo')
    expect(wrapper.find('p').text()).toContain('Hi Foo')
    wrapper.unmount()
    await nextTick()

    wrapper = mount(Component)
    expect(wrapper.find('p').text()).toContain('Hi Foo')
  })

  it('reacts to changes from storage (different tab)', async () => {
    const data = wrappedWithComponent('@test', 'foo')
    triggerStorageEvent('@test', 'bar')
    await nextTick()
    expect(data.value).toEqual('bar')
  })

  it('initial value as a number', async () => {
    const data = wrappedWithComponent('@test', 0)
    expect(data.value).toBe(0)
  })

  it('starts the counter at 0', async () => {
    const wrapper = mount(Component)
    expect(wrapper.find('p').text()).toContain('0 times')
  })

  it('increment and saves the counter with the button', async () => {
    let wrapper = mount(Component)
    await wrapper.find('button').trigger('click')
    expect(wrapper.find('p').text()).toContain('1 times')
    wrapper.unmount()
    await nextTick()

    wrapper = mount(Component)
    expect(wrapper.find('p').text()).toContain('1 times')
  })

  it('resets the value when manually deleted from storage', async () => {
    const data = wrappedWithComponent('@test', 'foo')
    triggerStorageEvent('@test', 'bar')
    triggerStorageEvent('@test', null)
    await nextTick()
    expect(data.value).toEqual('foo')
  })

  it('removes the "storage" event when unmounting', async () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')
    const wrapper = mount({
      setup() {
        useLocalStorage('@test', '')
        return () => null
      },
    })

    expect(removeEventListenerSpy).not.toHaveBeenCalled()
    wrapper.unmount()
    await nextTick()
    expect(removeEventListenerSpy).toHaveBeenCalledTimes(1)
    if (!removeEventListenerSpy.mock.calls.some((args) => args[0] === 'storage' && typeof args[1] === 'function')) {
      console.log(
        '__MESSAGE[tip] Make sure to pass a second argument to "window.removeEventListener()" or you will be removing all storage events.',
      )
      // throw new Error('All storage events were removed')
    }
  })

  it('initial value as an object', async () => {
    const data = wrappedWithComponent('@test', { a: 'foo' })
    expect(data.value).toEqual({ a: 'foo' })
  })

  it('clears the storage if the value is the same as default', async () => {
    const data = wrappedWithComponent('@test', 'foo')
    data.value = 'bar'
    await nextTick()
    data.value = 'foo'
    await nextTick()
    expect(data.value).toEqual('foo')
    expect(localStorage.getItem('@test')).toEqual(null)
  })

  it.skip('works outside of a component', async () => {
    const data = useLocalStorage('@test', 0)
    if (warnSpy.mock.calls.some((args) => args[0].match(/Vue warn.*mounted is called/i))) {
      console.log(
        `__MESSAGE[tip] Remember to only call onMounted()/onUnmounted() if we are inside of a component. You can use getCurrentInstance() to detect that.`,
      )
    }
    data.value = 3
    await nextTick()
    expect(localStorage.getItem('@test')).toBe('3')
  })
})
