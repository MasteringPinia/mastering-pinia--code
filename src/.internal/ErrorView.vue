<script setup lang="ts">
import type { MandeError } from 'mande'
import { useExerciseLinks } from '../router'

const exerciseLinks = useExerciseLinks()

defineProps<{ error: MandeError<{ code: number; msg: string }> }>()
</script>

<template>
  <h3>{{ error.message }}</h3>

  <details>
    <summary class="text-red-600 dark:text-red-500">{{ error.body.msg }}</summary>
    <pre v-if="error.stack">{{ error.stack }}</pre>
  </details>

  <p><a href="#" role="button" @click.prevent="$router.back()">Go Back</a> or try one of these:</p>

  <ul>
    <li v-for="link in exerciseLinks" :key="link.name">
      <RouterLink :to="link">{{ $router.resolve(link).path }}</RouterLink>
    </li>
  </ul>
</template>
