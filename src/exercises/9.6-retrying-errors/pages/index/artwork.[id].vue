<script lang="ts" setup>
import { watch } from 'vue'
import { useArtGalleryStore } from '../../stores/art-gallery'
import { useRoute } from 'vue-router/auto'

const route = useRoute('/9.6-retrying-errors//artwork.[id]')

const art = useArtGalleryStore()

watch(
  () => route.params.id,
  async id => {
    art.fetchArt(id)
  },
  { immediate: true },
)
</script>

<template>
  <template v-if="art.artwork && !art.isLoadingArtwork">
    <figure :title="art.artwork.title">
      <div class="img-loader item__content">
        <img v-if="art.artwork.image_url" class="full-res" :src="art.artwork.image_url" />
        <img
          v-if="art.artwork.thumbnail"
          class="img-frozen"
          :src="art.artwork.thumbnail.lqip"
          :alt="art.artwork.thumbnail.alt_text"
        />
      </div>
      <figcaption>
        <h2>{{ art.artwork.title }}</h2>
        <p>{{ art.artwork.artist_display }}</p>
        <p>{{ art.artwork.date_display }}</p>
      </figcaption>
    </figure>

    <div v-html="art.artwork.description"></div>

    <hr />

    <h3>Details</h3>
    <dl>
      <dt>Dimensions</dt>
      <dd>{{ art.artwork.dimensions }}</dd>
      <template v-if="art.artwork.color">
        <dt>Color</dt>
        <dd class="space-x-1 flex">
          <span
            class="rounded-full inline-block border w-6 h-6 ml-2"
            :style="{
              backgroundColor: `hsl(${art.artwork.color.h}, ${art.artwork.color.s}%, ${art.artwork.color.l}%)`,
            }"
          ></span>
          <code>hsl({{ art.artwork.color.h }},{{ art.artwork.color.s }},{{ art.artwork.color.l }})</code>
        </dd>
      </template>
    </dl>

    <hr />

    <h3>Terms</h3>
    <ul class="list-none flex flex-wrap p-0">
      <li
        v-for="term in art.artwork.term_titles"
        :key="term"
        class="rounded-full border px-2 dark:bg-slate-900 bg-slate-200 mr-1"
      >
        {{ term }}
      </li>
    </ul>
  </template>
  <p v-else>Loading...</p>
</template>
