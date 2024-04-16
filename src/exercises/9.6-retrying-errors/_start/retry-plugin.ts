import type { PiniaPlugin } from 'pinia'

export interface RetryOptions {
  /**
   * The delay between retries. Can be a duration in ms or a function that receives the attempt number (starts at 0) and returns a duration in ms. By default, it will wait 2^attempt * 1000 ms, but never more than 30 seconds.
   * @param attempt -
   * @returns
   */
  delay?: number | ((attempt: number) => number)

  /**
   * The maximum number of times to retry the operation. Set to 0 to disable or to Infinity to retry forever. It can also be a function that receives the failure count and the error and returns if it should retry. Defaults to 3.
   */
  retry?: number | ((failureCount: number, error: unknown) => boolean)
}

const RETRY_OPTIONS_DEFAULTS = {
  delay: (attempt: number) => {
    const time = Math.min(
      2 ** attempt * 1000,
      // never more than 30 seconds
      30_000,
    )
    console.log(`⏲️ delaying attempt #${attempt + 1} by ${time}ms`)
    return time
  },
  retry: count => {
    console.log(`🔄 Retrying ${'🟨'.repeat(count)}${'⬜️'.repeat(3 - count)}`)
    return count < 3
  },
} satisfies Required<RetryOptions>

export const PiniaRetryPlugin: PiniaPlugin = ({ store, options: { retry } }) => {
  // TODO:
}

declare module 'pinia' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  export interface DefineStoreOptionsBase<S, Store> {
    /**
     * Options for retrying operations in the store. Can be applied to all actions or specific actions.
     */
    retry?: any // TODO: add the correct type
  }
}
