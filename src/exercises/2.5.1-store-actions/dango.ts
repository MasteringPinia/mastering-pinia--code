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
    eatDango(): void {
      if (this.amount < 1) return
      this.eatenBalls++
      if (this.eatenBalls % 3 === 0) {
        this.amount--
      }
    },

    async startEating(interval = 300) {
      if (this.isEating || this.amount < 1) return

      this.isEating = true
      do {
        await new Promise(resolve => setTimeout(resolve, interval))
        if (!this.isEating) return
        this.eatDango()
      } while (this.amount > 0)

      this.isEating = false
    },

    stopEating() {
      this.isEating = false
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDango, import.meta.hot))
}
