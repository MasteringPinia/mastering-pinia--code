import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface TodoItem {
  id: string
  text: string
  finished: boolean
  createdAt: number
}

export const useTodosStore = defineStore('todo', () => {
  const todos = ref<TodoItem[]>([])

  const finishedTodos = computed(() => todos.value.filter(todo => todo.finished))
  const unfinishedTodos = computed(() => todos.value.filter(todo => !todo.finished))

  function addTodo(text: string) {
    todos.value.push({
      id: crypto.randomUUID(),
      text,
      finished: false,
      createdAt: Date.now(),
    })
  }

  function updateTodo(updatedTodo: TodoItem) {
    const index = todos.value.findIndex(todo => todo.id === updatedTodo.id)
    if (index > -1) {
      todos.value.splice(index, 1, updatedTodo)
    }
  }

  function removeTodo(todoId: string) {
    const index = todos.value.findIndex(todo => todo.id === todoId)
    if (index > -1) {
      todos.value.splice(index, 1)
    }
  }
  return {
    todos,
    finishedTodos,
    unfinishedTodos,
    addTodo,
    updateTodo,
    removeTodo,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTodosStore, import.meta.hot))
}
