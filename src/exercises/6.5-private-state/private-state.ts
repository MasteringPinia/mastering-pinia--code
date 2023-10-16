// NOTE: remove this line (or change the 1 into 0) if you don't want
// to work on the Type Safety part
/* eslint @typescript-eslint/no-explicit-any:1 */
import { StateTree, defineStore } from 'pinia'

export function definePrivateState<
  Id extends string,
  PrivateState extends StateTree, // TODO: add tip about this
  SetupReturn, // TODO: tip
>(id: Id, privateStateFn: () => PrivateState, setup: (privateSTate: PrivateState) => SetupReturn) {
  const usePrivateStore = defineStore(id + '_private', {
    state: privateStateFn,
  })

  return defineStore(id, () => {
    const privateStore = usePrivateStore()
    return setup(privateStore.$state)
  })
}
