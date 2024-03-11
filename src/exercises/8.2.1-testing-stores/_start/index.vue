<script lang="ts" setup>
import { ref } from 'vue'
import { useAuthStore } from './stores/auth'
import { usePreferencesStore } from './stores/preferences'

const auth = useAuthStore()
const preferences = usePreferencesStore()

const registerEmail = ref('')
const registerPassword = ref('')
const registerDisplayName = ref('')
const registerError = ref<Error | null>(null)
async function register() {
  if (!registerEmail.value || !registerPassword.value || !registerDisplayName.value) {
    registerError.value = new Error('Missing fields')
    return
  }
  registerError.value = null
  try {
    await auth.register({
      displayName: registerDisplayName.value,
      email: registerEmail.value,
      password: registerPassword.value,
    })
    // reset values if we succeed
    registerEmail.value = ''
    registerPassword.value = ''
    registerDisplayName.value = ''
  } catch (err: any) {
    registerError.value = err
    console.error(err)
  }
}

const loginEmail = ref('')
const loginPassword = ref('')
const loginError = ref<Error | null>(null)
async function login() {
  loginError.value = null
  try {
    await auth.login({
      email: loginEmail.value,
      password: loginPassword.value,
    })
    // reset values if we succeed
    loginEmail.value = ''
    loginPassword.value = ''
  } catch (err: any) {
    loginError.value = err
    console.error(err)
  }
}
</script>

<template>
  <h1>Unit Testing Stores</h1>

  <section class="grid grid-flow-row md:grid-cols-2 gap-x-2">
    <form class="flex flex-col" @submit.prevent="register">
      <h4>Create an account</h4>

      <fieldset class="flex flex-col justify-end flex-grow">
        <p v-if="registerError">{{ registerError }}</p>

        <label for="register-email"> Email: </label>
        <input id="register-email" v-model="registerEmail" required type="text" />
        <label for="register-password"> Password: </label>
        <input id="register-password" v-model="registerPassword" required type="password" />
        <label for="register-display-name"> Display Name: </label>
        <input id="register-display-name" v-model="registerDisplayName" required type="text" />
      </fieldset>

      <button>Signup</button>
    </form>

    <form class="flex flex-col" @submit.prevent="login">
      <h4>Login</h4>

      <fieldset class="flex flex-col justify-end flex-grow">
        <p v-if="loginError">{{ loginError }}</p>

        <label for="login-email"> Email: </label>
        <input id="login-email" v-model="loginEmail" required type="text" />
        <label for="login-password"> Password: </label>
        <input id="login-password" v-model="loginPassword" required type="password" />
      </fieldset>

      <button>Login</button>
    </form>
  </section>

  <div v-if="auth.user" class="space-x-1">
    <button @click="auth.logout()">Logout</button>
    <button
      @click="
        auth.updateLocalPreferences({
          anonymizeName: !preferences.anonymizeName,
          theme: preferences.theme === 'light' ? 'dark' : 'light',
        })
      "
    >
      Change preferences
    </button>
  </div>

  <p>Display Name: {{ auth.displayName }}</p>
  <label>
    <input v-model="preferences.anonymizeName" type="checkbox" />
    Anonymize Name
  </label>
  <pre>{{ auth.user }}</pre>
</template>
