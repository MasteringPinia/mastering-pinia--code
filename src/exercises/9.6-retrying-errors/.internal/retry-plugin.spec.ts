import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { DefineStoreOptions, defineStore, setActivePinia } from 'pinia'
import { createTestingPinia } from '@pinia/testing'
import { PiniaRetryPlugin } from '../retry-plugin'

describe('Retry Actions Plugin', () => {
  beforeEach(() => {
    setActivePinia(
      createTestingPinia({
        createSpy: vi.fn,
        fakeApp: true,
        stubActions: false,
        plugins: [PiniaRetryPlugin],
      }),
    )
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  function factory(
    options: Omit<
      DefineStoreOptions<
        'test',
        Record<string, never>,
        Record<string, never>,
        {
          action: () => Promise<string>
        }
      >,
      'id' | 'actions'
    > = {},
  ) {
    const spy = vi.fn(async () => 'ok')
    const useStore = defineStore(
      'test',
      () => {
        return {
          action: spy,
        }
      },
      {
        ...options,
        retry: {
          retry: 3,
          delay: 0,
          action: true,
          ...options.retry,
        },
      },
    )

    return { spy, store: useStore() }
  }

  it('retries a failed action', async () => {
    const { spy, store } = factory()

    spy.mockRejectedValueOnce(new Error('nope'))
    expect(spy).toHaveBeenCalledTimes(0)
    store.action().catch(() => {})
    expect(spy).toHaveBeenCalledTimes(1)
    await vi.runOnlyPendingTimersAsync()
    expect(spy).toHaveBeenCalledTimes(2)
    await vi.runOnlyPendingTimersAsync()
    expect(spy).toHaveBeenCalledTimes(2)
  })

  it('does not retry a successful action', async () => {
    const { spy, store } = factory()

    spy.mockResolvedValueOnce('ok')
    expect(spy).toHaveBeenCalledTimes(0)
    await store.action().catch(() => {})
    await vi.runOnlyPendingTimersAsync()
    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('does not retry if an action is deactivated', async () => {
    const { store, spy } = factory({
      retry: { action: false },
    })

    spy.mockRejectedValueOnce(new Error('nope'))
    expect(spy).toHaveBeenCalledTimes(0)
    store.action().catch(() => {})
    expect(spy).toHaveBeenCalledTimes(1)
    await vi.runOnlyPendingTimersAsync()
    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('does not retry if no retry options are provided', async () => {
    const spy = vi.fn(async () => 'ok')
    const store = defineStore('test-2', () => ({
      action: spy,
    }))()

    spy.mockRejectedValueOnce(new Error('nope'))
    expect(spy).toHaveBeenCalledTimes(0)
    store.action().catch(() => {})
    expect(spy).toHaveBeenCalledTimes(1)
    await vi.runOnlyPendingTimersAsync()
    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('stops retrying after the max number of retries', async () => {
    const { spy, store } = factory({
      retry: {
        retry: 1,
        delay: 0,
        action: true,
      },
    })

    spy.mockRejectedValue(new Error('nope'))
    expect(spy).toHaveBeenCalledTimes(0)
    store.action().catch(() => {})
    await vi.runOnlyPendingTimersAsync()
    await vi.runOnlyPendingTimersAsync()
    await vi.runOnlyPendingTimersAsync()
    await vi.runOnlyPendingTimersAsync()
    expect(spy).toHaveBeenCalledTimes(2)
  })

  it('passes the retry count and the error to the retry function', async () => {
    const retry = vi.fn((count: number) => count < 2)
    const { spy, store } = factory({
      retry: { retry, delay: 1000 },
    })

    spy.mockRejectedValueOnce(new Error('1'))
    spy.mockRejectedValueOnce(new Error('2'))
    await store.action().catch(() => {})
    expect(retry).toHaveBeenCalledTimes(1)
    expect(retry).toHaveBeenCalledWith(0, new Error('1'))
    await vi.runOnlyPendingTimersAsync()
    expect(retry).toHaveBeenCalledTimes(2)
    expect(retry).toHaveBeenCalledWith(1, new Error('2'))
  })

  it('stops retrying if the retry function returns false', async () => {
    const retry = vi.fn(() => false)
    const { spy, store } = factory({
      retry: { retry },
    })

    spy.mockRejectedValue(new Error('nope'))
    retry.mockReturnValueOnce(true)
    retry.mockReturnValueOnce(false)
    expect(spy).toHaveBeenCalledTimes(0)
    store.action().catch(() => {})
    await vi.runOnlyPendingTimersAsync()
    await vi.runOnlyPendingTimersAsync()
    await vi.runOnlyPendingTimersAsync()
    await vi.runOnlyPendingTimersAsync()
    expect(spy).toHaveBeenCalledTimes(2)
  })

  it('waits for the delay before retrying', async () => {
    const { spy, store } = factory({
      retry: { delay: 1000 },
    })

    spy.mockRejectedValue(new Error('nope'))
    expect(spy).toHaveBeenCalledTimes(0)
    store.action().catch(() => {})
    expect(spy).toHaveBeenCalledTimes(1)
    await vi.advanceTimersByTimeAsync(999)
    expect(spy).toHaveBeenCalledTimes(1)
    await vi.advanceTimersByTimeAsync(1)
    expect(spy).toHaveBeenCalledTimes(2)
    await vi.advanceTimersByTimeAsync(999)
    expect(spy).toHaveBeenCalledTimes(2)
    await vi.advanceTimersByTimeAsync(1)
    expect(spy).toHaveBeenCalledTimes(3)
  })

  it('passes the attempt number to the delay function', async () => {
    const delay = vi.fn(() => 1000)
    const { spy, store } = factory({
      retry: { delay },
    })

    spy.mockRejectedValue(new Error('nope'))
    await store.action().catch(() => {})
    expect(delay).toHaveBeenCalledTimes(1)
    expect(delay).toHaveBeenCalledWith(0)
    await vi.advanceTimersByTimeAsync(1000)
    expect(spy).toHaveBeenCalledTimes(2)
    expect(delay).toHaveBeenCalledTimes(2)
    expect(delay).toHaveBeenCalledWith(1)
  })

  it('resets the retry count if the action is invoked manually', async () => {
    const { spy, store } = factory({
      retry: { retry: 2, delay: 1000 }
    })

    spy.mockRejectedValue(new Error('nope'))
    store.action().catch(() => {})
    await vi.advanceTimersToNextTimerAsync()
    expect(spy).toHaveBeenCalledTimes(2)
    store.action().catch(() => {})
    expect(spy).toHaveBeenCalledTimes(3)
    await vi.advanceTimersToNextTimerAsync()
    await vi.advanceTimersToNextTimerAsync()
    await vi.advanceTimersToNextTimerAsync()
    await vi.advanceTimersToNextTimerAsync()
    await vi.advanceTimersToNextTimerAsync()
    // stops at 1 + 1 retry + 1 + 2 retries
    expect(spy).toHaveBeenCalledTimes(5)
  })

})
