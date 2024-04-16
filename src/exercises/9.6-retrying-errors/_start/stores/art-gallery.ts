import { Artwork, PaginationParams, getArtwork, searchArtworks } from '@/api/aic'
import { defineStore, acceptHMRUpdate } from 'pinia'
import { computed, ref, shallowReactive, shallowRef } from 'vue'

export const useArtGalleryStore = defineStore(
  'art-gallery',
  () => {
    const successRate = ref(0.85)
    const searchResults = shallowRef<Awaited<ReturnType<typeof searchArtworks>>>()

    async function searchArt(query: string, { page = 1, limit = 15 }: PaginationParams = {}) {
      if (!import.meta.env.SSR && Math.random() > successRate.value) {
        throw new Error('Failed to search artwork')
      }
      searchResults.value = await searchArtworks(query, {
        page,
        limit,
      })
    }

    const artworkCache = shallowReactive(new Map<number, Artwork>())
    const artworkId = shallowRef<number>()
    const artwork = computed(() => artworkId.value && artworkCache.get(artworkId.value))
    const isLoadingArtwork = ref(false)
    async function fetchArt(artId: number | string) {
      if (!import.meta.env.SSR && Math.random() > successRate.value) {
        throw new Error('Failed to search artwork')
      }
      if (!artworkCache.has(Number(artId))) {
        isLoadingArtwork.value = true
        artworkCache.set(Number(artId), await getArtwork(artId))
        artworkId.value = Number(artId)
        isLoadingArtwork.value = false
      }
    }

    return {
      artworkId,
      artworkCache,
      artwork,
      fetchArt,
      isLoadingArtwork,

      searchArt,
      searchResults,

      successRate,
    }
  },
  {
    retry: {
      fetchArt: true,
      searchArt: true,
    },
  },
)

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useArtGalleryStore, import.meta.hot))
}
