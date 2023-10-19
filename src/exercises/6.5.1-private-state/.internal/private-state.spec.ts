import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, getActivePinia, setActivePinia } from 'pinia'
import { toRaw } from 'vue'
import { isComputed } from '@tests/utils'
import { useAuthStore } from '../stores/auth'
import { mockHttpRequests } from '@tests/mocks/server'

describe('Private state in stores', () => {
  mockHttpRequests()
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('hides the currentUser property from state', async () => {
    const auth = useAuthStore()

    expect(auth.$state).not.toHaveProperty('currentUser')
  })

  it('exposes the current user as a getter', async () => {
    const auth = useAuthStore()

    expect(auth.$state).not.toHaveProperty('currentUser')
    expect(auth).toHaveProperty('currentUser')
    expect(isComputed(toRaw(auth).currentUser)).toBe(true)
  })

  it('creates a currentUser property in the pinia state', () => {
    useAuthStore()

    expect(JSON.stringify(getActivePinia()?.state.value)).includes('"currentUser":null')
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
