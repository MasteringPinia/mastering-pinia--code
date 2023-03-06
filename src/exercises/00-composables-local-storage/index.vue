<script lang="ts" setup>
import { useLocalStorage } from './useLocalStorage'

const name = useLocalStorage('username', '')
const counter = useLocalStorage('count', 0)
</script>

<template>
  <h1>Local Storage</h1>

  <label>
    What is your name?
    <input v-model="name" data-test="name" placeholder="Eduardo" type="text" />
  </label>

  <p>
    <span>
      Hi
      <b>{{ name }}</b
      >.
    </span>
    You have clicked the button below {{ counter }} times.
  </p>
  <button @click="counter++">Click me!</button>
</template>
