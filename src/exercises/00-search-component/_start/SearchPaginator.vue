<template>
  <div>
    <section class="px-2 my-10">
      <article class="max-w-xl m-auto my-4 text-black bg-red-200 border border-red-500 rounded">
        <p class="px-2 mx-6 my-2">
          An error ocurred. Please, try again later.
          <!-- We could maybe display the error here. Also only display when there is actually one -->
        </p>
      </article>

      <form class="w-full max-w-xl mx-auto mb-4">
        <div class="flex items-center py-2 border-b-2">
          <input
            required
            class="w-full px-2 py-1 mr-3 leading-tight bg-transparent border-none appearance-none focus:outline-none"
            type="text"
            placeholder="John Smith"
            aria-label="Search terms"
          />
          <!-- Should we disable this button sometimes? -->
          <button class="flex-shrink-0">Search</button>
        </div>
      </form>

      <!-- Should we hide the pagination in any case? -->
      <AppPaginator v-model:currentPage="currentPage" :total="total" />
    </section>

    <slot>Results should go here</slot>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
// import { useQueryParam } from './useQueryParam'
import AppPaginator from './AppPaginator.vue'

export default defineComponent({
  components: { AppPaginator },
  props: {
    // ...
  },

  setup(props) {
    const currentPage = ref(1)

    // ...

    return {
      currentPage,
    }
  },
})
</script>
