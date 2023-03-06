import { MandeError } from 'mande'
import { NavigationGuard, RouteLocationNormalized } from 'vue-router'
import { isMandeError } from '~/utils'

export const metaFetchingGuard: NavigationGuard = async to => {
  if (to.meta.apiCall) {
    try {
      to.meta.data = await to.meta.apiCall(to)
    } catch (error) {
      if (isMandeError(error)) {
        to.meta.error = error
        return {
          name: 'Error',
          params: {
            pathMatch: to.path.slice(1).split('/'),
          },
          query: to.query,
          hash: to.hash,
        }
      } else {
        throw error
      }
    }
  }
}

declare module 'vue-router' {
  export interface RouteMeta {
    apiCall?: (to: RouteLocationNormalized) => Promise<unknown>
    data?: unknown
    error?: MandeError
  }
}
