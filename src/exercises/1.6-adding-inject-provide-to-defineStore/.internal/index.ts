import { ExerciseInstall } from '@/.internal/utils'
import { appPlugin } from '../my-pinia'

export const install: ExerciseInstall = ({ app }) => {
  app.use(appPlugin)
}
