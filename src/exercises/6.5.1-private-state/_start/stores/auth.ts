import { User, UserRegister, login as _login, registerUser } from '@/api/auth'
import { defineStore, acceptHMRUpdate } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref<User | null>(null)

  function signup(userInfo: UserRegister): Promise<User> {
    return registerUser(userInfo)
  }

  async function login(email: string, password: string) {
    const user = await _login({ email, password })
    currentUser.value = user
  }

  function logout() {
    currentUser.value = null
  }

  return {
    currentUser,
    signup,
    login,
    logout,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
}
