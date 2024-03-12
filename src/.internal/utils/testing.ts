import { createClient, getTests, hasTests as _hasTests, VitestClient } from '@vitest/ws-client'
import { type WebSocketStatus } from '@vueuse/core'
import { ResolvedConfig, TaskState, File as TestFile, Test, Task, Suite, UserConsoleLog } from 'vitest'
import { computed, onScopeDispose, reactive, Ref, ref, shallowRef, watch } from 'vue'
import { useRoute } from 'vue-router/auto'
import { LogMessageTypeEnum, showMessage } from './logging'
import { $settings } from './settings'

// NOTE: not exported by vitest
export type TaskCustom = Exclude<Task, Test | TestFile | Suite>
export type TestResult = Test | TaskCustom

export const PORT = '51205'
export const HOST = import.meta.env.SSR ? 'localhost' : [location.hostname, PORT].filter(Boolean).join(':')
export const ENTRY_URL = `${
  import.meta.env.SSR || location.protocol === 'https:' ? 'wss:' : 'ws:'
}//${HOST}/__vitest_api__`
const RETRIES = 20
// allows to extract the logType and messages
// s to match newlines with "."
// const MESSAGE_RE = /^__MESSAGE\[([^\]]+)\]\s*(.*)/is
const MESSAGE_TYPE_RE = /^\[([^\]]+)\]\s*(.*)/is
const MESSAGE_MARKER = '__MESSAGE'

export type RunState = 'idle' | 'running'

function handleTestConsoleLogs(log: UserConsoleLog, task?: Task | Test) {
  // there could be other logs from the user
  const messageMarkerPos = log.content.indexOf(MESSAGE_MARKER)
  if (log.type === 'stdout' && messageMarkerPos > -1) {
    // one log content can contain multiple messages
    const messages = log.content
      // remove the initial marker
      .slice(messageMarkerPos + MESSAGE_MARKER.length)
      // Remove the last empty line added by log
      .replace(/\n$/, '')
      // the newline removes empty lines between grouped logs
      // while still matching the first
      .split('\n__MESSAGE')

    for (const message of messages) {
      const match = MESSAGE_TYPE_RE.exec(message)
      if (match) {
        const [, logType, messages] = match
        // special format for the error tips
        if (logType === 'tip' && task) {
          const testName = task.suite?.suite?.name ? `${task.suite.name} > ${task.name}` : task.name
          showMessage(
            logType as LogMessageTypeEnum,
            {
              title: testName,
              subtitle: '💡 Unfold this only if you are blocked',
            },
            ...messages.split('\n'),
          )
        } else {
          showMessage(logType as LogMessageTypeEnum, {}, ...messages.split('\n'))
        }
      }
    }
  } else if (log.type === 'stderr') {
    showMessage('error', {}, `Failed running test`, log.content)
  }
}

interface UseTestClientReturn {
  client: VitestClient
  config: Ref<ResolvedConfig>
  status: Ref<WebSocketStatus>
  testRunState: Ref<RunState>
  runId: Ref<number>
  files: Ref<TestFile[]>
}

let memoizedClientReturn: UseTestClientReturn | undefined

export function useTestClient() {
  if (memoizedClientReturn) return memoizedClientReturn

  const runId = ref(0)

  const client = createClient(ENTRY_URL, {
    // makes the client state reactive
    reactive: reactive as any,
    reconnectTries: RETRIES,
    reconnectInterval: 2500,
    handlers: {
      onTaskUpdate() {
        if (testRunState.value !== 'running') {
          runId.value++
        }
        testRunState.value = 'running'
      },
      onFinished() {
        testRunState.value = 'idle'
      },
      onUserConsoleLog: handleTestConsoleLogs,
    },
  })

  const config = shallowRef<ResolvedConfig>({} as any)
  const status = ref<WebSocketStatus>('CONNECTING')
  const testRunState: Ref<RunState> = ref('idle')

  const files = computed(() => client.state.getFiles())

  let hasWarnedError = false
  let currentRetries = 0
  // each time it tries to reconnect, it creates a new client
  watch(
    () => client.ws,
    ws => {
      status.value = 'CONNECTING'

      ws.addEventListener('open', async () => {
        status.value = 'OPEN'
        if (hasWarnedError) {
          showMessage('info', {
            label: '🤖',
            title: 'Test Server is back online',
            labelStyle: 'background: #a3e635; color: black;',
          })
        } else {
          showMessage('info', {
            label: '✅',
            title: 'Connected to Test Server',
            labelStyle: 'background: #a3e635; color: black;',
          })
        }
        hasWarnedError = false
        currentRetries = 0
        client.state.filesMap.clear()
        const [_files, _config] = await Promise.all([
          //
          client.rpc.getFiles(),
          client.rpc.getConfig(),
        ])
        client.state.collectFiles(_files)
        config.value = _config
      })

      ws.addEventListener('error', err => {
        if (!hasWarnedError) {
          hasWarnedError = true
          showMessage(
            'warn',
            { title: 'Test Server is not running' },
            `It seems like the test server isn't started...`,
            `Did you forget to run this command:`,
            `pnpm run dev:test-server`,
          )
        }
        console.warn(err)
      })

      ws.addEventListener('close', () => {
        // avoid any logs
        if (status.value === 'CLOSED') return

        if (++currentRetries >= RETRIES) {
          showMessage(
            'error',
            { title: 'Test Server is not running', collapsed: false },
            `Failed to connect to test server after ${RETRIES} retries. Reload the page and try again.`,
          )
          hasWarnedError = false
          currentRetries = 0
        } else {
          showMessage('info', {
            label: '🔌',
            title: (currentRetries > 1 ? `(${currentRetries}) ` : '') + `Reconnecting...`,
          })
        }
        if (status.value === 'CONNECTING') {
          status.value = 'CLOSED'
        }
      })
    },
    { immediate: true },
  )

  onScopeDispose(() => {
    status.value = 'CLOSED'
    client.ws.close()
  })

  return (memoizedClientReturn = {
    client,
    config,
    status,
    testRunState,
    runId,
    files,
  })
}

const testGroupStatusIconMap: Record<TaskState, string> = {
  fail: '🔴',
  pass: '🟢',
  run: '⌛️',
  skip: '⏭',
  // idle: '🏝',
  todo: '📝',
  only: '🔵',
}

const testStatusIconMap: Record<TaskState, string> = {
  fail: '❌',
  pass: '✅',
  run: '⌛️',
  skip: '⏭',
  // idle: '🏝',
  todo: '📝',
  only: '🔵',
}

const testStatusTextMap: Record<TaskState, string> = {
  fail: 'Failed',
  pass: 'Passed',
  run: 'Running...',
  skip: 'Skipped',
  only: 'Only this test run',
  todo: 'Has yet to be implemented',
}

export function getStatusIcon(test: Test | TaskCustom) {
  return testGroupStatusIconMap[test.result?.state || test.mode] || '❓'
}

export function getTestStatusIcon(test: Test | TaskCustom) {
  return testStatusIconMap[test.result?.state || test.mode] || '❓'
}

export function getTestStatusText(test: Test | TaskCustom) {
  return testStatusTextMap[test.result?.state || test.mode] || 'Idle'
}

export interface TestSuiteInfo {
  name: string
  tests: Array<Test | TaskCustom>
  state: string
  stateText: string
}

/**
 * Groups tests per suite. Only takes into account nested suites.
 * @param tests - The tests to group
 */
function groupTestPerSuite(tests: Array<Test | TaskCustom>) {
  return tests.reduce((acc, test) => {
    // they have multiple levels of nesting describe > describe
    if (test.suite?.suite?.name) {
      if (!acc.has(test.suite.name)) {
        acc.set(test.suite.name, {
          name: test.suite.name,
          tests: [],
          state: getStatusIcon(test),
          stateText: getTestStatusText(test),
        })
      }
      const group = acc.get(test.suite.name)!
      group.tests.push(test)
      if (test.result?.state === 'fail') {
        group.state = getStatusIcon(test)
      } else if (test.result?.state === 'run' && group.state !== 'fail') {
        group.state = getStatusIcon(test)
      }
    }

    return acc
  }, new Map<string, TestSuiteInfo>())
}

export function useTestStatus() {
  const route = useRoute()
  const { files, client, testRunState, runId } = useTestClient()

  const currentSpecFiles = computed(() => {
    const target = route.meta.exerciseData?.dirname
    return files.value.filter(file => file.filepath.includes(`/${target}/.internal`))
  })
  const currentTests = computed(() => getTests(currentSpecFiles.value))

  const currentRunningTests = computed(() => currentTests.value.filter(test => test.result?.state === 'run'))
  const currentFailingTests = computed(() => currentTests.value.filter(test => test.result?.state === 'fail'))
  const currentPassingTests = computed(() =>
    currentTests.value.filter(test => test.result?.state === 'pass' || test.mode === 'skip' || test.mode === 'todo'),
  )

  const currentTestsPerSuite = computed(() => groupTestPerSuite(currentTests.value))
  const hasNestedSuites = computed(() => currentTestsPerSuite.value.size > 1)

  const currentLogs = computed(() => currentTests.value.flatMap(t => t.logs || []))

  const currentResult = computed(() => {
    if (testRunState.value === 'running') {
      return '🔄 '
    }
    if (currentFailingTests.value.length > 0) {
      return testGroupStatusIconMap.fail
    } else if (currentPassingTests.value.length > 0) {
      return testGroupStatusIconMap.pass
    }

    return '❓ '
  })

  const testResult = computed<'fail' | 'pass' | 'idle'>(() => {
    if (testRunState.value === 'running') {
      return 'idle'
    }
    if (currentFailingTests.value.length > 0) {
      return 'fail'
    } else if (currentPassingTests.value.length > 0) {
      return 'pass'
    }
    return 'idle'
  })
  const testResultAsText = computed(() => {
    if (testRunState.value === 'running') {
      return 'Running...'
    }
    if (currentFailingTests.value.length > 0) {
      return 'Failed'
    }
    if (currentPassingTests.value.length > 0) {
      return 'Passed'
    }
    return 'Idle'
  })

  const hasTests = computed(() => _hasTests(currentSpecFiles.value))

  async function rerun() {
    await client.waitForConnection()
    // avoid error in the console
    if (client.ws.readyState === WebSocket.CLOSING) {
      setTimeout(() => rerun, 1000)
      return
    } else if (client.ws.readyState !== WebSocket.OPEN) {
      await client.reconnect()
    }
    await client.rpc.rerun(currentSpecFiles.value.map(i => i.filepath))
  }

  let timesRan = 0
  watch(testRunState, state => {
    if (!hasTests.value) return

    if (state === 'idle') {
      const failedCount = currentFailingTests.value.length

      if (failedCount === 0) {
        showMessage('info', {
          label: '🎉',
          title: 'All tests are passing!',
          labelStyle: 'background: #a3e635; color: black;',
          titleFontSize: '22px',
        })
      } else {
        const failingTest = currentFailingTests.value.at(0)!
        showMessage(
          'error',
          {
            label: '🧑‍💻',
            collapsed: false,
            title: `${failedCount} test${failedCount === 1 ? ' is' : 's are'} still failing`,
          },
          ...currentFailingTests.value.map(test => '- ' + test.name),
          `You can inspect the error at http://localhost:51205/__vitest__/#/` +
            (failingTest.file ? `?file=${failingTest.file.id}` : ''),
        )
        for (const test of currentFailingTests.value) {
          if (!test.logs) continue
          for (const logs of test.logs) {
            handleTestConsoleLogs(logs, test)
          }
        }
        // currentFailingTests.value.flatMap(t => t.logs || []).forEach(handleTestConsoleLogs)
      }
    } else if (state === 'running') {
      const now = new Date()

      if (++timesRan > 1 && $settings!.clearOnTestRun) {
        console.clear()
      }
      showMessage('info', {
        label: `🔄 ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(
          now.getSeconds(),
        ).padStart(2, '0')}`,
        collapsed: true,
        title: `New Run for: ${String(route.name)}`,
      })
    }
  })

  const title = computed(() => route.meta.exerciseData?.dirname || 'All Tests')

  return {
    runId,
    hasTests,
    testResult,
    testResultAsText,
    currentResult,
    currentSpecFiles,
    currentLogs,
    currentTests,
    currentRunningTests,
    currentPassingTests,
    currentFailingTests,

    currentTestsPerSuite,
    hasNestedSuites,

    title,

    rerun,
  }
}
