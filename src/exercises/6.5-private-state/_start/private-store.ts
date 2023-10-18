// NOTE: remove this line (or change the 1 into 0) if you don't want
// to work on the Type Safety part
/* eslint @typescript-eslint/no-explicit-any:1 */

import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'

export function definePrivateStore(id: any, privateStoreSetup: any, setup: any) {
  return defineStore(id, () => {
    // FIXME: you will have to rewrite the whole function
    const n = ref(0)
    const privateStore = reactive({
      n: 0,
      double: computed(() => n.value * 2),

      increment(amount = 1) {
        n.value += amount
      },
    })

    return setup(privateStore)
  })
}
