import { Pinia } from 'pinia'
import { App } from 'vue'
import { Router } from 'vue-router/auto'

/**
 * Each exercise can have an `.internal/index.ts` that exports an `install` function.
 */
export interface ExerciseModule {
  install?: ExerciseInstall
}

/**
 * The `install` function is called with application globals.
 */
export interface ExerciseInstall {
  (options: { router: Router; pinia: Pinia; app: App }): void
}
