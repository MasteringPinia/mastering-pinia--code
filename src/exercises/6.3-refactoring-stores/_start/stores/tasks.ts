import { acceptHMRUpdate, defineStore } from 'pinia'
import { useTodosStore } from './todos'

export const useTasksStore = defineStore('tasks', () => {
  // we should move some of the logic of the todo store heer

  return {}
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTodosStore, import.meta.hot))
}
