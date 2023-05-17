import { acceptHMRUpdate, defineStore } from 'pinia'

export const useDango = defineStore('2.5.1 store-actions', {
  state: () => ({
    amount: 20,
    eatenBalls: 0,
    isEating: false,
  }),

  getters: {
    finishedSticks: state => Math.floor(state.eatenBalls / 3),
  },

  actions: {
    eatDango() {
      if (this.amount === 0) return
      this.eatenBalls++
      if (this.eatenBalls % 3 === 0) {
        this.amount--
      }
    },
    startEating() {
      this.isEating = true
      const interval = setInterval(() => {
        if (this.amount === 0 || !this.isEating) {
          this.isEating = false
          clearInterval(interval)
          return
        }
        this.eatDango()
      }, 500)
    },
    stopEating() {
      this.isEating = false
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDango, import.meta.hot))
}
