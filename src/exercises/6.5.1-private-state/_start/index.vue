<script lang="ts" setup>
// ⛔️ Feel free to play around with the code below, but you only need to change the code in the store file:
// `store/auth.ts`
import { ref } from 'vue'
import { useAuthStore } from './stores/auth'

const auth = useAuthStore()

const signupEmail = ref('')
const signupPassword = ref('')
const signupDisplayName = ref('')
const signupError = ref<Error | null>(null)
async function signup() {
  if (!signupEmail.value || !signupPassword.value || !signupDisplayName.value) {
    signupError.value = new Error('Missing fields')
    return
  }
  signupError.value = null
  try {
    await auth.signup({
      displayName: signupDisplayName.value,
      email: signupEmail.value,
      password: signupPassword.value,
    })
    // reset values if we succeed
    signupEmail.value = ''
    signupPassword.value = ''
    signupDisplayName.value = ''
  } catch (err: any) {
    signupError.value = err
    console.error(err)
  }
}

const loginEmail = ref('')
const loginPassword = ref('')
const loginError = ref<Error | null>(null)
async function login() {
  loginError.value = null
  try {
    await auth.login(loginEmail.value, loginPassword.value)
    // reset values if we succeed
    loginEmail.value = ''
    loginPassword.value = ''
  } catch (err: any) {
    loginError.value = err
    console.error(err)
  }
}

const isFailingAsExpected = ref<boolean>()
function shouldFail() {
  try {
    // @ts-ignore: this shouldn't be allowed, replace it with "@ts-expect-error"
    auth.currentUser = {
      displayName: 'John Doe',
      email: 'john@gmail.com',
      photoURL: `https://i.pravatar.cc/150?u=john-doe`,
    }
    isFailingAsExpected.value = false
  } catch (err) {
    isFailingAsExpected.value = true
  }
}
</script>

<template>
  <h3>Auth store</h3>

  <p>
    This store is storing the current user as state and <i>returning it</i>. However, it allows changing the
    <code>currentUser</code> from outside the store. This should not be possible...
  </p>

  <section>
    <h4>Current user</h4>
    <p v-if="auth.currentUser">
      <img :src="auth.currentUser.photoURL" alt="Profile picture" />
      <span>{{ auth.currentUser.displayName }}</span>
    </p>
    <p v-else>Not logged in.</p>
  </section>

  <!-- This should fail -->
  <button @click="shouldFail">Try changing <code>auth.currentUser</code></button>

  <p class="mt-2">
    <template v-if="isFailingAsExpected == null">Try the button above!</template>
    <template v-if="isFailingAsExpected == true">✅ Nice! It failed as expected</template>
    <template v-else-if="isFailingAsExpected == false">
      ❌ Changing <code>auth.currentUser</code> should throw
    </template>
  </p>

  <section class="grid grid-flow-row md:grid-cols-2 gap-x-2">
    <form class="flex flex-col" @submit.prevent="signup">
      <h4>Signup</h4>

      <fieldset class="flex flex-col justify-end flex-grow">
        <p v-if="signupError">{{ signupError }}</p>

        <label for="signup-email"> Email: </label>
        <input id="signup-email" v-model="signupEmail" required type="text" />
        <label for="signup-password"> Password: </label>
        <input id="signup-password" v-model="signupPassword" required type="password" />
        <label for="signup-display-name"> Display Name: </label>
        <input id="signup-display-name" v-model="signupDisplayName" required type="text" />
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
</template>
