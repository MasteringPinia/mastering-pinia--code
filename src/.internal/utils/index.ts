import { Pinia } from 'pinia'
import { App, onScopeDispose } from 'vue'
import { useRouter, Router, NavigationHookAfter } from 'vue-router/auto'

/**
 * The `install` function is called with application globals.
 */
export interface ExerciseInstall {
  (options: { router: Router; pinia: Pinia; app: App }): void | Promise<unknown>
}

/**
 * Each exercise can have an `.internal/index.ts` that exports an `install` function.
 */
export interface ExerciseModule {
  install?: ExerciseInstall
}

export function onAfterEach(guard: NavigationHookAfter) {
  const router = useRouter()
  const remove = router.afterEach(guard)
  onScopeDispose(remove)
  return remove
}
