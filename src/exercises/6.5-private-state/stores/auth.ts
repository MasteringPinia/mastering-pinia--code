import { User, UserRegister, login as _login, registerUser } from '@/api/auth'
import { defineStore, acceptHMRUpdate } from 'pinia'
import { computed, ref } from 'vue'

const useAuthPrivate = defineStore('auth-private', () => {
  const currentUser = ref<User | null>(null)

  return { currentUser }
})

export const useAuthStore = defineStore('auth', () => {
  const privateState = useAuthPrivate()

  function signup(userInfo: UserRegister): Promise<User> {
    return registerUser(userInfo)
  }

  async function login(email: string, password: string) {
    const user = await _login({ email, password })
    privateState.currentUser = user
  }

  function logout() {
    privateState.currentUser = null
  }

  return {
    currentUser: computed(() => privateState.currentUser),
    signup,
    login,
    logout,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
}
