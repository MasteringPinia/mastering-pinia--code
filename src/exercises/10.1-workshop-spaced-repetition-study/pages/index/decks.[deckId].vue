<script lang="ts" setup>
import { useDeckReviewStore } from '../../stores/deck-review'
import { useDecksStore } from '../../stores/decks'
import { onMounted, onServerPrefetch } from 'vue'
import { useRouter, useRoute } from 'vue-router/auto'

const decks = useDecksStore()
const route = useRoute('/10.1-workshop-spaced-repetition-study//decks.[deckId]')
onServerPrefetch(() => decks.fetchDeck(route.params.deckId))
onMounted(() => decks.fetchDeck(route.params.deckId))

const deckReview = useDeckReviewStore()
const router = useRouter()
async function deleteDeck() {
  if (!confirm('Are you sure?')) return
  await decks.remove(route.params.deckId)
  // go back to the list of decks
  router.replace({ name: '/10.1-workshop-spaced-repetition-study//decks' })
}
</script>

<template>
  <p v-if="!decks.currentDeck">Loading...</p>

  <template v-else>
    <h2>{{ decks.currentDeck.name }}</h2>

    <p>
      Created on {{ decks.currentDeck.createdAt }}.
      <br />
      Has {{ decks.currentDeck.cards.length }} cards.
    </p>

    <div class="space-x-2">
      <RouterLink
        :to="{
          name: '/10.1-workshop-spaced-repetition-study//decks.[deckId].add-card',
          params: { deckId: route.params.deckId },
        }"
      >
        <button>➕ Add Card</button>
      </RouterLink>

      <RouterLink
        :to="{
          name: '/10.1-workshop-spaced-repetition-study//review.[deckId]',
          params: { deckId: route.params.deckId },
        }"
      >
        <button :disabled="deckReview.canReview(decks.currentDeck) !== 'yes'">
          Start review ({{ deckReview.getReviewCards(decks.currentDeck).length }})
        </button>
      </RouterLink>

      <button @click="deleteDeck()">❌ Delete</button>
    </div>

    <hr />

    <details>
      <summary>List of cards</summary>
      <ul>
        <li v-for="card in decks.currentDeck.cards">
          <strong>{{ card.question }} - {{ card.answer }}</strong>
          | 📅
          <time :datetime="new Date(card.dueDate).toISOString()">{{
            new Date(card.dueDate).toLocaleString('FR-fr')
          }}</time>
          | 📚 <strong>{{ card.repetitions }}</strong> times | ease factor:
          <code>{{ card.ease }}</code>
          <RouterLink
            :to="{
              name: '/10.1-workshop-spaced-repetition-study//cards.[cardId].edit',
              params: { cardId: card.id },
            }"
            >Edit</RouterLink
          >
        </li>
      </ul>
    </details>
  </template>
</template>
