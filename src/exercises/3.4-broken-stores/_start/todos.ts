import { defineStore, acceptHMRUpdate } from 'pinia'
import { ref } from 'vue'

export interface TodoItem {
  id: string
  text: string
  finished: boolean
  createdAt: number
}

export const useTodosStore = defineStore('todos', () => {
  const todos = ref<TodoItem[]>([])
  return { todos }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTodosStore, import.meta.hot))
}
