<script setup lang="ts">
import Layout from './components/Layout.vue'
</script>

<template>
  <div class="flex flex-col min-h-screen px-2 py-4 md:py-6">
    <Layout />
  </div>
</template>

<style>
body {
  font-family: 'Nanum Gothic', var(--nc-font-sans);
}

.link {
  border-color: var(--nc-lk-1);
}
.link::before {
  content: '▷';
  display: inline-block;
  margin-right: 0.5em;
}

.router-link-active {
  cursor: initial;
  color: inherit;
  border-color: inherit;
  border-bottom-style: solid;
}
.router-link-active:hover {
  color: inherit;
}
.link.router-link-active::before {
  content: '▶︎';
}
</style>
