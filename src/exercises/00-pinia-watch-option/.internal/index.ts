import { Pinia } from 'pinia'
import { Router } from 'vue-router'
import { watchOptionPlugin } from '../watchStorePlugin'

export function install({ pinia }: { router: Router; pinia: Pinia }) {
  pinia.use(watchOptionPlugin)
}
