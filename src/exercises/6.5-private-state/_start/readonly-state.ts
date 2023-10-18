// NOTE: remove this line (or change the 1 into 0) if you don't want
// to work on the Type Safety part
/* eslint @typescript-eslint/no-explicit-any:1 */
import { defineStore } from 'pinia'
import { reactive } from 'vue'

export function defineReadonlyState(id: any, privateStateFn: any, setup: any) {
  return defineStore(id, () => {
    return setup(
      // FIXME: you will have to rewrite this to make it work
      reactive({ n: 0 }),
    )
  })
}
