import { mande } from 'mande'

export const todos = mande('http://localhost:7777/todos', {})
export const tasks = mande('http://localhost:7777/tasks', {})

// FIXME: duplicated in stores
export interface TodoItem {
  id: string
  text: string
  finished: boolean
  createdAt: number
}

export async function postTodo(todo: Omit<TodoItem, 'id'>) {
  return todos.post<TodoItem>('/', todo)
}
