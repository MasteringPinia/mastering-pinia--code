import { createApp } from 'vue'
import 'animate.css'
import './index.css'
import '@exampledev/new.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import { router } from './router'
import { ExerciseModule } from './.internal/utils'

const pinia = createPinia()
const app = createApp(App)

// install all possible modules from exercises
const exModules = import.meta.glob<false, string, ExerciseModule>('./exercises/*/.internal/index.ts')
Promise.all(Object.keys(exModules).map(path => exModules[path]()))
  .then(modules => modules.map(m => m?.install?.({ pinia, router, app })))
  .finally(() => {
    app.use(pinia).use(router).mount('#app')
  })
