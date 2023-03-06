import { MandeError } from 'mande'
import { NavigationGuard, RouteLocationNormalized } from 'vue-router'

export const metaFetchingGuard: NavigationGuard = async to => {
  // ...
}

declare module 'vue-router' {
  export interface RouteMeta {
    // type any
  }
}
