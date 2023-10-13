import { ref, computed } from 'vue'
import { definePrivateStore } from '../private-store'

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
