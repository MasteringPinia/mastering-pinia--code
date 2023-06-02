<script lang="ts" setup>
import { useRouter } from 'vue-router/auto'

// add variables here
const router = useRouter()
function leave() {
  // @ts-expect-error: not yet in the TS types
  document.startViewTransition(async () => {
    await router.push('/')
  })
}
</script>

<template>
  <h1 data-vt-="title">Template to start an exercise</h1>

  <hr />

  <figure>
    <img data-vt-name="figure" src="https://picsum.photos/500" />
    <figcaption>A random image</figcaption>
  </figure>
  <button @click="leave">Leave</button>
</template>
