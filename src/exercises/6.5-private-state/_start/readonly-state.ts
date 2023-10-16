// NOTE: remove this line (or change the 1 into 0) if you don't want
// to work on the Type Safety part
/* eslint @typescript-eslint/no-explicit-any:1 */
import { defineStore } from 'pinia'

export function defineReadonlyState(id: any, privateStateFn: any, setup: any) {
  return defineStore(id, () => setup)
}
