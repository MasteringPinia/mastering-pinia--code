<script lang="ts" setup>
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    currentPage: number
    perPage: number
    total: number
  }>(),
  { perPage: 10 },
)

const emit = defineEmits<{
  (event: 'update:currentPage', page: number): void
}>()
// const emit = defineEmits({
//   'update:currentPage': (page: number) => typeof page === 'number',
// })
const totalPages = computed(() => {
  return Math.ceil(props.total / props.perPage) || 1
})

function previousPage() {
  if (props.currentPage > 1) emit('update:currentPage', props.currentPage - 1)
}

function nextPage() {
  if (props.currentPage < totalPages.value) emit('update:currentPage', props.currentPage + 1)
}
</script>

<template>
  <div class="flex items-center justify-center">
    <button data-test="previous" class="button" :disabled="currentPage < 2" @click="previousPage">Previous</button>
    <span data-test="text" class="mx-3">{{ currentPage }} / {{ totalPages }}</span>
    <button data-test="next" :disabled="currentPage >= totalPages" @click="nextPage">Next</button>
  </div>
</template>
