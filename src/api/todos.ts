import Cookies from 'js-cookie'
import { mande } from 'mande'

export const todos = mande('http://localhost:7777/todos', {})
export const tasks = mande('http://localhost:7777/tasks', {})

export interface TodoItem {
  id: string
  /**
   * The text of the todo
   */
  text: string
  /**
   * Is the todo finished
   */
  finished: boolean
  /**
   * When was this created
   */
  createdAt: number

  /**
   * Email of the user who created it. Null for anonymous
   */
  createdBy: string | null
}

export async function getTodoList() {
  const createdBy = Cookies.get('mp_user') || null
  const query = createdBy ? { createdBy } : {}
  return todos.get<TodoItem[]>('/', {
    query,
  })
}

export async function createTodo(todo: Pick<TodoItem, 'text'>) {
  return todos.post<TodoItem>('/', {
    ...todo,
    finished: false,
    createdAt: Date.now(),
    createdBy: Cookies.get('mp_user') || null,
  })
}

async function ensureTodoIsOwnedByCurrentUser(id: string) {
  const createdBy = Cookies.get('mp_user') || null
  // anonymous todo
  if (!createdBy) {
    return true
  }

  const existingTodo = await todos.get<TodoItem[]>(`/`, {
    query: {
      id,
      createdBy,
    },
  })

  return existingTodo.length > 0
}

export async function updateTodoById(id: string, todo: Partial<Omit<TodoItem, 'createdAt' | 'id'>>) {
  if (!(await ensureTodoIsOwnedByCurrentUser(id))) {
    throw new Error(`Todo with id "${id}" does not exist or does not belong to you.`)
  }

  return todos.patch<TodoItem>(`/${id}`, todo)
}

export async function deleteTodoById(id: string) {
  if (!(await ensureTodoIsOwnedByCurrentUser(id))) {
    throw new Error(`Todo with id "${id}" does not exist or does not belong to you.`)
  }

  return todos.delete(`/${id}`)
}

export interface TodoTask {
  id: string
  /**
   * The todo this task belongs to
   */
  todoId: string
  /**
   * When was this created
   */
  createdAt: number

  /**
   * Total time in ms
   */
  totalTime: number
  /**
   * Null if the task is still active
   */
  end: number | null
}

export interface TodoTaskWithTodo extends TodoTask {
  /**
   * The todo this task is attached to.
   */
  todo: TodoItem
}

export async function getTaskList() {
  const createdBy = Cookies.get('mp_user') || null
  const query = createdBy ? { createdBy } : {}

  return tasks.get<TodoTask[]>('/', {
    query,
  })
}

export async function createTask(task: Omit<TodoTask, 'id' | 'createdAt' | 'end'>) {
  if (!(await ensureTodoIsOwnedByCurrentUser(task.todoId))) {
    throw new Error(`Todo with id "${task.todoId}" does not exist or does not belong to you.`)
  }

  return tasks.post<TodoTask>('/', {
    end: null,
    ...task,
    createdAt: Date.now(),
  })
}

export async function updateTaskById(id: string, task: Partial<Omit<TodoTask, 'createdAt' | 'id'>>) {
  const existingTask = await tasks.get<TodoTask | null>(`/` + id)
  if (!(existingTask && (await ensureTodoIsOwnedByCurrentUser(existingTask.todoId)))) {
    throw new Error(`Task with id "${id}" does not exist or does not belong to you.`)
  }

  return tasks.patch<TodoTask>(`/${id}`, task)
}

export async function deleteTaskById(id: string) {
  const existingTask = await tasks.get<TodoTask | null>(`/` + id)
  if (!(existingTask && (await ensureTodoIsOwnedByCurrentUser(existingTask.todoId)))) {
    throw new Error(`Task with id "${id}" does not exist or does not belong to you.`)
  }

  return tasks.delete(`/${id}`)
}
