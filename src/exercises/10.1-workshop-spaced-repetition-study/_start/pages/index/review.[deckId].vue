<script lang="ts" setup>
import SpacedRepetitionCard from '../../components/SpacedRepetitionCard.vue'
</script>

<template>
  <h1>Reviewing deck</h1>

  <!-- ClientOnly avoids hydration mismatches with local storage -->
  <ClientOnly>
    <!-- TODO: -->
    <!-- <SpacedRepetitionCard /> -->
  </ClientOnly>
</template>
