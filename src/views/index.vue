<template>
  <h2 class="mb-6">Exercises:</h2>

  <ul>
    <li v-for="link in exerciseLinks" :key="link.name">
      <router-link :to="link">{{ $router.resolve(link).path }}</router-link>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { exerciseLinks } from '../router'
</script>
