<script setup lang="ts">
import { computed, inject, toValue } from 'vue'
import type { TransitionProps } from 'vue'
import { useRoute, viewDepthKey } from 'vue-router/auto'
import AppFooter from '@/components/.internal/AppFooter.vue'
import AppHeader from '@/components/.internal/AppHeader.vue'

const route = useRoute()

const transitionProps = computed<TransitionProps | undefined>(() => {
  const { transition } = route.meta
  if (!transition) return { name: 'fade-down', mode: 'default' }
  return typeof transition === 'string' ? { name: transition } : transition
})

const depth = inject(viewDepthKey, 0)
</script>

<template>
  <AppHeader />

  <div class="relative grow">
    <RouterView v-slot="{ Component, route: resolvedRoute }">
      <Transition v-bind="transitionProps">
        <div :key="resolvedRoute.matched[toValue(depth)].path || resolvedRoute.path" class="grow">
          <component :is="Component" />
        </div>
      </Transition>
    </RouterView>
  </div>

  <hr />

  <AppFooter />
</template>

<style>
:root {
  --transition-duration: 200ms;
  /* easier debugging */
  /* --animate-duration: 200000ms; */
}
</style>

<style scoped>
.fade-right-enter-active,
.fade-right-leave-active,
.fade-left-enter-active,
.fade-left-leave-active,
.fade-down-enter-active,
.fade-down-leave-active {
  transition: var(--transition-duration) ease-out opacity, var(--transition-duration) ease-out transform;
}

.fade-down-leave-active {
  position: absolute;
  width: 100%;
  left: 0;
  right: 0;
}

.fade-down-enter-from,
.fade-down-leave-to {
  transform: translateY(100px);
  opacity: 0;
}

.fade-left-enter-from {
  transform: translate(50%, -100%);
}
.fade-left-leave-to {
  transform: translateX(-50%);
}
.fade-right-enter-from {
  transform: translate(-50%, -100%);
}
.fade-right-leave-to {
  transform: translateX(50%);
}

.fade-right-enter-to,
.fade-left-enter-to {
  transform: translateY(-100%);
}

.fade-left-enter-from,
.fade-left-leave-to,
.fade-right-enter-from,
.fade-right-leave-to {
  opacity: 0;
}
</style>
