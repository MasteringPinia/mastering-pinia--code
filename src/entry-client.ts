import { createApp } from './main'

createApp().then(({ app, router }) => {
  // wait until router is ready before mounting to ensure hydration match
  router.isReady().then(() => {
    app.mount('#app')
  })
})
