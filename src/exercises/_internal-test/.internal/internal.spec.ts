import { mount } from '@vue/test-utils'
import TestComponent from '../index.vue'
import { describe, it, expect } from 'vitest'

const delay = (t: number) => new Promise(r => setTimeout(r, t))

const IS_NOT_DEV = !!process.env.CI || process.env.IS_TEST_RUN === 'yes'

describe('Test Demo', () => {
  it('mounts a component', async () => {
    const wrapper = mount(TestComponent)

    expect(wrapper.text()).toContain('Template to start')
  })

  it.skip('skips tests', () => {
    // expect()
  })

  it.todo('marks tests as todo')
  it('I fail', () => {
    if (!IS_NOT_DEV) {
      expect(process.env.NODE_ENV).toBe('test')
      expect(false).toBe(true)
    }
  })

  it('shows messages tips', () => {
    console.log('__MESSAGE[tip] this should be a helpful tip')
    expect(true).toBe(true)
  })

  describe('nested group', () => {
    it('tests something that makes sense as a sentence', () => {
      expect(true).toBe(true)
    })

    for (let i = 0; i < 20; i++) {
      it(`Test sample ${i} to make it long`, () => {
        expect(true).toBe(true)
      })
    }
  })

  it('takes long', async () => {
    console.log('taking some time')
    await delay(IS_NOT_DEV ? 0 : 2000)
    console.log('done!!')
    expect(true).toBe(true)
  })
})
