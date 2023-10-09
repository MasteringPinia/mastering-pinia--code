<script setup lang="ts">
import { useExerciseLinks } from '../router'

const exerciseLinks = useExerciseLinks()
const showReviewWarning = import.meta.env.VITE_GIT_CLONE_WARNING !== 'off'
</script>

<template>
  <h2 class="mb-6">Exercises:</h2>

  <div v-if="showReviewWarning" class="rounded-md bg-red-200 dark:bg-red-800 border py-2 px-6 mb-12">
    <h3>😅 Oops!</h3>
    <img src="/oops.gif" alt="Oh, wow!" class="max-h-24" />
    <p class="m-0 text-lg">⚠️ It looks like you <i>cloned the repository directly</i>.</p>

    <p class="text-lg">You need to run this command instead:</p>

    <pre><code>npx zx@7.2 https://esm.is/mastering-pinia</code></pre>

    <p>Delete this project and try again with that command! 🙌</p>
  </div>

  <ul>
    <li v-for="link in exerciseLinks" :key="link.name">
      <RouterLink :to="link">{{ $router.resolve(link).path }}</RouterLink>
    </li>
  </ul>
</template>
