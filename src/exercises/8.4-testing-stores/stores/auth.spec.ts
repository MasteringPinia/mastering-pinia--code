/**
 * @vitest-environment happy-dom
 */

import { createPinia, getActivePinia, setActivePinia } from 'pinia'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { useAuthStore } from './auth'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { usePreferencesStore } from './preferences'
import { PiniaDebounce } from '@pinia/plugin-debounce'
import { debounce } from 'ts-debounce'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import Cookies from 'js-cookie'

// Define the Rest Handlers associated with the tests
// NOTE: this is using msw v1, so the API is a little bit different from the one in the documentation
const restHandlers = [
  rest.get('http://localhost:7777/users', (req, res, ctx) => {
    if (req.url.searchParams.get('email') === 'a' || req.url.searchParams.get('password') === 'a') {
      return res(
        ctx.json([
          {
            id: '1',
            email: 'a',
            displayName: 'A',
            photoURL: 'https://example.com/a.jpg',
          },
        ]),
      )
    }

    return res(ctx.json([]))
  }),
]

describe('Solution', () => {
  const server = setupServer(...restHandlers)

  beforeAll(() => {
    // setup the server
    server.listen()
  })
  afterEach(() => {
    server.resetHandlers()
    vi.restoreAllMocks()
  })
  afterAll(() => {
    // clean up once the tests are done
    server.close()
  })
  // TODO: let the student add this
  beforeEach(() => {
    const pinia = createPinia()
    pinia.use(PiniaDebounce(debounce))
    setActivePinia(pinia)
    vi.useFakeTimers()
  })

  it('resets the user on logout', async () => {
    getActivePinia()!.state.value.auth = {
      user: {
        id: '1',
        email: 'a@a.com',
        displayName: 'A',
        photoURL: 'https://example.com/a.jpg',
      },
    }

    const auth = useAuthStore()
    expect(auth.user).not.toBeNull()
    await auth.logout()
    expect(auth.user).toBeNull()
  })

  it('has a user displayName', () => {
    getActivePinia()!.state.value.auth = {
      user: {
        id: '1',
        email: 'a',
        displayName: 'A',
        photoURL: 'https://example.com/a.jpg',
      },
    }
    const auth = useAuthStore()
    expect(auth.displayName).toBe('A')
  })

  it('uses "Guest" as displayName if no user', () => {
    getActivePinia()!.state.value.auth = { user: null }
    const auth = useAuthStore()
    expect(auth.displayName).toBe('Guest')
  })

  it('can anonymize displayName in the preferences stores', async () => {
    getActivePinia()!.state.value.auth = {
      user: {
        id: '1',
        email: 'a@a.com',
        displayName: 'James',
        photoURL: 'https://example.com/a.jpg',
      },
    }
    const auth = useAuthStore()
    const preferences = usePreferencesStore()
    // Default
    expect(auth.displayName).toBe('James')
    preferences.anonymizeName = true
    expect(auth.displayName).toBe('Anonymous')
  })

  it('can login the user', async () => {
    const auth = useAuthStore()
    await auth.login({ email: 'a', password: 'a' })
    expect(auth.user).toContain({ email: 'a' })
  })

  it('automatically logins if a cookie exists', async () => {
    Cookies.set('mp_user', 'a')
    const auth = useAuthStore()
    await vi.runOnlyPendingTimersAsync()
    expect(auth.user).toContain({ email: 'a' })
  })

  // it doesn't fail because we are not actually using the plugin since there is no app
  it('updates the preferences (should fail but is wrong)', async () => {
    getActivePinia()!.state.value.preferences = {
      theme: 'light',
      anonymizeName: false,
    }
    const auth = useAuthStore()
    const preferences = usePreferencesStore()
    auth.updateLocalPreferences({ theme: 'dark' })
    expect(preferences.theme).toBe('dark')
  })

  it('updates the preferences with auth.updateLocalPreferences()', async () => {
    getActivePinia()!.state.value.preferences = {
      theme: 'light',
      anonymizeName: false,
    }
    // we don't even need to to add anything to it
    mount(defineComponent({ template: '' }), {
      global: {
        plugins: [getActivePinia()!],
      },
    })
    const auth = useAuthStore()
    const preferences = usePreferencesStore()

    auth.updateLocalPreferences({ theme: 'dark' })
    vi.runOnlyPendingTimers()
    expect(preferences.theme).toBe('dark')
  })
})
