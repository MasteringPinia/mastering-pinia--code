<script lang="ts" setup>
import type fuse from 'fuse.js'
import { computed } from 'vue'

const props = defineProps<{
  match: fuse.FuseResultMatch
}>()

const matchedText = computed<Array<{ text: string; highlight: boolean }>>(() => {
  let current = 0
  if (!props.match.value) return []
  const text = props.match.value
  const result = props.match.indices.reduce((res, [start, end]) => {
    if (start > current) {
      res.push({
        text: text.slice(current, start),
        highlight: false,
      })
    }
    res.push({
      text: text.slice(start, end + 1),
      highlight: true,
    })
    current = end + 1
    return res
  }, [] as Array<{ text: string; highlight: boolean }>)

  if (current < text.length) {
    result.push({
      text: text.slice(current),
      highlight: false,
    })
  }

  return result
})
</script>

<template>
  <template v-for="m in matchedText">
    <template v-if="m.highlight">
      <span class="bg-yellow-400 text-gray-950">{{ m.text }}</span>
    </template>
    <template v-else>{{ m.text }}</template>
  </template>
</template>

<style scoped>
.highlight {
}
</style>
