<template>
  <h3>{{ error.message }}</h3>

  <details>
    <summary class="text-red-600 dark:text-red-500">{{ error.body.msg }}</summary>
    <pre v-if="error.stack">{{ error.stack }}</pre>
  </details>

  <p><a href="#" role="button" @click.prevent="$router.back()">Go Back</a> or try one of these:</p>

  <ul>
    <li v-for="link in exerciseLinks" :key="link.name">
      <router-link :to="link">{{ $router.resolve(link).path }}</router-link>
    </li>
  </ul>
</template>

<script setup lang="ts">
import type { MandeError } from 'mande'
import { exerciseLinks } from '../router'

defineProps<{ error: MandeError<{ code: number; msg: string }> }>()
</script>
