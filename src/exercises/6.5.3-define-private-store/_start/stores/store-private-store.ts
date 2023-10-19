import { ref, computed } from 'vue'
import { definePrivateStore } from '../private-store'
import { acceptHMRUpdate } from 'pinia'

// ❌ You won't need to modify this file to complete the exercise
// NOTE: If you are working on the Type Safety part, this file should have no
// errors.

export const usePrivateStore = definePrivateStore(
  '6.5-private-store-counter',

  () => {
    const n = ref(1000)

    const double = computed(() => n.value * 2)

    function increment(amount = 1) {
      n.value += amount
    }

    return { n, double, increment }
  },

  priv => {
    const doublePlusOne = computed(() => priv.double + 1)

    function decrement(amount = 1) {
      priv.increment(-amount)
    }

    return { doublePlusOne, decrement }
  },
)

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePrivateStore, import.meta.hot))
}
