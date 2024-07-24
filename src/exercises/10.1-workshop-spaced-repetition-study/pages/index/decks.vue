<script lang="ts" setup>
import { useDeckReviewStore } from '../../stores/deck-review'
import { useDecksStore } from '../../stores/decks'
import { onMounted, onServerPrefetch } from 'vue'

const decks = useDecksStore()
const deckReviews = useDeckReviewStore()
onServerPrefetch(decks.fetchList)
onMounted(decks.fetchList)
</script>

<template>
  <section v-if="deckReviews.ongoingReviews.length">
    <p>You have {{ deckReviews.ongoingReviews.length }} started reviews.</p>

    <ul>
      <li v-for="review in deckReviews.ongoingReviews">
        ({{ Math.round(100 - (review.cards.length / review.total) * 100).toFixed(0) }}%)
        <RouterLink
          :to="{ name: '/10.1-workshop-spaced-repetition-study//review.[deckId]', params: { deckId: review.deckId } }"
        >
          Review "{{ review.deckName }}"
        </RouterLink>
        -
        <a href="#" role="button" @click="deckReviews.abortSession(review.id)">Drop session</a>
      </li>
    </ul>
  </section>

  <main>
    <h2>My Decks</h2>

    <RouterLink :to="{ name: '/10.1-workshop-spaced-repetition-study//decks.new' }">
      <button>➕ New Deck</button>
    </RouterLink>

    <hr />

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
