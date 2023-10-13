// NOTE: remove this line (or change the 1 into 0) if you don't want
// to work on the Type Safety part
/* eslint @typescript-eslint/no-explicit-any:1 */

import { SetupStoreDefinition, defineStore } from 'pinia'

export function definePrivateStore<Id extends string, PrivateStore, SS>(
  id: Id,
  privateStateFn: () => PrivateStore,
  setup: (privateState: ReturnType<SetupStoreDefinition<string, PrivateStore>>) => SS,
) {
  const usePrivateStore = defineStore(id + '_private', privateStateFn)

  return defineStore(id, () => {
    const privateStore = usePrivateStore()
    return setup(privateStore)
  })
}
