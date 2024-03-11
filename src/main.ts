import { createSSRApp, createApp as _createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import { createRouter } from './router'
import type { ExerciseModule } from './.internal/utils'
import './.internal/utils/welcome'
import { ClientOnly } from './components/.internal/ClientOnly'
import { reviveState } from './pinia-state'
import { PiniaDebounce } from '@pinia/plugin-debounce'
import { debounce } from 'ts-debounce'

// SSR requires a fresh app instance per request, therefore we export a function
// that creates a fresh app instance. If using Vuex, we'd also be creating a
// fresh store here.
export function createApp() {
  const app =
    // avoid a hydration error when doing no SSR
    !import.meta.env.SSR && new URLSearchParams(location.search).has('no-ssr') ? _createApp(App) : createSSRApp(App)

  app.component('ClientOnly', ClientOnly)

  const pinia = createPinia()
  pinia.use(PiniaDebounce(debounce))
  // hydrate the state on client side
  if (!import.meta.env.SSR) {
    if (window.__PINIA_STATE__) {
      pinia.state.value = reviveState(window.__PINIA_STATE__)
    }
  }

  const router = createRouter()

  // install all possible modules from exercises
  const exModules = import.meta.glob<false, string, ExerciseModule>('./exercises/*/.internal/index.ts')
  return Promise.all(Object.keys(exModules).map(path => exModules[path]()))
    .then(modules => modules.map(m => m?.install?.({ pinia, router, app })))
    .finally(() => {
      // we add plugins but we don't mount here
      app.use(pinia).use(router)
    })
    .then(() => ({ app, router, pinia }))
}

declare global {
  interface Window {
    __PINIA_STATE__?: string
  }
}

declare module '@pinia/plugin-debounce' {
  export interface Config {
    Debounce: typeof debounce
  }
}
