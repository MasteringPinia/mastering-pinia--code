import { acceptHMRUpdate, defineStore, skipHydrate } from 'pinia'
import { computed } from 'vue'
import { useTodosStore } from './todos'
import { useLocalStorage } from '@vueuse/core'
import { TodoTask, TodoTaskWithTodo } from '@/api/todos'

const useTasksPrivate = defineStore('tasks-private', () => {
  const activeTask = skipHydrate(
    useLocalStorage<TodoTask | null>('6.3-activeTask', null, {
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

  return {
    activeTask,
  }
})

export const useTasksStore = defineStore('tasks', () => {
  const todos = useTodosStore()
  const privState = useTasksPrivate()

  const finishedTasks = skipHydrate(useLocalStorage<TodoTask[]>('6.3-finishedTasks', []))
  const startedTasks = skipHydrate(
    useLocalStorage<Map<string, TodoTask>>('6.3-startedTasks', new Map(), {
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

  const hasActiveTodo = computed<boolean>(() => !!privState.activeTask)

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

    if (privState.activeTask) {
      pauseCurrentTodo()
    }

    if (startedTasks.value.has(todoId)) {
      privState.activeTask = startedTasks.value.get(todoId)!
      privState.activeTask.createdAt = Date.now()
    } else {
      privState.activeTask = {
        id: crypto.randomUUID(),
        createdAt: Date.now(),
        end: null,
        todoId,
        totalTime: 0,
      }

      startedTasks.value.set(todoId, {
        ...privState.activeTask,
      })
    }
  }

  function finishCurrentTodo() {
    if (!privState.activeTask) {
      return
    }

    startedTasks.value.delete(privState.activeTask.id)
    const todo = todos.list.find(todo => todo.id === privState.activeTask!.todoId)
    if (todo) {
      todo.finished = true
      const end = Date.now()
      finishedTasks.value.push({
        ...privState.activeTask,
        end,
        totalTime: end - privState.activeTask.createdAt,
      })
      privState.activeTask = null
    }
  }

  function isTodoStarted(todoId: string) {
    return startedTasks.value.has(todoId) || (privState.activeTask && privState.activeTask.todoId === todoId)
  }

  function pauseCurrentTodo() {
    if (!privState.activeTask) {
      return
    }

    const existingTask = startedTasks.value.get(privState.activeTask.todoId)
    startedTasks.value.set(privState.activeTask.todoId, {
      ...privState.activeTask,
      totalTime: (existingTask?.totalTime ?? 0) + Date.now() - privState.activeTask.createdAt,
    })
    privState.activeTask = null
  }

  const activeTaskWithTodo = computed<TodoTaskWithTodo | null>(() => {
    const task = privState.activeTask
    return task
      ? {
          ...task,
          todo: todos.list.find(todo => todo.id === task.todoId)!,
        }
      : null
  })

  return {
    finishedTasks,
    activeTask: activeTaskWithTodo,
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
