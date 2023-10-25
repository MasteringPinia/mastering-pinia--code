import { acceptHMRUpdate, defineStore } from 'pinia'

// 🚨 Do not change the name of the store or the exported variables

export const useTasksStore = defineStore('6.3-tasks', () => {
  // we should move some of the logic of the todo store here

  return {}
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTasksStore, import.meta.hot))
}
