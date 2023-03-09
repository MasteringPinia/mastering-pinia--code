import { MandeError } from 'mande'
import { RouteRecordRaw } from 'vue-router/auto'

export function isMandeError<T = any>(error: any): error is MandeError<T> {
  return 'response' in error
}

export type RouteRecordOverride = Omit<RouteRecordRaw, 'path' | 'name' | 'component' | 'components' | 'redirect'>
