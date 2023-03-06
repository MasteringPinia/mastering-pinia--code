<script lang="ts" setup>
import { ref } from 'vue'
import AppPaginator from './AppPaginator.vue'

const currentPage = ref(1)
const total = ref(34)
const perPage = ref(14)
</script>

<template>
  <h1>App Paginator</h1>

  <p>Current Page {{ currentPage }}</p>

  <div>
    <label> Total results <input v-model.number="total" type="range" min="0" max="1000" step="5" /> </label>
  </div>

  <div>
    <label> perPage <input v-model.number="perPage" type="range" min="1" max="100" step="1" /> </label>
  </div>

  <AppPaginator v-model:currentPage="currentPage" :total="total" :per-page="perPage" />
</template>
