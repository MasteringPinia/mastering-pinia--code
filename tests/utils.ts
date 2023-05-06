import { LogeMessageType } from '@/.internal/utils/logging'

/**
 * Run a function and show a tip on fail: if throws, rejects, or returns falsy
 *
 * @param fn - function to run, can throw error or return false
 * @param messageTips - messages to show on fail
 */
export function tipOnFail(fn: () => unknown, ...messageTips: unknown[]): Promise<void> | void {
  try {
    const result = fn()
    if (isPromise(result)) {
      return result
        .then(v => {
          // eslint-disable-next-line eqeqeq
          if (v == false) {
            // also show on false return
            showTip(...messageTips)
          }
        })
        .catch(e => {
          showTip(...messageTips)
          throw e
        })
      // eslint-disable-next-line eqeqeq
    } else if (result == false) {
      // also show on false return
      showTip(...messageTips)
    }
  } catch (e) {
    showTip(...messageTips)
    throw e
  }
}

function isPromise<T = unknown>(value: unknown): value is Promise<T> {
  return value instanceof Promise
}

export function showMessage(type: LogeMessageType, ...messages: unknown[]) {
  console.log(`__MESSAGE[${type}] ${messages.join('\n')}`)
}

export function showTip(...messages: unknown[]) {
  showMessage('tip', ...messages)
}
