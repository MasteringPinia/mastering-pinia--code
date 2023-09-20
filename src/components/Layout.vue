<script lang="ts" setup>
import TestRunner from './.internal/TestRunner.vue'
</script>

<template>
  <transition name="fade" mode="out-in">
    <main :key="$route.meta.layout || 'default'" class="flex flex-col grow">
      <component :is="$route.meta.resolvedLayout"></component>
    </main>
  </transition>

  <ClientOnly>
    <TestRunner />
  </ClientOnly>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: 150ms ease-in-out opacity;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
