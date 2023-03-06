import { getCurrentInstance, onMounted, onUnmounted, Ref, ref, watch } from 'vue'

export function useLocalStorage<T>(storageKey: string, defaultValue: T) {
  const initialValue = typeof window !== 'undefined' ? localStorage.getItem(storageKey) : null
  // NOTE: Necessary cast
  // https://github.com/vuejs/vue-next/issues/1324#issuecomment-641343512
  const data = ref(initialValue != null ? (JSON.parse(initialValue) as T) : defaultValue) as Ref<T>
  const dataStringValue = JSON.stringify(defaultValue)

  function storageListener({ key, newValue }: StorageEvent) {
    if (key === storageKey) {
      // TODO: bonus check for duplicated changes with object default values
      try {
        const newData = newValue ? (JSON.parse(newValue) as T) : defaultValue
        data.value = newData
      } catch (error) {
        console.log(`Invalid stored value for ${key}. Resetting the value.`)
        localStorage.removeItem(key)
      }
    }
  }

  const instance = getCurrentInstance()
  function init() {
    window.addEventListener('storage', storageListener)

    watch(
      data,
      newValue => {
        const stringValue = JSON.stringify(newValue)
        if (stringValue === dataStringValue) {
          localStorage.removeItem(storageKey)
        } else {
          localStorage.setItem(storageKey, stringValue)
        }
      },
      { deep: true },
    )
  }

  function cleanup() {
    window.removeEventListener('storage', storageListener)
  }

  if (instance) {
    onMounted(init)
    onUnmounted(cleanup)
  } else {
    init()
  }

  return data
}
