import { mount } from '@vue/test-utils'
import TestComponent from '../index.vue'
import { describe, it, expect, vi, beforeEach, afterAll } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useDango } from '../dango'
import { tipOnFail, tipOnFailCaught } from '@tests/utils'
import { nextTick } from 'vue'

describe('store actions', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterAll(() => {
    vi.restoreAllMocks()
  })

  it('has an action named eatDango', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const dango = useDango()
    expect(dango.eatDango).toBeInstanceOf(Function)
  })

  it('does nothing if there are no dango left', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const dango = useDango()
    dango.amount = 0
    const state = { ...dango.$state }
    dango.eatDango()
    expect(state).toEqual(dango.$state)
  })

  it('increases eatenBalls by 1', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const dango = useDango()
    dango.amount = 1
    dango.eatDango()
    expect(dango.eatenBalls).toBe(1)
    expect(dango.amount).toBe(1)
  })

  it('decreases amount by 1 every 3 eaten balls', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const dango = useDango()
    dango.amount = 10
    dango.eatenBalls = 2
    dango.eatDango()
    expect(dango.eatenBalls).toBe(3)
    expect(dango.amount).toBe(9)
    dango.eatDango()
    expect(dango.eatenBalls).toBe(4)
    expect(dango.amount).toBe(9)
  })

  it('calls the eatDango action when clicking on the "Eat!" button', async () => {
    const wrapper = mount(TestComponent, {
      global: {
        plugins: [createPinia()],
      },
    })
    const dango = useDango()
    const eatSpy = vi.spyOn(dango, 'eatDango')
    await wrapper.get('[data-test="btn-eat"]').trigger('click')
    vi.runAllTimers()
    expect(eatSpy).toHaveBeenCalled()
  })

  it('has an action called startEating', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const dango = useDango()
    expect(dango.startEating).toBeInstanceOf(Function)
  })

  it('calls startEating when clicking on the "Start eating!" button', async () => {
    const wrapper = mount(TestComponent, {
      global: {
        plugins: [createPinia()],
      },
    })
    const dango = useDango()
    const startEatingSpy = vi.spyOn(dango, 'startEating')
    await wrapper.get('[data-test="btn-start-eating"]').trigger('click')
    expect(startEatingSpy).toHaveBeenCalled()
  })

  it('startEating returns a Promise', async () => {
    setActivePinia(createPinia())
    const dango = useDango()
    const spy = vi.spyOn(globalThis, 'setInterval')
    await tipOnFailCaught(
      async () => {
        dango.startEating()
        await vi.runAllTimersAsync()
        expect(spy).not.toHaveBeenCalled()
      },
      `You seem to be using setInterval but that would not allows us to return a Promise that resolves when the eating is done. Try to use "await" within a while loop instead:`,

      `\`\`\`js
while (this.amount > 0) {
  // wait 500ms
  await new Promise(resolve => setTimeout(resolve, 500))
}
\`\`\``,
    )
    tipOnFail(() => {
      expect(dango.startEating()).toBeInstanceOf(Promise)
    }, 'Make sure "startEating()" returns a Promise! Making it "async" should do the trick.')
  })

  it('startEating calls eatDango until no dangos are left', async () => {
    setActivePinia(createPinia())
    const dango = useDango()
    dango.amount = 2
    const eatSpy = vi.spyOn(dango, 'eatDango')
    dango.startEating()
    for (let i = 0; i < 6; i++) {
      await vi.runOnlyPendingTimersAsync()
      expect(eatSpy).toHaveBeenCalledTimes(i + 1)
    }

    await tipOnFail(async () => {
      await vi.runAllTimersAsync()
      expect(eatSpy).toHaveBeenCalledTimes(6)
    }, `You should stop eating when there are no dangos left`)
  })

  it('interrupts the eating when stopEating is called', async () => {
    setActivePinia(createPinia())
    const dango = useDango()
    dango.amount = 2
    const eatSpy = vi.spyOn(dango, 'eatDango')
    dango.startEating()
    await vi.runOnlyPendingTimersAsync()
    expect(eatSpy).toHaveBeenCalledTimes(1)
    dango.stopEating()
    await tipOnFail(async () => {
      await vi.runAllTimersAsync()
      expect(eatSpy).toHaveBeenCalledTimes(1)
    }, `Did you check the value of "isEating" within startEating?`)
  })

  it('calls stopEating when clicking on the "Stop!" button', async () => {
    const wrapper = mount(TestComponent, {
      global: {
        plugins: [createPinia()],
      },
    })
    const dango = useDango()
    dango.isEating = true
    await nextTick()
    const stopSpy = vi.spyOn(dango, 'stopEating')
    await wrapper.get('[data-test="btn-stop-eating"]').trigger('click')
    expect(stopSpy).toHaveBeenCalledTimes(1)
  })
})
