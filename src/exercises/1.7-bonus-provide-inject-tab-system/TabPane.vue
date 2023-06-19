<script setup lang="ts">
import { inject, toRef } from 'vue'
import { useTabKey } from './injectionKey'

const props = defineProps<{ title: string }>()

const useTab = inject(useTabKey)!
const { isVisible } = useTab(toRef(props, 'title'))
</script>

<template>
  <slot v-if="isVisible" />
</template>
