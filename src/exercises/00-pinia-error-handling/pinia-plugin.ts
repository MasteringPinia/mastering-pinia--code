import { Pinia, PiniaPlugin } from 'pinia'

export const errorHandlingPlugin: PiniaPlugin = ({ store, options, pinia }) => {
  // track the number of calls to actions
  let callCount = 0
  let activeActions = 0

  console.log(
    `📒 Registered store "${store.$id}" with error handling plugin. It has ${
      Object.keys(options.actions).length
    } actions`,
  )
  store.$onAction(({ name, onError, after, args }) => {
    if (activeActions < 1) {
      saveBeforeSnapshot(pinia)
    }

    activeActions++
    const groupName = `Action "${name}" (callCount: ${++callCount})`
    console.log('💨', groupName, `called with args:`, args)

    function afterAction() {
      activeActions--
      if (activeActions < 1) {
        saveAfterSnapshot(pinia)
      }
    }

    onError(error => {
      console.group('💥', groupName, 'failed')
      console.log(`error:`, error)
      console.groupEnd()
      afterAction()
    })

    after(result => {
      console.groupCollapsed('✅', groupName, 'success')
      console.log(`result:`, result)
      console.groupEnd()
      afterAction()
    })
  })
}

// null when there isn't an active action running
interface StateSnapshotEntry {
  before: string
  after: string
}
let currentSnapshot: StateSnapshotEntry | null = null
const snapshotHistory: StateSnapshotEntry[] = []

function saveBeforeSnapshot(pinia: Pinia) {
  if (!currentSnapshot) {
    currentSnapshot = {
      before: JSON.stringify(pinia.state.value),
      after: '',
    }
  }
}

function saveAfterSnapshot(pinia: Pinia) {
  if (!currentSnapshot) {
    throw new Error('No current snapshot')
  }
  currentSnapshot.after = JSON.stringify(pinia.state.value)

  if (currentSnapshot.before === currentSnapshot.after) {
    console.log(`📷 Same state. No snapshot saved`)
  } else {
    snapshotHistory.push(currentSnapshot)
    console.groupCollapsed(`📸 Saved state snapshot entry`)
    console.log(`before:`, currentSnapshot.before)
    console.log(`after:`, currentSnapshot.after)
    console.groupEnd()
  }

  currentSnapshot = null
}
