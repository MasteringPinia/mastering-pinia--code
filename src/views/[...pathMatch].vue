<script setup lang="ts">
import { useRoute } from 'vue-router/auto'
import { useExerciseLinks } from '../router'

const exerciseLinks = useExerciseLinks()

const route = useRoute('/[...pathMatch]')
</script>

<template>
  <p>Error 404: Page Not Found</p>

  <p v-if="route.params.pathMatch">
    We don't have
    <code>{{ $route.path }}</code
    >. Maybe one of these:
  </p>
  <p v-else>Try one of these:</p>

  <ul>
    <li v-for="link in exerciseLinks" :key="link.name">
      <RouterLink :to="link">{{ $router.resolve(link).path }}</RouterLink>
    </li>
  </ul>
</template>
