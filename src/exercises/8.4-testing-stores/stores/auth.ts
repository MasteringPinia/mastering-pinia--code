import { defineStore, acceptHMRUpdate } from 'pinia'
import { computed, ref } from 'vue'
import { usePreferencesStore } from './preferences'
import {
  type User,
  login as apiLogin,
  logout as apiLogout,
  registerUser as apiRegisterUser,
  type UserCredentials,
  type UserRegister,
  autoLogin,
} from '~/api/auth'
import { useLocalStorage } from '@vueuse/core'

export const useAuthStore = defineStore(
  'auth',
  () => {
    const user = ref<User | null>(null)
    // a nested store for preferences that can be used without being logged in
    const preferences = usePreferencesStore()

    if (typeof document !== 'undefined') {
      autoLogin()
        .then(userData => {
          user.value = userData
        })
        .catch(err => {
          console.error('Failed to auto-login', err)
        })
    }

    const displayName = computed(() => {
      if (preferences.anonymizeName) {
        return 'Anonymous'
      }
      return user.value?.displayName ?? 'Guest'
    })

    async function updateLocalPreferences({
      anonymizeName,
      theme,
    }: {
      anonymizeName?: boolean
      theme?: 'light' | 'dark'
    }) {
      console.log('Updating...')
      preferences.anonymizeName = anonymizeName ?? preferences.anonymizeName
      preferences.theme = theme ?? preferences.theme
    }

    async function register(user: UserRegister) {
      const userData = await apiRegisterUser(user)
      return userData
    }

    async function login(credentials: UserCredentials) {
      // this should use an external module to authenticate
      // ...
      user.value = await apiLogin(credentials)
    }

    async function logout() {
      const lastUser = user.value
      if (!lastUser) return
      await apiLogout()
      updateLastConnection(lastUser)
      user.value = null
    }

    const lastConnection = useLocalStorage<null | { when: Date; name: string }>('lastConnection', null, {
      initOnMounted: true,
    })
    function updateLastConnection(user: User) {
      lastConnection.value = {
        when: new Date(),
        name: user.displayName,
      }
    }

    return {
      user,
      lastConnection,
      displayName,
      register,
      login,
      logout,
      updateLocalPreferences,
    }
  },
  {
    debounce: {
      // login: 200,
      updateLocalPreferences: [1000, { isImmediate: false }],
    },
  },
)

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
}
