import { computed } from 'vue'
import { definePrivateState } from '../private-state'

export const usePrivateCounter = definePrivateState(
  '6.5-private-state-counter',
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
