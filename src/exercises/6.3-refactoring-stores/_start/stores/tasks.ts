import { acceptHMRUpdate, defineStore } from 'pinia'

export const useTasksStore = defineStore('tasks', () => {
  // we should move some of the logic of the todo store here

  return {}
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTasksStore, import.meta.hot))
}
