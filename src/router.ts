import { createRouter as _createRouter, createWebHistory, useRouter, createMemoryHistory } from 'vue-router/auto'
import { RouteNamedMap } from 'vue-router/auto/routes'
import { Component, TransitionProps, computed } from 'vue'
import { RouteRecordOverride } from './utils'
import { useTestClient } from './.internal/utils/testing'

const exerciseRoutesOverrides: Record<string, RouteRecordOverride | undefined> = {
  // TODO: automatic to all folders with some kind of plugin architecture
}

export function createRouter() {
  const router = _createRouter({
    history: import.meta.env.SSR ? createMemoryHistory() : createWebHistory(),
    extendRoutes(routes) {
      for (const route of routes) {
        if (typeof route.name === 'string' && route.name in exerciseRoutesOverrides) {
          const oldMeta = route.meta
          const override = exerciseRoutesOverrides[route.name]!
          Object.assign(route, override)
          route.meta = { ...oldMeta, ...override.meta }
        }
      }
      return routes
    },
  })

  const resolvedLayouts = new Map<string, Component>()
  router.beforeResolve(async to => {
    const layout = to.meta.layout || 'default'
    if (!resolvedLayouts.has(layout)) {
      resolvedLayouts.set(layout, (await import(`./layouts/${layout}.vue`)).default)
    }

    to.meta.resolvedLayout = resolvedLayouts.get(layout)!
  })

  return router
}

export function useExerciseLinks() {
  const router = useRouter()
  const exerciseLinks = router
    .getRoutes()
    .filter(route => route.meta.exerciseData?.index === null)
    .sort((a, b) => a.path.localeCompare(b.path))

  if (typeof window === 'undefined') {
    // computed just to look like the other return
    return computed(() =>
      exerciseLinks.map(link => ({
        name: link.name,
        path: router.resolve(link).path,
        status: null,
      })),
    )
  }

  // can only be used in the browser
  const { files } = useTestClient()

  // this works because there is always a delay between the tests running and the first render
  // otherwise it would create a hydration mismatch
  return computed(() => {
    return exerciseLinks.map(link => {
      const test = files.value.find(file => file.name.includes(link.name as string))
      return {
        name: link.name,
        path: router.resolve(link).path,
        status: test ? test.result?.state : null,
      }
    })
  })
}

// layout system
// TS extensions

declare module 'vue-router' {
  export interface RouteMeta {
    /**
     * Possible layouts for a route. Should correspond to an existing .vue file in the src/layouts folder.
     */
    layout?: 'default' | 'error'

    /**
     * Component of the layout to be used. Used by Layout.vue.
     */
    resolvedLayout?: Component

    /**
     * Transition to apply for the entering or leaving view.
     */
    transition?: string | TransitionProps

    /**
     * Exercises routes have this extra information added at build time
     */
    exerciseData?: {
      /**
       * Name of the filename for the current exercise. Used to compute the test to run.
       */
      dirname: string

      /**
       * Filepath to the index file of the exercise.
       */
      filepath: string

      /**
       * Filepath to the instructions of the exercise.
       */
      instructions: string

      /**
       * Filepath to the index path of the exercise without the extension. Null if this is the index file.
       */
      index: keyof RouteNamedMap | null
    }
  }
}
