<script lang="ts" setup>
import { useRouter, useRoute } from 'vue-router/auto'
import SpacedRepetitionCard from '../../components/SpacedRepetitionCard.vue'
import { Grade } from '../../spaced-repetition'
import { useDecksStore } from '../../stores/decks'
import { onMounted, shallowRef, onServerPrefetch, watch } from 'vue'
import { ReviewSession, useDeckReviewStore } from '@ex/10.1-workshop-spaced-repetition-study/stores/deck-review'

const router = useRouter()
const route = useRoute('/10.1-workshop-spaced-repetition-study//review.[deckId]')

const decks = useDecksStore()
const deckReviews = useDeckReviewStore()
onServerPrefetch(() => decks.fetchDeck(route.params.deckId))
onMounted(() => decks.fetchDeck(route.params.deckId))

const reviewQueue = shallowRef<ReviewSession>()

watch(
  () => decks.currentDeck,
  deck => {
    if (deck) {
      // avoid reviewing a deck that cannot be reviewed (deleted, finished, no due cards, etc)
      if (deckReviews.canReview(deck) !== 'yes') {
        router.replace({ name: '/10.1-workshop-spaced-repetition-study//decks' })
        return
      }

      reviewQueue.value = deckReviews.start(deck)
    }
  },
  { immediate: true },
)

// TODO: confetti
</script>

<template>
  <h1>Reviewing deck</h1>

  <ClientOnly>
    <p>You have {{ reviewQueue?.cards.length }} cards to review.</p>

    <SpacedRepetitionCard
      v-if="reviewQueue?.cards[0]"
      :key="reviewQueue.id + ' ' + reviewQueue.reviewCount"
      :card="reviewQueue.cards[0]"
      @review="(grade: Grade) => deckReviews.reviewCard(reviewQueue!.deckId, reviewQueue!.cards[0].id, grade)"
    />

    <template v-else>
      <p>🎉 You finished reviewing them!</p>
      <RouterLink :to="{ name: '/10.1-workshop-spaced-repetition-study//decks' }"> Go back to your decks </RouterLink>
    </template>
  </ClientOnly>
</template>
