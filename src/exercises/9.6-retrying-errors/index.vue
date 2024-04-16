<script lang="ts" setup>
import { useArtGalleryStore } from './stores/art-gallery';

const artGallery = useArtGalleryStore()

</script>

<template>
  <h1>Template to start an exercise</h1>

  <button @click="artGallery.fetchArt(Math.round(10 * Math.random())).catch(() => {})">Fetch Art</button>
</template>
