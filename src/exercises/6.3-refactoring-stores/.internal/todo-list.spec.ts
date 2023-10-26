import { mount } from '@vue/test-utils'
import TestComponent from '../index.vue'
import { describe, it, expect, beforeEach } from 'vitest'
import { useTodosStore } from '../stores/todos'
import { useTasksStore } from '../stores/tasks'
import { createPinia, getActivePinia, setActivePinia } from 'pinia'
import { tipOnFail } from '@tests/utils'
import { nextTick } from 'vue'
import TaskActiveVue from '../components/TaskActive.vue'

const taskKeys = [
  'finishedTasks',
  'activeTask',
  'startedTasks',
  'hasActiveTodo',
  'startTodo',
  'pauseCurrentTodo',
  'finishCurrentTodo',
  'isTodoStarted',
]

const todoKeys = [
  // for format
  'list',
  'finishedList',
  'unfinishedList',
  'add',
  'update',
  'remove',
]

describe('Refactoring Stores', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    window.localStorage.clear()
  })

  describe('working application', () => {
    it('adds todos', async () => {
      const wrapper = mount(TestComponent)
      await nextTick() // <ClientOnly>

      const form = wrapper.get('form[data-test="add-todo"]')
      await form.get('input').setValue('test')
      await form.trigger('submit')
      expect(wrapper.get('[data-test="todo-list"]').text()).toContain('test')
      await form.get('input').setValue('test 2 ')
      await form.trigger('submit')
      expect(wrapper.get('[data-test="todo-list"]').text()).toContain('test 2')

      expect(wrapper.findAll('[data-test="todo-list"] li')).toHaveLength(2)
    })

    it('removes todos', async () => {
      const wrapper = mount(TestComponent)
      await nextTick() // <ClientOnly>

      const form = wrapper.get('form[data-test="add-todo"]')
      await form.get('input').setValue('test')
      await form.trigger('submit')

      await wrapper.get('[data-test="todo-btn-start-edit"]').trigger('click')
      await wrapper.get('form[data-test="todo-edit"] input').setValue('edited')
      await wrapper.get('form[data-test="todo-edit"]').trigger('submit')

      expect(wrapper.get('[data-test="todo-list"]').text()).toContain('edited')
    })

    it('starts todos', async () => {
      const wrapper = mount(TestComponent)
      await nextTick() // <ClientOnly>

      const form = wrapper.get('form[data-test="add-todo"]')
      await form.get('input').setValue('test')
      await form.trigger('submit')

      await wrapper.get('[data-test="todo-btn-start-todo"]').trigger('click')
      expect(wrapper.get('[data-test="task-active"]').text()).toContain('test')
    })
  })

  describe('todos store', () => {
    it('does not expose tasks properties', async () => {
      const todos = useTodosStore()

      for (const key of taskKeys) {
        expect(todos).not.toHaveProperty(key)
      }
    })

    it('exposes all of the todos properties', async () => {
      const todos = useTodosStore()

      for (const key of todoKeys) {
        expect(todos).toHaveProperty(key)
      }
    })
  })

  describe('tasks store', () => {
    it('tasks related properties', () => {
      const tasks = useTasksStore()

      for (const key of taskKeys) {
        expect(tasks).toHaveProperty(key)
      }
    })

    it('does not expose todos properties', () => {
      const tasks = useTasksStore()

      for (const key of todoKeys) {
        expect(tasks).not.toHaveProperty(key)
      }
    })

    it('relies on the todos store', () => {
      // tip about nested stores
      const pinia = getActivePinia()!
      expect(pinia.state.value).not.toHaveProperty('6.3-todos')
      useTasksStore()
      tipOnFail(() => {
        expect(pinia.state.value).toHaveProperty('6.3-todos')
      }, `Make sure to call "useTodosStore()" within the tasks store to get access to the list`)
      expect(pinia.state.value).toHaveProperty('6.3-tasks')
    })
  })

  describe('Extra goals', () => {
    it('TaskActive does not use the store', async () => {
      mount(TaskActiveVue, {
        props: {
          task: {
            createdAt: Date.now(),
            end: null,
            id: 'test',
            todo: {
              createdAt: Date.now(),
              finished: false,
              id: 'test',
              text: 'test',
              createdBy: null,
            },
            todoId: 'test',
            totalTime: 0,
          },
        },
      })
      expect(getActivePinia()!.state.value).not.toHaveProperty('6.3-tasks')
    })
  })
})
