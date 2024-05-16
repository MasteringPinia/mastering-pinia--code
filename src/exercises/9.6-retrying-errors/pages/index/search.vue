<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useArtGalleryStore } from '../../stores/art-gallery'
import AppPagination from '@/components/AppPagination.vue'

const currentPage = useRouteQuery('page', {
  format: v => {
    const n = Number(v)
    return Number.isFinite(n) && n > 0 ? n : 1
  },
})
const searchQuery = useRouteQuery('q', {
  format: v => {
    return typeof v === 'string' ? v : ''
  },
})
const searchText = ref<string>(searchQuery.value || '')

const art = useArtGalleryStore()

function submitSearch() {
  searchQuery.value = searchText.value
  currentPage.value = 1
}

watch(
  [searchQuery, currentPage],
  ([query, page]) => {
    art.searchArt(query, { page, limit: 20 })
  },
  { immediate: !import.meta.env.SSR },
)
</script>

<template>
  <form class="space-x-2" @submit.prevent="submitSearch()">
    <input v-model="searchText" type="text" />
    <button>Search</button>
  </form>

  <section v-if="art.searchResults">
    <AppPagination
      v-model:current-page="currentPage"
      :total="art.searchResults.pagination.total"
      :per-page="art.searchResults.pagination.limit"
    />

    <hr />

    <div class="masonry">
      <RouterLink
        v-for="artwork in art.searchResults.data"
        :id="`${artwork.title}_${artwork.id}`"
        :key="artwork.id"
        :to="{ name: '/9.6-retrying-errors//artwork.[id]', params: { id: artwork.id } }"
        class="item"
      >
        <figure :title="artwork.title">
          <div v-if="artwork.thumbnail" class="img-loader item__content">
            <img v-if="artwork.image_url" class="full-res" :src="artwork.image_url" />
            <img class="img-frozen" :src="artwork.thumbnail.lqip" :alt="artwork.thumbnail.alt_text" />
          </div>
          <figcaption>
            <a :href="`#${artwork.title}_${artwork.id}`">
              {{ artwork.title }}
            </a>
          </figcaption>
        </figure>
      </RouterLink>
    </div>

    <hr />

    <AppPagination
      v-model:current-page="currentPage"
      :total="art.searchResults.pagination.total"
      :per-page="art.searchResults.pagination.limit"
    />
  </section>
  <section v-else>Loading...</section>
</template>
