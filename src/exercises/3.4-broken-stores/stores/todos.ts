import { defineStore, acceptHMRUpdate } from 'pinia'
import { computed, ref } from 'vue'

export interface TodoItem {
  id: string
  text: string
  finished: boolean
  createdAt: number
}

export const useTodosStore = defineStore('todos', () => {
  const list = ref<TodoItem[]>([])

  const finished = computed<TodoItem[]>(() => list.value.filter(todo => todo.finished))
  const unfinished = computed<TodoItem[]>(() => list.value.filter(todo => !todo.finished))

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

    add,
    update,
    remove,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTodosStore, import.meta.hot))
}
