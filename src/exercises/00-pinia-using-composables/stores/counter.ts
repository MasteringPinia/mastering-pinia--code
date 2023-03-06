import { useNow, useLocalStorage } from '@vueuse/core'
import { acceptHMRUpdate, defineStore } from 'pinia'

const ExId = 'pinia-composables-usage:'

export const useCounterStore = defineStore('pinia-composables-usage', {
  state: () => ({
    n: useLocalStorage(ExId + 'counter', 0),
    updatedAt: useLocalStorage(ExId + 'counter-updated-at', Date.now()),
    now: useNow(),
  }),

  getters: {
    msSinceUpdate: state => state.now.getTime() - state.updatedAt,

    secondsSinceUpdate(): number {
      return Math.floor(this.msSinceUpdate / 1000)
    },
  },

  actions: {
    async increment(amount = 1) {
      this.$patch({
        n: this.n + amount,
        updatedAt: Date.now(),
      })
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCounterStore, import.meta.hot))
}
