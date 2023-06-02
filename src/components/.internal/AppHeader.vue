<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router/auto'
import { openFile } from '@/.internal/utils/files'
import InstructionsModal from './InstructionsModal.vue'

const route = useRoute()
const isModalOpened = ref(false)
</script>

<template>
  <header>
    <h1>Vue 3 Workshop</h1>

    <nav>
      <RouterLink class="pb-1 border-b-2 border-dashed hover:border-solid link" to="/">All Exercises</RouterLink>
    </nav>

    <div v-if="route.meta.exerciseData" class="text-xs w-fit">
      <a
        :href="`file://.${route.meta.exerciseData.filepath}`"
        role="button"
        @click.prevent="openFile(route.meta.exerciseData!.filepath)"
        >Edit this file</a
      >
      |
      <a :href="`file://.${route.meta.exerciseData.instructions}`" role="button" @click.prevent="isModalOpened = true"
        >Open instructions</a
      >
    </div>

    <!-- TODO: previous / next -->
  </header>

  <InstructionsModal v-model="isModalOpened" />
</template>

<style>
:root {
  --nc-bg-gradient: #111111;
}

@media (prefers-color-scheme: light) {
  :root {
    --nc-bg-gradient: #f2f2f2;
  }
}
</style>

<style scoped>
header {
  background-image: linear-gradient(to top, var(--nc-bg-gradient), var(--nc-bg-1));
  view-transition-name: main-header;
}
</style>
