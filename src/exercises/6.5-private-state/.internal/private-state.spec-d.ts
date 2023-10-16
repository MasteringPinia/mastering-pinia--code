import { assertType, expectTypeOf, it, describe } from 'vitest'
import { definePrivateState } from '../private-state'

describe('TS: Private stores', () => {
  describe('definePrivateState', () => {
    it('my types work properly', () => {
      const useStore = definePrivateState(
        'id',
        () => ({ n: 0 }),
        p => {
          expectTypeOf(p).toMatchTypeOf({ n: 0 })
          return {}
        },
      )

      // @ts-expect-error n doesn't exist
      assertType(useStore().n)
    })
  })
})
