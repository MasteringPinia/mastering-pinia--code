import { mount } from '@vue/test-utils'
import TestComponent from '../index.vue'
import { describe, it, expect } from 'vitest'

describe('Refactoring Stores', () => {
  describe('working application', () => {
    it('mounts a component', async () => {
      const wrapper = mount(TestComponent)

      expect(wrapper.text().length).toBeGreaterThan(0)
    })
  })

  describe('todos store', () => {
    it('does not expose tasks', async () => {})
  })

  describe('tasks store', () => {
    it('exposes a list of tasks', () => {})
  })
})
