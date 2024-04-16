import { defineStore, acceptHMRUpdate } from 'pinia'

export const useArtGalleryStore = defineStore(
  'art-gallery',
  () => {
    async function fetchArt(artId: number) {
      console.log('🖼️ fetching art', artId)
      throw new Error('oops: ' + artId)
    }

    return { fetchArt }
  },
  {
    retry: {
      fetchArt: true,
    },
  },
)

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useArtGalleryStore, import.meta.hot))
}
