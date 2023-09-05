import { createRouter as _createRouter, createWebHistory, useRouter, createMemoryHistory } from 'vue-router/auto'
import { Component, TransitionProps } from 'vue'
import { RouteRecordOverride } from './utils'

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
  return useRouter()
    .getRoutes()
    .filter(route => route.meta.exerciseData)
    .sort((a, b) => a.path.localeCompare(b.path))
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
    }
  }
}
