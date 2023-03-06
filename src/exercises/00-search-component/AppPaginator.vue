<script lang="ts">
import { computed, defineComponent } from 'vue'

export default defineComponent({
  model: {
    prop: 'currentPage',
    event: 'update:currentPage',
  },

  props: {
    currentPage: {
      type: Number,
      required: true,
    },
    perPage: {
      type: Number,
      default: 10,
    },
    total: {
      type: Number,
      required: true,
    },
  },

  emits: {
    'update:currentPage': (page: number) => typeof page === 'number',
  },

  // a ne pas faire
  // setup({ total }, { emit }) {
  setup(props, { emit }) {
    const totalPages = computed(() => {
      return Math.ceil(props.total / props.perPage) || 1
    })

    function previousPage() {
      if (props.currentPage > 1) emit('update:currentPage', props.currentPage - 1)
    }

    function nextPage() {
      if (props.currentPage < totalPages.value) emit('update:currentPage', props.currentPage + 1)
    }

    return { nextPage, previousPage, totalPages }
  },
})
</script>

<template>
  <div class="flex items-center justify-center">
    <button data-test="previous" class="button" :disabled="currentPage < 2" @click="previousPage">Previous</button>
    <span data-test="text" class="mx-3">{{ currentPage }} / {{ totalPages }}</span>
    <button data-test="next" :disabled="currentPage >= totalPages" @click="nextPage">Next</button>
  </div>
</template>
