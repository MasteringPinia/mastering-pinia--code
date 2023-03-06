import { createRouter, createWebHistory } from 'vue-router/auto'
import { Component, TransitionProps } from 'vue'
import { RouteRecordOverride } from './utils'

// imports from exercise
import { metaFetchingGuard } from '@ex/0x-routing-meta-data-fetching/navigation-guard'
import ex0xRouteOverride from '@ex/0x-routing-meta-data-fetching/route-override'

const exerciseRoutesOverrides: Record<string, RouteRecordOverride | undefined> = {
  // TODO: automatic to all folders with some kind of plugin architecture
  '0x-routing-meta-data-fetching': ex0xRouteOverride,
}

export const router = createRouter({
  history: createWebHistory(),
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

export const exerciseLinks = router.getRoutes().filter(route => route.meta.exerciseData)

// layout system

const resolvedLayouts = new Map<string, Component>()
router.beforeResolve(async to => {
  const layout = to.meta.layout || 'default'
  if (!resolvedLayouts.has(layout)) {
    resolvedLayouts.set(layout, (await import(`./layouts/${layout}.vue`)).default)
  }

  to.meta.resolvedLayout = resolvedLayouts.get(layout)!
})

// 0x-routing-meta-data-fetching
router.beforeResolve(metaFetchingGuard)

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
