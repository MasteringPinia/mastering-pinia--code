<script lang="ts" setup>
import { useAsyncState } from '@vueuse/core'
import { seedDecksAndCards } from './spaced-repetition/api'
import ErrorDisplay from './components/ErrorDisplay.vue'

const { execute, error, isLoading } = useAsyncState(() => seedDecksAndCards(), null, {
  immediate: false,
})
</script>

<template>
  <h1>Spaced Repetition Study</h1>

  <nav>
    <RouterLink :to="{ name: '/10.1-workshop-spaced-repetition-study//decks' }">My Decks</RouterLink>
    |
    <RouterLink :to="{ name: '/10.1-workshop-spaced-repetition-study//review' }">Review</RouterLink>
  </nav>

  <section v-if="$route.name === '/10.1-workshop-spaced-repetition-study/'">
    <p>
      Welcome to the Spaced Repetition Study app!
      <br />
      You can seed the database from here anytime.
      <br />
      Open the Instructions to get started and visit one of the subpages.
    </p>

    <button :disabled="isLoading" @click="execute()">Seed the database (DELETES ALL EXISTING DECKS)</button>
    <p v-if="isLoading">Seeding the database...</p>

    <p v-if="error">
      If you get a network error, raise the <code>TIME</code> variable in <code>spaced-repetition/api.ts</code> to 100
      or higher. It will take a bit longer.
    </p>

    <ErrorDisplay v-if="error" :error="error as any" />
  </section>

  <RouterView />
</template>
