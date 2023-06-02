<script setup lang="ts">
import { useRouter } from 'vue-router/auto'
import { exerciseLinks } from '../router'

const router = useRouter()
function startTransition() {
  // @ts-expect-error: not yet in the TS types
  document.startViewTransition(async () => {
    await router.push('/_template')
  })
}
</script>

<template>
  <h2 class="mb-6" data-vt-name="title">Exercises:</h2>

  <figure>
    <img data-vt-name="figure" src="https://picsum.photos/200" />
    <figcaption>A random image</figcaption>
  </figure>
  <button @click="startTransition">Start Transition</button>

  <ul>
    <li v-for="link in exerciseLinks" :key="link.name">
      <RouterLink :to="link">{{ $router.resolve(link).path }}</RouterLink>
    </li>
  </ul>
</template>

<style>
::view-transition-old(root),
::view-transition-new(root) {
  /* animation-duration: 2s; */
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
}

@keyframes fade-out {
  to {
    opacity: 0;
  }
}

@keyframes slide-from-right {
  from {
    transform: translateX(30px);
  }
}

@keyframes slide-to-left {
  to {
    transform: translateX(-30px);
  }
}

::view-transition-old(root) {
  animation: 90ms cubic-bezier(0.4, 0, 1, 1) both fade-out, 300ms cubic-bezier(0.4, 0, 0.2, 1) both slide-to-left;
}

::view-transition-new(root) {
  animation: 210ms cubic-bezier(0, 0, 0.2, 1) 90ms both fade-in 300ms cubic-bezier(0.4, 0, 0.2, 1) both slide-from-right;
}

::view-transition-old(custom-figure),
::view-transition-new(custom-figure) {
  /* Prevent the default animation,
  so both views remain opacity:1 throughout the transition */
  animation: none;
  /* Use normal blending,
  so the new view sits on top and obscures the old view */
  mix-blend-mode: normal;
}
</style>
