import { mount } from '@vue/test-utils'
import TestComponent from './index.vue'
import { describe, it, expect, vi, type Mock, afterAll, afterEach, beforeAll } from 'vitest'
import { TestingOptions, createTestingPinia } from '@pinia/testing'
import { PiniaDebounce } from '@pinia/plugin-debounce'
import { debounce } from 'ts-debounce'
import { useAuthStore } from './stores/auth'
import type { Store, StoreDefinition } from 'pinia'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { delay } from '@tests/mocks/server'
import { usePreferencesStore } from './stores/preferences'
import { ComputedRef, nextTick } from 'vue'

describe('Mocking Stores', () => {
  function factory(options: TestingOptions = {}) {
    const pinia = createTestingPinia({
      createSpy: vi.fn,
      plugins: [PiniaDebounce(debounce)],
      ...options,
    })
    const wrapper = mount(TestComponent, {
      global: { plugins: [pinia] },
    })

    return {
      pinia,
      wrapper,
    }
  }
  it('mounts a component', async () => {
    const { wrapper } = factory({
      initialState: {
        auth: {
          user: {
            id: '1',
            email: 'a',
            displayName: 'A',
            photoURL: 'https://example.com/a.jpg',
          },
        },
        preferences: {
          theme: 'dark',
          anonymizeName: false,
        },
      },
    })

    expect(wrapper.find('[data-test=display-name]').text()).toBe('Display Name: A')
  })

  it('can signup a new user', async () => {
    const { wrapper } = factory()
    const auth = useAuthStore()

    await wrapper.find('#register-email').setValue('eduardo@mail.com')
    await wrapper.find('#register-password').setValue('secret')
    await wrapper.find('#register-display-name').setValue('Eduardo')
    await wrapper.find('[data-test=register-form]').trigger('submit')
    expect(auth.register).toHaveBeenCalledTimes(1)
    expect(auth.register).toHaveBeenCalledWith({
      email: 'eduardo@mail.com',
      password: 'secret',
      displayName: 'Eduardo',
    })
  })

  it('displays the user displayName', async () => {
    const { wrapper } = factory({
      initialState: {
        auth: {
          user: {
            id: '1',
            email: 'a',
            displayName: 'A',
            photoURL: 'https://example.com/a.jpg',
          },
        },
      },
    })

    const auth = mockedStore(useAuthStore)
    auth.displayName = 'Faked'

    await nextTick()

    expect(wrapper.find('[data-test=display-name]').text()).toBe('Display Name: Faked')
  })

  describe('unstubbed actions', () => {
    const restHandlers = [
      rest.get('http://localhost:7777/users', (req, res, ctx) => {
        const email = req.url.searchParams.get('email')
        if (email === 'a') {
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
        } else if (email === 'eduardo@mail.com') {
          return res(
            ctx.json([
              {
                id: '2',
                email: 'eduardo@mail.com',
                password: 'secret',
                displayName: 'Eduardo',
                photoURL: 'https://example.com/eduardo.jpg',
              },
            ]),
          )
        }

        return res(ctx.json([]))
      }),
      rest.post('http://localhost:7777/users', async (req, res, ctx) => {
        const body = await req.json()
        return res(
          ctx.json({
            id: crypto.randomUUID(),
            email: body.email,
            displayName: body.displayName,
            photoURL: `https://i.pravatar.cc/150?u=${body.email}`,
          }),
        )
      }),
    ]

    const server = setupServer(...restHandlers)

    beforeAll(() => {
      // setup the server
      server.listen()
    })
    afterEach(() => {
      server.resetHandlers()
      // vi.restoreAllMocks()
    })
    afterAll(() => {
      // clean up once the tests are done
      server.close()
    })

    // we just test login is called
    it('can login a user', async () => {
      const { wrapper } = factory({
        // we can check that the display name changes
        stubActions: false,
      })
      const auth = mockedStore(useAuthStore)

      await wrapper.find('#login-email').setValue('eduardo@mail.com')
      await wrapper.find('#login-password').setValue('secret')
      await wrapper.find('[data-test=login-form]').trigger('submit')
      // we can still spy the actions or even mock them individually
      expect(auth.login).toHaveBeenCalledTimes(1)
      expect(auth.login).toHaveBeenCalledWith({ email: 'eduardo@mail.com', password: 'secret' })
      // we need to wait for the next tick to let promises unveil
      await delay(0)
      // a safer way is to use fake timers and runAllTimers
      expect(wrapper.find('[data-test=display-name]').text()).toBe('Display Name: Eduardo')
    })

    it('updates the preferences on the server if the user is logged in', async () => {
      const { wrapper } = factory({
        stubActions: false,
        plugins: [
          // PiniaDebounce(debounce)
        ],
        initialState: {
          auth: {
            user: {
              id: '1',
              email: 'a',
              displayName: 'A',
              photoURL: 'https://example.com/a.jpg',
            },
          },
        },
      })
      const auth = mockedStore(useAuthStore)
      const preferences = mockedStore(usePreferencesStore)

      preferences.saveServerPreferences.mockResolvedValueOnce()
      await wrapper.find('[data-test=update-preferences]').trigger('click')
      expect(auth.updateLocalPreferences).toHaveBeenCalledTimes(1)
      expect(preferences.saveServerPreferences).toHaveBeenCalledTimes(1)
    })

    it('does not update the preferences on the server if the user is not logged in', async () => {
      const { wrapper } = factory({
        createSpy: vi.fn,
        stubActions: false,
        plugins: [
          // PiniaDebounce(debounce)
        ],
        initialState: {
          auth: {
            user: null,
          },
        },
      })
      const auth = mockedStore(useAuthStore)
      const preferences = mockedStore(usePreferencesStore)

      preferences.saveServerPreferences.mockResolvedValueOnce()
      await wrapper.find('[data-test=update-preferences]').trigger('click')
      expect(auth.updateLocalPreferences).toHaveBeenCalledTimes(1)
      expect(preferences.saveServerPreferences).not.toHaveBeenCalled()
    })
  })
})

function mockedStore<TStoreDef extends () => unknown>(
  useStore: TStoreDef,
): TStoreDef extends StoreDefinition<infer Id, infer State, infer Getters, infer Actions>
  ? Store<
      Id,
      State,
      Record<string, never>,
      {
        [K in keyof Actions]: Actions[K] extends (...args: infer Args) => infer ReturnT
          ? Mock<Args, ReturnT>
          : Actions[K]
      }
    > & {
      [K in keyof Getters]: Getters[K] extends ComputedRef<infer T> ? T : never
    }
  : ReturnType<TStoreDef> {
  return useStore() as any
}
