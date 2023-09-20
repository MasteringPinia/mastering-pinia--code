import { VueRouterMock, createRouterMock, injectRouterMock } from 'vue-router-mock'
import { config } from '@vue/test-utils'
import { SpyInstance, vi } from 'vitest'
import { ClientOnly } from '@/components/.internal/ClientOnly'

// this doesn't work with peeky...
// beforeAll(() => server.listen())
// afterEach(() => server.resetHandlers())
// afterAll(() => server.close())

// create one router per test file
const router = createRouterMock({
  useRealNavigation: true,
  runInComponentGuards: true,
  spy: {
    create: vi.fn,
    reset: (spy: SpyInstance) => spy.mockClear(),
  },
})
// allows calling getRouter()
injectRouterMock(router)

// FIXME: https://github.com/capricorn86/happy-dom/issues/678
location.href = 'http://localhost:5173'

// // Add properties to the wrapper
config.plugins.VueWrapper.install(VueRouterMock)
config.global.components.ClientOnly = ClientOnly
