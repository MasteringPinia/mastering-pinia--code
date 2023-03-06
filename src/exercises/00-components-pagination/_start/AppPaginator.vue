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
    return {}
  },
})
</script>

<template>
  <div class="flex items-center justify-center">
    <button data-test="previous" class="button">Previous</button>
    <span data-test="text" class="mx-3">0 / 35</span>
    <button data-test="next">Next</button>
  </div>
</template>
