import { acceptHMRUpdate, defineStore } from 'pinia'

export const useDango = defineStore('2.5.1 store-actions', {
  state: () => ({
    amount: 20,
    eatenBalls: 0,
  }),

  getters: {
    finishedSticks: state => Math.floor(state.eatenBalls / 3),
  },

  actions: {},
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDango, import.meta.hot))
}
