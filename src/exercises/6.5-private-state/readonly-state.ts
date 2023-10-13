// NOTE: remove this line (or change the 1 into 0) if you don't want
// to work on the Type Safety part
/* eslint @typescript-eslint/no-explicit-any:1 */
import { StateTree, defineStore } from 'pinia'
import { ComputedRef, computed } from 'vue'

export function defineReadonlyState<
  Id extends string,
  PrivateState extends StateTree, // TODO: add tip about this
  SS, // TODO: tip
>(id: Id, privateStateFn: () => PrivateState, setup: (privateSTate: PrivateState) => SS) {
  const usePrivateStore = defineStore(id + '_private', {
    state: privateStateFn,
  })

  return defineStore(id, () => {
    const privateStore = usePrivateStore()
    const result = setup(privateStore.$state)

    const privateStateAsGetters: {
      [K in keyof PrivateState]: ComputedRef<PrivateState[K]>
      // NOTE: this one is a bit harder to get typed correctly as we fill the object afterwards
    } = {} as any

    for (const key in privateStore.$state) {
      privateStateAsGetters[key] = computed(() => privateStore.$state[key])
    }

    return {
      ...privateStateAsGetters,
      ...result,
    }
  })
}

// TIP: if uses toRefs, toRef
// TIP: if not using computed
