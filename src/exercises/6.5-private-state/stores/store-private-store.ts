import { ref, computed } from 'vue'
import { definePrivateStore } from '../private-store'

export const usePrivateStore = definePrivateStore(
  '6.5-private-store-counter',

  () => {
    const n = ref(0)
    return { n }
  },

  priv => {
    const double = computed(() => priv.n * 2)

    return { double }
  },
)
