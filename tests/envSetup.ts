import { VueRouterMock, createRouterMock, injectRouterMock } from 'vue-router-mock'
import { config } from '@vue/test-utils'
import { type Mock, beforeEach, vi } from 'vitest'
import { ClientOnly } from '@/components/.internal/ClientOnly'
import { createPinia, setActivePinia } from 'pinia'

beforeEach(() => {
  // to make all tests work if they use pinia
  setActivePinia(createPinia())
})

// create one router per test file
const router = createRouterMock({
  useRealNavigation: true,
  runInComponentGuards: true,
  spy: {
    create: vi.fn,
    reset: (spy: Mock) => spy.mockClear(),
  },
})
// allows calling getRouter()
injectRouterMock(router)

// // Add properties to the wrapper
config.plugins.VueWrapper.install(VueRouterMock)
config.global.components.ClientOnly = ClientOnly
