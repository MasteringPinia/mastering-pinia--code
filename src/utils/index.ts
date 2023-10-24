import { useIntervalFn } from '@vueuse/core'
import { MandeError } from 'mande'
import { MaybeRefOrGetter, ref, toValue } from 'vue'
import { RouteRecordRaw } from 'vue-router/auto'

export function isMandeError<T = any>(error: any): error is MandeError<T> {
  return 'response' in error
}

export type RouteRecordOverride = Omit<RouteRecordRaw, 'path' | 'name' | 'component' | 'components' | 'redirect'>

/**
 * Formats a time in ms to a string, rounded to the nearest unit.
 * @param time - time in ms
 */
export function formatTime(time: number) {
  if (time < 1000) {
    return `${Math.round(time)}ms`
  }

  if (time < 60000) {
    const seconds = Math.round(time / 1000)
    return `${seconds} second${seconds > 1 ? 's' : ''}`
  }

  if (time < 3600000) {
    const minutes = Math.round(time / 60000)
    return `${minutes} minute${minutes > 1 ? 's' : ''}`
  }

  if (time < 86400000) {
    const hours = Math.round(time / 3600000)
    return `${hours} hour${hours > 1 ? 's' : ''}`
  }
  if (time < 604800000) {
    const days = Math.round(time / 86400000)
    return `${days} day${days > 1 ? 's' : ''}`
  }

  if (time < 2629800000) {
    const weeks = Math.round(time / 604800000)
    return `${weeks} week${weeks > 1 ? 's' : ''}`
  }

  if (time < 31557600000) {
    const months = Math.round(time / 2629800000)
    return `${months} month${months > 1 ? 's' : ''}`
  }

  const years = Math.round(time / 31557600000)
  return `${years} year${years > 1 ? 's' : ''}`
}

export function useElapsedTime(time: MaybeRefOrGetter<number>) {
  const formattedTime = ref(formatTime(Date.now() - toValue(time)))
  useIntervalFn(() => {
    formattedTime.value = formatTime(Date.now() - toValue(time))
  }, 1000)

  return formattedTime
}
