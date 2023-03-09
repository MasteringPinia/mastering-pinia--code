import { ref, computed } from 'vue'
import { defineStore } from './my-pinia'

// You won't need to change this file at all

export const useCountStore = defineStore(() => {
  const n = ref(0)
  const increment = (amount = 1) => {
    n.value += amount
  }
  const double = computed(() => n.value * 2)

  return { n, double, increment }
})
