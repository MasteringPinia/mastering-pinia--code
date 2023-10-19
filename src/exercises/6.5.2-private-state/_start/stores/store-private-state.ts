import { computed } from 'vue'
import { definePrivateState } from '../private-state'
import { acceptHMRUpdate } from 'pinia'

// ❌ You won't need to modify this file to complete the exercise
// NOTE: If you are working on the Type Safety part, this file should have no
// errors.

export const usePrivateCounter = definePrivateState(
  '6.5-private-state-counter',
  () => ({
    n: 0,
  }),
  privateState => {
    const double = computed(() => privateState.n * 2)

    function increment(amount = 1) {
      privateState.n += amount
    }

    return {
      double,
      increment,
    }
  },
)

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePrivateCounter, import.meta.hot))
}
