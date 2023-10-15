import { computed } from 'vue'
import { defineReadonlyState } from '../readonly-state'
import { acceptHMRUpdate } from 'pinia'

// ❌ You won't need to modify this file to complete the exercise
// NOTE: If you are working on the Type Safety part, this file should have no
// errors.

export const useReadonlyCounter = defineReadonlyState(
  '6.5-readonly-state-counter',
  () => ({
    n: 0,
  }),
  priv => {
    const double = computed(() => priv.n * 2)

    function increment(amount = 1) {
      priv.n += amount
    }

    return {
      double,
      increment,
    }
  },
)

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useReadonlyCounter, import.meta.hot))
}
