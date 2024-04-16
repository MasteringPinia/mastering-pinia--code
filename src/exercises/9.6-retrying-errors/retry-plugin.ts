import type { PiniaPlugin, StoreActions } from 'pinia'
import { onScopeDispose } from 'vue'

export interface RetryOptions {
  /**
   * The delay between retries. Can be a duration in ms or a function that receives the attempt number and returns a duration in ms. By default, it will wait 2^attempt * 1000 ms, but never more than 30 seconds.
   * @param attempt -
   * @returns
   */
  delay?: number | ((attempt: number) => number)

  /**
   * The maximum number of times to retry the operation. Set to 0 to disable or to Infinity to retry forever. It can also be a function that receives the failure count and the error and returns if it should retry.
   */
  retry?: number | ((failureCount: number, error: unknown) => boolean)
}

export interface RetryEntry {
  retryCount: number
  timeoutId?: ReturnType<typeof setTimeout>
}

const RETRY_OPTIONS_DEFAULTS = {
  delay: (attempt: number) => {
    const time =  Math.min(
      2 ** attempt * 1000,
      // never more than 30 seconds
      30_000,
    )
    console.log(`⏲️ delaying attempt #${attempt} by ${time}ms`)
    return time
  },
  retry: count => {
    console.log(`🔄 Retrying ${'🟨'.repeat(count)}${'⬜️'.repeat(3 - count)}`)
    return count < 3
  },
} satisfies Required<RetryOptions>

export const PiniaRetryPlugin: PiniaPlugin = ({ store, options: { retry } }) => {
  if (!retry) return
  const defaults = { ...RETRY_OPTIONS_DEFAULTS, ...retry }

  const retryMap = new Map<string, RetryEntry>()
  // cleanup all pending retries and the map to avoid memory leaks
  onScopeDispose(() => {
    for (const { timeoutId } of retryMap.values()) {
      clearTimeout(timeoutId)
    }
    retryMap.clear()
  })

  store.$onAction(({ name, args, onError, after }) => {
    const localOptions = retry[name]
    if (!localOptions) return
    const options = localOptions === true ? defaults : { ...defaults, ...localOptions }

    // clear any pending retry
    clearTimeout(retryMap.get(name)?.timeoutId)
    onError(error => {
      // ensure the entry exists
      let entry = retryMap.get(name)
      if (!entry) {
        entry = { retryCount: 0 }
        retryMap.set(name, entry)
      }

      const shouldRetry =
        typeof options.retry === 'number'
          ? options.retry > entry.retryCount
          : options.retry(entry.retryCount + 1, error)

      if (shouldRetry) {
        const delay = typeof options.delay === 'function' ? options.delay(entry.retryCount + 1) : options.delay
        entry.timeoutId = setTimeout(() => {
          store[name](...args)
          entry.retryCount++
        }, delay)
      } else {
        // remove the entry if we are not going to retry
        retryMap.delete(name)
      }
    })

    // remove the entry if it worked out to reset it
    after(() => {
      retryMap.delete(name)
    })
  })
}

declare module 'pinia' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  export interface DefineStoreOptionsBase<S, Store> {
    /**
     * Options for retrying operations in the store. Can be applied to all actions or specific actions.
     */
    retry?: RetryOptions & Record<Extract<keyof StoreActions<Store>, string>, RetryOptions | boolean>
  }
}
