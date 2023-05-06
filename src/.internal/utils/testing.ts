import { createClient, getTests, hasTests as _hasTests } from '@vitest/ws-client'
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
export const HOST = [location.hostname, PORT].filter(Boolean).join(':')
export const ENTRY_URL = `${location.protocol === 'https:' ? 'wss:' : 'ws:'}//${HOST}/__vitest_api__`
const RETRIES = 20
const MESSAGE_RE = /^__MESSAGE\[([^\]]+)\]\s*(.*)$/gim

export type RunState = 'idle' | 'running'

function handleTestConsoleLogs(log: UserConsoleLog) {
  if (log.type === 'stdout' && log.content.startsWith('__MESSAGE[')) {
    const match = MESSAGE_RE.exec(log.content)
    if (match) {
      const [, logType, message] = match
      showMessage(logType as LogMessageTypeEnum, {}, message)
    }
  } else if (log.type === 'stderr') {
    showMessage('error', {}, `Failed running test`, log.content)
  }
}

function useTestClient() {
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

  return {
    client,
    config,
    status,
    testRunState,
    runId,
    files,
  }
}

const testStatusIconMap: Record<TaskState, string> = {
  fail: '🔴',
  pass: '✅',
  run: '⌛️',
  skip: '⏭',
  // idle: '🏝',
  todo: '📝',
  only: '🔵',
}

export function getStatusIcon(test: Test | TaskCustom) {
  return testStatusIconMap[test.result?.state || test.mode] || '❓'
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

  const currentLogs = computed(() => currentTests.value.flatMap(t => t.logs || []))

  const currentResult = computed(() => {
    if (testRunState.value === 'running') {
      return '🔄 '
    }
    if (currentFailingTests.value.length > 0) {
      return testStatusIconMap.fail
    } else if (currentPassingTests.value.length > 0) {
      return testStatusIconMap.pass
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

  const hasTests = computed(() => _hasTests(currentSpecFiles.value))

  function rerun() {
    return client.rpc.rerun(currentSpecFiles.value.map(i => i.filepath))
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
          `You can inspect the error at http://localhost:51205/__vitest__/` +
            (failingTest.file ? `#file=${failingTest.file.id}` : ''),
        )
        currentFailingTests.value.flatMap(t => t.logs || []).forEach(handleTestConsoleLogs)
      }
    } else if (state === 'running') {
      const now = new Date()

      if (++timesRan > 1 && $settings.clearOnTestRun) {
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
    currentResult,
    currentSpecFiles,
    currentLogs,
    currentTests,
    currentRunningTests,
    currentPassingTests,
    currentFailingTests,

    title,

    rerun,
  }
}
