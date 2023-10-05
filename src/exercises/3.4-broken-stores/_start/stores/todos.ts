import { useLocalStorage } from '@vueuse/core'
import { defineStore, acceptHMRUpdate, skipHydrate } from 'pinia'
import { computed } from 'vue'

export interface TodoItem {
  id: string
  text: string
  finished: boolean
  createdAt: number
}

export const useTodosStore = defineStore('todos', () => {
  const list = skipHydrate(useLocalStorage<TodoItem[]>('mastering-pinia-3.4 todolist', []))

  const finished = computed<TodoItem[]>(() => list.value.filter(todo => todo.finished))
  const unfinished = computed<TodoItem[]>(() => list.value.filter(todo => !todo.finished))

  const mostRecent = computed<TodoItem | undefined>(() => {
    return list.value
      .slice()
      .sort((a, b) => b.createdAt - a.createdAt)
      .at(0)
  })

  function add(text: string) {
    list.value.push({
      id: crypto.randomUUID(),
      text,
      finished: false,
      createdAt: Date.now(),
    })
  }

  function update(updatedTodo: TodoItem) {
    const index = list.value.findIndex(todo => todo.id === updatedTodo.id)
    if (index > -1) {
      list.value.splice(index, 1, updatedTodo)
    }
  }

  function remove(id: string) {
    const index = list.value.findIndex(todo => todo.id === id)
    if (index > -1) {
      list.value.splice(index, 1)
    }
  }

  return {
    list,
    finished,
    unfinished,
    mostRecent,

    add,
    update,
    remove,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTodosStore, import.meta.hot))
}
