import { ref, computed, Ref, ComputedRef } from 'vue'

// NOTE: this is the store we built in the previous exercise

let store: {
  n: Ref<number>
  increment: (amount?: number) => void
  double: ComputedRef<number>
}

export function useCountStore() {
  if (!store) {
    const n = ref(0)
    // variable instead of function because functions are hoisted
    const increment = (amount = 1) => {
      n.value += amount
    }
    const double = computed(() => n.value * 2)

    store = { n, double, increment }
  }

  return store
}
