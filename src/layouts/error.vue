<script lang="ts" setup>
import AppFooter from '@/components/.internal/AppFooter.vue'
import AppHeader from '@/components/.internal/AppHeader.vue'
</script>

<template>
  <AppHeader />

  <main class="grow">
    <h2 v-if="$route.name === '/[...pathMatch]'">Hmm 🤔</h2>

    <template v-else>
      <h2>Oops...</h2>
      <p>There seems to be an error...</p>
    </template>

    <router-view />
  </main>

  <hr />

  <AppFooter />
</template>
