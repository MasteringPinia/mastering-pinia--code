<script lang="ts" setup>
import { useDecksStore } from '@ex/10.1-workshop-spaced-repetition-study/stores/decks'
import { onMounted, onServerPrefetch } from 'vue'

const decks = useDecksStore()
onServerPrefetch(decks.fetchList)
onMounted(decks.fetchList)
</script>

<template>
  <h2>My Decks</h2>

  <RouterLink :to="{ name: '/10.1-workshop-spaced-repetition-study//decks.new' }">
    <button>➕ New Deck</button>
  </RouterLink>

  <hr />

  <main>
    <ul v-for="deck in decks.collection">
      <li>
        <RouterLink
          :to="{ name: '/10.1-workshop-spaced-repetition-study//decks.[deckId]', params: { deckId: deck.id } }"
        >
          {{ deck.name }}
        </RouterLink>
        - {{ deck.cards.length }} cards
      </li>
    </ul>
  </main>
</template>
