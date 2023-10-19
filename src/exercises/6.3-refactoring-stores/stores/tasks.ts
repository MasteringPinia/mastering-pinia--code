import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref, computed, shallowReactive } from 'vue'
import { useTodosStore } from './todos'

export interface TodoTaskActive {
  id: string
  start: number
}

export interface TodoTask extends TodoTaskActive {
  end: number
  totalTime: number
}

export interface TodoTaskPaused extends Omit<TodoTask, 'end'> {}

export const useTasksStore = defineStore('tasks', () => {
  const todosStore = useTodosStore()

  const finishedTasks = ref<TodoTask[]>([])
  const pausedTasks = shallowReactive(new Map<string, TodoTaskPaused>())
  const activeTask = ref<TodoTaskActive | null>(null)

  const hasActiveTodo = computed<boolean>(() => !!activeTask.value)

  function startTodo(todoId: string) {
    const existingTodo = todosStore.todos.find(todo => todo.id === todoId)
    if (!existingTodo) {
      console.warn(`Todo with id ${todoId} does not exist`)
      return
    }
    if (existingTodo.finished) {
      console.warn(`Todo with id ${todoId} is already finished`)
      return
    }

    if (activeTask.value) {
      const existingTask = pausedTasks.get(activeTask.value.id)
      pausedTasks.set(todoId, {
        ...activeTask.value,
        totalTime: (existingTask?.totalTime ?? 0) + Date.now() - activeTask.value.start,
      })
    }
    activeTask.value = {
      id: todoId,
      start: Date.now(),
    }
  }

  function finishCurrentTodo() {
    if (!activeTask.value) {
      return
    }

    const todo = todosStore.todos.find(todo => todo.id === activeTask.value!.id)
    if (todo) {
      todo.finished = true
      const end = Date.now()
      finishedTasks.value.push({
        ...activeTask.value,
        end,
        totalTime: end - activeTask.value.start,
      })
      activeTask.value = null
    }
  }

  return {
    finishedTasks,
    activeTask,
    hasActiveTodo,
    startTodo,
    finishCurrentTodo,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTodosStore, import.meta.hot))
}
