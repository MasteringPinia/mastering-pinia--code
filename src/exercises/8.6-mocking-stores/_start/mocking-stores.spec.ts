import { mount } from '@vue/test-utils'
import TestComponent from './index.vue'
import { describe, it, expect, vi, type Mock, afterAll, afterEach, beforeAll } from 'vitest'
import { PiniaDebounce } from '@pinia/plugin-debounce'
import { debounce } from 'ts-debounce'
import { useAuthStore } from './stores/auth'
import type { Store, StoreDefinition } from 'pinia'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { usePreferencesStore } from './stores/preferences'
import { nextTick } from 'vue'
import { createPinia } from 'pinia'

describe('Mocking Stores', () => {
  it('mounts and uses the store', async () => {
    // FIXME: use a testing pinia in all tests
    const pinia = createPinia()
    pinia.use(PiniaDebounce(debounce))
    const wrapper = mount(TestComponent, {
      global: { plugins: [pinia] },
    })

    expect(wrapper.find('[data-test=display-name]').text()).toBe('Display Name: A')
  })

  it('can signup a new user', async () => {
    const wrapper = mount(TestComponent, {
      // TODO:
    })
    const auth = useAuthStore()

    // TODO:
  })

  // make this test pass without setting an initial state that makes it pass
  it('displays the user displayName', async () => {
    const wrapper = mount(TestComponent, {
      // TODO:
    })

    const auth = useAuthStore()
    // TODO:
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
    })
    afterAll(() => {
      // clean up once the tests are done
      server.close()
    })

    // we just test login is called
    it('can login a user', async () => {
      const wrapper = mount(TestComponent, {
        // TODO:
      })
      const auth = mockedStore(useAuthStore)

      // TODO: login as Eduardo, check the restHandlers above

      expect(wrapper.find('[data-test=display-name]').text()).toBe('Display Name: Eduardo')
    })

    // this test should not stub actions and should only mock the preferences.saveServerPreferences action
    it('updates the preferences on the server if the user is logged in', async () => {
      const wrapper = mount(TestComponent, {
        // TODO: set the initial state here to simplify the test
      })
      const auth = mockedStore(useAuthStore)
      const preferences = mockedStore(usePreferencesStore)

      // TODO:
    })

    it('does not update the preferences on the server if the user is not logged in', async () => {
      const wrapper = mount(TestComponent, {
        // TODO:
      })
      const auth = mockedStore(useAuthStore)
      const preferences = mockedStore(usePreferencesStore)

      // TODO:
    })
  })
})

function mockedStore<TStoreDef extends () => unknown>(
  useStore: TStoreDef,
): TStoreDef extends StoreDefinition<infer Id, infer State, infer Getters, infer Actions>
  ? Store<
      Id,
      State,
      Getters,
      {
        [K in keyof Actions]: Actions[K] extends (...args: infer Args) => infer ReturnT
          ? Mock<Args, ReturnT>
          : Actions[K]
      }
    >
  : ReturnType<TStoreDef> {
  return useStore() as any
}
