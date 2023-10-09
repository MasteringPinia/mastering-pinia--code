<script lang="ts" setup>
// add variables here
import { registerUser } from '~/api/auth'

async function register() {
  const user = await registerUser({
    email: 'hello@gmail.com',
    password: 'wow',
    displayName: 'Hello',
  })

  console.log(user)
}
</script>

<template>
  <h1>Template to start an exercise</h1>

  <button @click="register">Click</button>
</template>
