import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, getActivePinia, setActivePinia } from 'pinia'
import { toRaw } from 'vue'
import { isComputed, tipOnFail } from '@tests/utils'
import { useAuthStore } from '../stores/auth'
import { mockHttpRequests } from '@tests/mocks/server'

describe('Private state in stores', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })
  mockHttpRequests()

  it('hides the currentUser property from state', async () => {
    const auth = useAuthStore()

    expect(auth.$state).not.toHaveProperty('currentUser')
  })

  it('creates a currentUser property in the pinia state', () => {
    useAuthStore()

    tipOnFail(() => {
      expect(Object.keys(getActivePinia()!.state.value)).toHaveLength(2)
    }, `Make sure to define 2 stores with **different ids**, one for the private state and one for the rest.`)

    tipOnFail(() => {
      expect(JSON.stringify(getActivePinia()?.state.value)).includes('"currentUser":null')
    }, `Make sure to keep the "currentUser" property in the private state **without renaming it**.`)
  })

  it('exposes the current user as a getter', async () => {
    const auth = useAuthStore()

    expect(auth.$state).not.toHaveProperty('currentUser')
    expect(auth).toHaveProperty('currentUser')
    tipOnFail(() => {
      expect(isComputed(toRaw(auth).currentUser)).toBe(true)
    }, `You are exposing "currentUser" as a writable property but it shouldn't be writable outside of the store. Make sure it is a **getter** from pinia's perspective.`)
  })

  it('can run login and logout actions', async () => {
    const auth = useAuthStore()

    expect(auth.currentUser).toBe(null)
    await auth.login('email', 'password')
    expect(auth.currentUser).not.toBe(null)
    await auth.logout()
    expect(auth.currentUser).toBe(null)
  })
})
