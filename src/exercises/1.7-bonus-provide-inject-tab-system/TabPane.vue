<script setup lang="ts">
import { inject, onUnmounted, toRef } from 'vue'
import { registerTabKey } from './injectionKey'

const props = defineProps<{ title: string }>()

const registerTab = inject(registerTabKey)!

const { isVisible, unregister } = registerTab(toRef(props, 'title'))
onUnmounted(unregister)
</script>

<template>
  <slot v-if="isVisible" />
</template>
