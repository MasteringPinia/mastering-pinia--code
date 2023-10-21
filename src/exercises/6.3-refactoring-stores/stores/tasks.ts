import { acceptHMRUpdate, defineStore, skipHydrate } from 'pinia'
import { computed } from 'vue'
import { useTodosStore } from './todos'
import { useLocalStorage } from '@vueuse/core'

export interface TodoTaskActive {
  id: string
  start: number
  totalTime: number
}

export interface TodoTask extends TodoTaskActive {
  end: number
}

export interface TodoTaskStarted extends Omit<TodoTask, 'end'> {}

export const useTasksStore = defineStore('tasks', () => {
  const todos = useTodosStore()

  const finishedTasks = skipHydrate(useLocalStorage<TodoTask[]>('6.3-finishedTasks', []))
  const startedTasks = skipHydrate(
    useLocalStorage<Map<string, TodoTaskStarted>>('6.3-startedTasks', new Map(), {
      deep: true,
      serializer: {
        read: v => {
          try {
            return new Map(JSON.parse(v))
          } catch (_err) {
            return new Map()
          }
        },
        write: v => {
          try {
            return JSON.stringify(Array.from(v.entries()))
          } catch (_err) {
            return '[]'
          }
        },
      },
    }),
  )
  const activeTask = skipHydrate(
    useLocalStorage<TodoTaskActive | null>('6.3-activeTask', null, {
      serializer: {
        read: v => {
          try {
            return JSON.parse(v)
          } catch (_err) {
            return null
          }
        },
        write: v => {
          try {
            return JSON.stringify(v)
          } catch (_err) {
            return 'null'
          }
        },
      },
    }),
  )

  const hasActiveTodo = computed<boolean>(() => !!activeTask.value)

  function startTodo(todoId: string) {
    const existingTodo = todos.list.find(todo => todo.id === todoId)
    if (!existingTodo) {
      console.warn(`Todo with id ${todoId} does not exist`)
      return
    }
    if (existingTodo.finished) {
      console.warn(`Todo with id ${todoId} is already finished`)
      return
    }

    if (activeTask.value) {
      pauseCurrentTodo()
    }

    if (startedTasks.value.has(todoId)) {
      activeTask.value = startedTasks.value.get(todoId)!
      activeTask.value.start = Date.now()
    } else {
      activeTask.value = {
        id: todoId,
        start: Date.now(),
        totalTime: 0,
      }

      startedTasks.value.set(todoId, {
        ...activeTask.value,
      })
    }
  }

  function finishCurrentTodo() {
    if (!activeTask.value) {
      return
    }

    startedTasks.value.delete(activeTask.value.id)
    const todo = todos.list.find(todo => todo.id === activeTask.value!.id)
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

  function isTodoStarted(todoId: string) {
    return startedTasks.value.has(todoId) || (activeTask.value && activeTask.value.id === todoId)
  }

  function pauseCurrentTodo() {
    if (!activeTask.value) {
      return
    }

    const existingTask = startedTasks.value.get(activeTask.value.id)
    startedTasks.value.set(activeTask.value.id, {
      ...activeTask.value,
      totalTime: (existingTask?.totalTime ?? 0) + Date.now() - activeTask.value.start,
    })
    activeTask.value = null
  }

  return {
    finishedTasks,
    activeTask,
    startedTasks,

    hasActiveTodo,
    startTodo,
    pauseCurrentTodo,
    finishCurrentTodo,
    isTodoStarted,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTodosStore, import.meta.hot))
}
