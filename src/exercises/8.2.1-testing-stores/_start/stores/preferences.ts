import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

export const usePreferencesStore = defineStore('preferences', () => {
  const theme = useLocalStorage('theme', 'dark', { initOnMounted: true })
  const anonymizeName = useLocalStorage('anonymizeName', false, { initOnMounted: true })

  return { theme, anonymizeName }
})
