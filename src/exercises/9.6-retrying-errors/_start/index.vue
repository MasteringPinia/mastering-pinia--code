<script lang="ts" setup>
import { onMounted } from 'vue'
import { onBeforeRouteUpdate } from 'vue-router'
import { useRouter, useRoute } from 'vue-router/auto'
import { useArtGalleryStore } from './stores/art-gallery'

const route = useRoute()
const router = useRouter()
// avoid the index page
onMounted(() => {
  if (route.name === '/9.6-retrying-errors/') {
    router.replace('/9/6-retrying-errors/search')
  }
})
onBeforeRouteUpdate(to => {
  if (to.name === '/9.6-retrying-errors/') {
    return {
      name: '/9.6-retrying-errors//search',
    }
  }
})

const art = useArtGalleryStore()
</script>

<template>
  <h1>Art Gallery</h1>

  <p>Artwork API by <a href="https://api.artic.edu/docs/#quick-start">Art Institute of Chicago</a>.</p>

  <div>
    <label class="flex space-x-2">
      <span>Success Rate</span>
      <input v-model.number="art.successRate" type="range" min="0" max="1" step="0.05" />
      <span>{{ (art.successRate * 100).toFixed(0) }}%</span>
    </label>
  <p class="text-xs">Lower this to make requests fail.</p>
  </div>


  <hr />

  <RouterView />
</template>
