// NOTE: remove this line (or change the 1 into 0) if you don't want
// to work on the Type Safety part
/* eslint @typescript-eslint/no-explicit-any:1 */

import { SetupStoreDefinition, defineStore } from 'pinia'

export function definePrivateStore<Id extends string, PrivateStore, StoreSetup>(
  id: Id,
  privateStoreSetup: () => PrivateStore,
  setup: (privateState: ReturnType<SetupStoreDefinition<string, PrivateStore>>) => StoreSetup,
) {
  const usePrivateStore = defineStore(id + '_private', privateStoreSetup)

  return defineStore(id, () => {
    const privateStore = usePrivateStore()
    return setup(privateStore)
  })
}
