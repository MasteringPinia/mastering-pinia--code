import { RouteRecordOverride } from '~/utils'
import { getMemes } from '~/api/memes'

const routeOverride: RouteRecordOverride = {
  meta: {
    apiCall: getMemes,
  },
}

export default routeOverride
