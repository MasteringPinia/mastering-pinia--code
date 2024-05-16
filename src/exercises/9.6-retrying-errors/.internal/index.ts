import type { ExerciseInstall } from '@/.internal/utils'
import { PiniaRetryPlugin } from '../retry-plugin'

export const install: ExerciseInstall = ({ pinia }) => {
  pinia.use(PiniaRetryPlugin)
}
