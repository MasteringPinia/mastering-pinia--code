import { createApp } from 'vue'
import { Router } from 'vue-router/auto'
import './index.css'
import '@exampledev/new.css'
import App from './App.vue'
import { createPinia, Pinia } from 'pinia'
import { router } from './router'

const pinia = createPinia()

interface ExerciseModule {
  install?: (options: { router: Router; pinia: Pinia }) => void
}

// install all possible modules from exercises
const exModules = import.meta.glob<false, string, ExerciseModule>('./exercises/*/.internal/index.ts')
Promise.all(Object.keys(exModules).map(path => exModules[path]())).then(modules =>
  modules.map(m => m?.install?.({ pinia, router })),
)

createApp(App)
  .use(router)
  .use(pinia)
  .mount('#app')
