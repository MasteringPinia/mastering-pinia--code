import { mount } from '@vue/test-utils'
import TestComponent from '../index.vue'
import { describe, it, expect, vi } from 'vitest'
import { createPinia } from 'pinia'
import { useGradientGenerator } from '../gradient-generator'
import { tipOnFail } from '@tests/utils'

describe('Gradient Generator', () => {
  it('has a color property', async () => {
    const gradient = useGradientGenerator()

    tipOnFail(() => {
      expect(gradient.$state).toHaveProperty('colors')
    }, 'The `colors` property is missing from the store state.')
    tipOnFail(() => {
      expect(gradient.$state.colors).toHaveProperty('length')
    }, 'The `colors` property should be an array.')
  })

  it('has a computed with the linear-gradient', async () => {
    const gradient = useGradientGenerator()

    tipOnFail(() => {
      const stateKeys = Object.keys(gradient.$state) as Array<keyof typeof gradient.$state>
      for (const key of stateKeys) {
        if (
          typeof gradient.$state[key] === 'string' &&
          // @ts-ignore: ts bug?
          gradient.$state[key].includes('linear-gradient')
        ) {
          throw new Error(`The gradient shouldn't not be state`)
        }
      }
    }, 'The `background` computed should not be in the state. It should be a computed property.')

    const keys = Object.keys(gradient) as Array<keyof typeof gradient>
    if (
      !keys.some(
        key =>
          typeof gradient[key] === 'string' &&
          // @ts-ignore: ts bug?
          gradient[key].includes('linear-gradient'),
      )
    ) {
      throw new Error('missing linear-gradient')
    }
  })

  it.skip('sets the background color', async () => {
    const wrapper = mount(TestComponent, {
      global: {
        plugins: [createPinia()],
      },
    })

    const el = wrapper.get('.gradient-preview').element
    console.log(window.getComputedStyle(el).background)
    // expect(window.getComputedStyle(el).backgroundColor).toBe(
    //   'linear-gradient(90deg, rgb(0, 201, 255), rgb(146, 254, 157))',
    // )
  })

  it('copies the gradient as a CSS rule to the clipboard', async () => {
    if (!navigator.clipboard) {
      // @ts-expect-error: readonly
      navigator.clipboard = {
        writeText: vi.fn(() => Promise.resolve()),
        readText: vi.fn(() => Promise.resolve('read')),
      }
    } else {
      vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined)
      vi.spyOn(navigator.clipboard, 'readText').mockResolvedValue('read')
    }
    const wrapper = mount(TestComponent, {
      global: {
        plugins: [createPinia()],
      },
    })

    await wrapper.get('[data-test="btn-clipboard"]').trigger('click')
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      expect.stringMatching(/background-image: linear-gradient\([^)]+\);/),
    )
  })
})
