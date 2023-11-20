<script lang="ts" setup>
import { Meme, getMemes, captionImage } from '@/api/memes'
import { ref, shallowRef } from 'vue'
import { useFuse } from '@vueuse/integrations/useFuse'
import FuseTextMatch from '@/components/.internal/FuseTextMatch.vue'

const selectedMeme = shallowRef<Meme | null>(null)
const texts = ref<string[]>([])

const { data: memes } = useQuery({
  fetcher: getMemes,
  initialValue: () => [],
})
const searchText = ref('')
const { results } = useFuse(searchText, memes, {
  fuseOptions: {
    includeMatches: true,
    keys: ['name'],
  },
  matchAllWhenSearchEmpty: true,
})

async function generateMeme() {
  if (!selectedMeme.value) return

  const meme = await captionImage({
    texts: texts.value,
    id: selectedMeme.value.id,
  })

  console.log(meme)
}
</script>

<template>
  <p>Hello</p>

  <section v-if="selectedMeme">
    <p>Selected Meme: "{{ selectedMeme.name }}"</p>
    <img style="width: 100px" :src="selectedMeme.url" :alt="selectedMeme.name" />

    <ol>
      <li v-for="i in selectedMeme.box_count">
        <label>
          Text {{ i }}
          <input v-model="texts[i - 1]" type="text" />
        </label>
      </li>
    </ol>

    <button @click="generateMeme">Generate</button>
  </section>

  <p v-else>Select a meme to create your own</p>

  <div>
    <label>
      Search:
      <input v-model="searchText" type="text" />
    </label>
  </div>

  <section class="masonry">
    <figure
      v-for="{ item: meme, matches } in results"
      :id="`${meme.name}_${meme.id}`"
      :key="meme.id"
      class="item"
      :title="meme.name"
      @click="selectedMeme = meme"
    >
      <img class="item__content" :src="meme.url" :alt="meme.name" />
      <figcaption>
        <a :href="`#${meme.name}_${meme.id}`">
          <FuseTextMatch v-if="matches?.[0]" :match="matches[0]"></FuseTextMatch>
          <template v-else>{{ meme.name }}</template>
        </a>
      </figcaption>
    </figure>
  </section>
</template>

<style scoped>
.masonry img {
  max-width: 100%;
  display: block;
  margin-bottom: 0;
}

figure {
  margin: 0;
  display: grid;
  grid-template-rows: 1fr auto;
  margin-bottom: 10px;
  break-inside: avoid;
}

figure > img {
  grid-row: 1 / -1;
  grid-column: 1;
}

figure a {
  color: black;
  text-decoration: none;
}

figcaption {
  grid-row: 2;
  grid-column: 1;
  background-color: rgba(255, 255, 255, 0.5);
  padding: 0.2em 0.5em;
  justify-self: start;
}

.masonry {
  column-count: 4;
  column-gap: 10px;
}

@media screen and (max-width: 1024px) {
  .masonry {
    column-count: 3;
  }
}

@media screen and (max-width: 500px) {
  .masonry {
    column-count: 2;
  }
}
</style>
