import { computed, nextTick } from 'vue'
import { LocationQueryRaw, LocationQueryValue, LocationQueryValueRaw, useRoute, useRouter } from 'vue-router/auto'

let pendingQuery: LocationQueryRaw | null = null

export function useQueryParam<T = string>(
  key: string,
  {
    parseValue = (value: LocationQueryValue | LocationQueryValue[]): T =>
      // @ts-expect-error: '' is not assignable to T, but in those scenarios, the parseValue should be overridden
      Array.isArray(value) || !value ? '' : value,
    serializeValue = (value: T): LocationQueryValueRaw | LocationQueryValueRaw[] => String(value),
    deleteIf = (value: T) => !value,
  } = {},
) {
  const route = useRoute()
  const router = useRouter()

  return computed<T>({
    get: () => parseValue(route.query[key]),
    set: value => {
      const query = pendingQuery || { ...route.query }
      query[key] = serializeValue(value)
      if (deleteIf(value)) {
        delete query[key]
      }

      if (!pendingQuery) {
        nextTick().then(() => {
          router.push({ query })
          pendingQuery = null
        })
        pendingQuery = query
      }
    },
  })
}
