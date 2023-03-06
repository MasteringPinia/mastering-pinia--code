import { Pinia } from 'pinia'
import { Router } from 'vue-router'
import { errorHandlingPlugin } from '../pinia-plugin'

export function install({ pinia }: { router: Router; pinia: Pinia }) {
  pinia.use(errorHandlingPlugin)
}
