<template>
  <div>
    <section class="px-2 my-10">
      <article v-if="error" class="max-w-xl m-auto my-4 text-black bg-red-200 border border-red-500 rounded">
        <p class="px-2 mx-6 my-2">
          An error ocurred. Please, try again later.
          <br />
          Error:
          {{ error.message }}
        </p>
      </article>

      <form class="w-full max-w-xl mx-auto mb-4" @submit.prevent="triggerSearch">
        <div class="flex items-center py-2 border-b-2">
          <input
            v-model="localSearchText"
            required
            class="w-full px-2 py-1 mr-3 leading-tight bg-transparent border-none appearance-none focus:outline-none"
            type="text"
            placeholder="John Smith"
            aria-label="Search terms"
          />
          <button class="flex-shrink-0" :disabled="isPending && isDelayElapsed">Search</button>
        </div>
      </form>
      <AppPaginator
        v-if="searchResults"
        v-model:currentPage="currentPage"
        :total="searchResults.total"
        :per-page="12"
      />
    </section>

    <p v-if="isPending && isDelayElapsed">Searching...</p>
    <slot v-else-if="searchResults" :search-text="searchText" :results="searchResults.results"></slot>
    <p v-if="!isPending && searchResults && !searchResults.results.length" class="text-xl text-center text-gray-400">
      No results found for "{{ searchText }}"
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType, ref, watch } from 'vue'
import { useQueryParam } from './useQueryParam'
import AppPaginator from './AppPaginator.vue'

export default defineComponent({
  components: { AppPaginator },
  props: {
    apiMethod: {
      type: Function as PropType<(searchText: string, page: number) => Promise<{ total: number; results: unknown[] }>>,
      required: true,
    },
  },

  setup(props) {
    const currentPage = useQueryParam<number>('page', {
      parseValue: value => Number(value) || 1,
      deleteIf: value => value === 1,
    })

    // value watched for search
    const searchText = useQueryParam('searchText')

    // current value on input
    const localSearchText = ref(searchText.value)

    const searchResults = ref<null | { total: number; results: unknown[] }>(null)
    const error = ref<Error | null>(null)
    const isPending = ref(false)
    const isDelayElapsed = ref(false)

    function triggerSearch() {
      searchText.value = localSearchText.value
      currentPage.value = 1
    }

    onMounted(() => {
      let delayTimeout: ReturnType<typeof setTimeout>

      watch(
        // () => `${currentPage.value} ${searchText.value}`,
        // () => user.value.firstName,
        // user,
        [currentPage, searchText],
        ([currentPage, searchText]) => {
          // avoid api error with empty search
          if (!searchText) return

          // reflect changes to the local input
          localSearchText.value = searchText
          error.value = null
          isPending.value = true
          isDelayElapsed.value = false
          clearTimeout(delayTimeout)

          props
            .apiMethod(searchText, currentPage)
            .then((results: any) => {
              searchResults.value = results
            })
            .catch((err: Error) => {
              console.error('error while fetching', err)
              error.value = err
            })
            .finally(() => {
              isPending.value = false
            })

          delayTimeout = setTimeout(() => {
            isDelayElapsed.value = true
          }, 200)
        },
        { immediate: true },
      )
    })

    return {
      error,
      triggerSearch,
      isPending,
      searchText,
      localSearchText,
      searchResults,
      isDelayElapsed,
      currentPage,
    }
  },
})
</script>
