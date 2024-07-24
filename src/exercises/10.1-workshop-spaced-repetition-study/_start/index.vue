<script lang="ts" setup>
import { useAsyncState, useLocalStorage } from '@vueuse/core'
import { resetAllDueDates as _resetAllDueDates, seedDecksAndCards } from './spaced-repetition/api'
import ErrorDisplay from './components/ErrorDisplay.vue'
import { ref, shallowRef, watch } from 'vue'
import { useRoute } from 'vue-router/auto'

const route = useRoute()
const { execute, error, isLoading } = useAsyncState(() => seedDecksAndCards(), null, {
  immediate: false,
})

const resetCount = ref(0)
const {
  execute: resetAllDueDates,
  error: resetDueDatesError,
  isLoading: isResettingDueDates,
} = useAsyncState(
  async () => {
    await _resetAllDueDates('deckId' in route.params ? route.params.deckId : undefined)
    // force update all components
    resetCount.value++
  },
  null,
  {
    immediate: false,
  },
)

const today = shallowRef(new Date().toISOString().slice(0, 10))
const originalDateNow = Date.now
const isMocked = ref(false)
const isDebugOpen = useLocalStorage('10-srs-debug-open', true)
function mockDateNow(newToday: string) {
  const date = new Date(newToday)
  const now = new Date()

  // unmock newToday is today
  if (
    // invalid date when clearing
    Number.isNaN(date.getTime()) ||
    newToday === now.toISOString().slice(0, 10)
  ) {
    Date.now = originalDateNow
    isMocked.value = false
    console.log('Restored Date.now()')
    return
  }

  date.setHours(now.getHours())
  date.setMinutes(now.getMinutes())
  date.setSeconds(now.getSeconds())
  date.setMilliseconds(now.getMilliseconds())

  const newNow = date.getTime()
  Date.now = () => newNow
  isMocked.value = true
}
watch(today, newToday => mockDateNow(newToday), { immediate: true })
</script>

<template>
  <h1>Spaced Repetition Study</h1>

  <nav>
    <RouterLink :to="{ name: '/10.1-workshop-spaced-repetition-study//decks' }">My Decks</RouterLink>
    |
    <RouterLink :to="{ name: '/10.1-workshop-spaced-repetition-study//decks.new' }">New deck</RouterLink>
  </nav>

  <details :open="isDebugOpen">
    <summary>Debug</summary>
    <section>
      <label>Current day: </label>
      <input v-model="today" type="date" />
      <p>Change the date to <i>simulate</i> a different day to review cards!</p>
      <p v-if="isMocked" class="bg-slate-200 dark:bg-slate-800 p-2 border border-slate-400 rounded-md">
        🚨 The date is currently set to {{ today }}
      </p>
    </section>

    <p v-if="isResettingDueDates">Resetting due dates...</p>
    <ErrorDisplay v-if="resetDueDatesError" :debug="false" :error="(resetDueDatesError as any)" />

    <div>
      <button :disabled="isResettingDueDates" @click="resetAllDueDates()">Reset ALL due dates</button>
    </div>
  </details>

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

    <ErrorDisplay v-if="error" :error="(error as any)" />
  </section>

  <RouterView :key="today + resetCount" />
</template>
