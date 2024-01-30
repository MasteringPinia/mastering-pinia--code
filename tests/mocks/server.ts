import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll } from 'vitest'
import { handlers } from './handlers'

export const server = setupServer(...handlers)
export const delay = (t: number) => new Promise(r => setTimeout(r, t))

export function mockHttpRequests() {
  beforeAll(() => {
    server.listen({ onUnhandledRequest: 'error' })
  })
  afterAll(async () => {
    // await for any pending request to resolve
    // otherwise the process crashes at the end
    // await delay(20)
    // NOTE: ^ this fails when mocking timers
    server.close()
  })
  afterEach(() => {
    server.resetHandlers()
  })
}
