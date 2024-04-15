import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

export const usePreferencesStore = defineStore('preferences', () => {
  const theme = useLocalStorage('theme', 'dark', { initOnMounted: true })
  const anonymizeName = useLocalStorage('anonymizeName', false, { initOnMounted: true })

  async function saveServerPreferences() {
    throw new Error('Not Implemented')
  }

  return { theme, anonymizeName, saveServerPreferences }
})
