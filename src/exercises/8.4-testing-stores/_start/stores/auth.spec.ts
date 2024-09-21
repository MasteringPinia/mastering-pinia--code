/**
 * @vitest-environment happy-dom
 */
import { createPinia, getActivePinia, setActivePinia } from 'pinia'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { useAuthStore } from '../stores/auth'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { usePreferencesStore } from '../stores/preferences'
import { PiniaDebounce } from '@pinia/plugin-debounce'
import { debounce } from 'ts-debounce'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import Cookies from 'js-cookie'

// Define the Rest Handlers associated with the tests
// NOTE: this is using msw v1, so the API is a little bit different from the one in the documentation
// https://v1.mswjs.io/
const restHandlers = [
  rest.get('http://localhost:7777/users', (req, res, ctx) => {
    return res(ctx.json([]))
  }),
]

describe('Writing tests', () => {
  const server = setupServer(...restHandlers)

  beforeAll(() => {
    // setup the server
    server.listen()
  })
  afterEach(() => {
    server.resetHandlers()
  })
  afterAll(() => {
    // clean up once the tests are done
    server.close()
  })

  // Complete this test and don't forget to remove the `.todo` too!
  it.todo('resets the user on logout', async () => {
    // ...
    const auth = useAuthStore()
    // the user must start as non null
    expect(auth.user).not.toBeNull()
    // ...
    expect(auth.user).toBeNull()
  })

  it.todo('has a user displayName', () => {
    // ...
  })

  it.todo('uses "Guest" as displayName if no user', () => {
    // ...
  })

  it.todo('can anonymize displayName in the preferences stores', async () => {
    // ...
  })

  it.todo('can login the user', async () => {
    // ..
  })

  it.todo('automatically logins if a cookie exists', async () => {
    // must be an email that the user can login with
    Cookies.set('mp_user', '...')
  })

  it.todo('updates the preferences with auth.updateLocalPreferences()', async () => {
    // TODO: set the initial preferences state to have a light theme
    const auth = useAuthStore()
    const preferences = usePreferencesStore()

    auth.updateLocalPreferences({ theme: 'dark' })
    // ...
    expect(preferences.theme).toBe('dark')
  })
})
