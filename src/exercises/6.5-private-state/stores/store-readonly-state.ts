import { computed } from 'vue'
import { defineReadonlyState } from '../readonly-state'

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
