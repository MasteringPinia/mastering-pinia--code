<script lang="ts" setup>
import SpacedRepetitionCard from '../../components/SpacedRepetitionCard.vue'
import { Grade, SpacedRepetitionDeck, createCard } from '../../spaced-repetition'
import { useDecksStore } from '../../stores/decks'
import { onMounted, shallowRef, ref, computed } from 'vue'

const sm = new SpacedRepetitionDeck(crypto.randomUUID())

const decks = useDecksStore()
onMounted(async () => {
  await decks.getDecks()
  const db = await decks.ensureDB()
  await db
    .put('decks', {
      id: crypto.randomUUID(),
      name: 'My test deck',
      creationDate: new Date(),
    })
    .catch(err => {
      console.error('cannot create the deck', err)
    })

  const deck = await db.getFromIndex('decks', 'byName', 'My test deck')
  if (!deck) {
    console.error('deck not found')
    return
  }

  await db
    .put('cards', {
      ...createCard('What is the capital of France?', 'Paris'),
      deckId: deck.id,
    })
    .catch(err => {
      console.error('cannot create the card', err)
    })
})

sm.addCard('What is the capital of France?', 'Paris')
sm.addCard('What is the capital of Spain?', 'Madrid')
sm.addCard('What is the capital of Germany?', 'Berlin')
sm.addCard('What is the capital of Italy?', 'Rome')
sm.addCard('What is the capital of the United Kingdom?', 'London')
sm.addCard('What is the capital of the United States?', 'Washington, D.C.')
sm.addCard('What is the capital of Canada?', 'Ottawa')
sm.addCard('What is the capital of Australia?', 'Canberra')
sm.addCard('What is the capital of Japan?', 'Tokyo')
sm.addCard('What is the capital of South Korea?', 'Seoul')
sm.addCard('What is the capital of China?', 'Beijing')
sm.addCard('What is the capital of Russia?', 'Moscow')
sm.addCard('What is the capital of Brazil?', 'Brasília')
sm.addCard('What is the capital of Argentina?', 'Buenos Aires')
sm.addCard('What is the capital of South Africa?', 'Pretoria')
sm.addCard('What is the capital of Nigeria?', 'Abuja')
sm.addCard('What is the capital of India?', 'New Delhi')
sm.addCard('What is the capital of Indonesia?', 'Jakarta')
sm.addCard('What is the capital of Mexico?', 'Mexico City')
sm.addCard('What is the capital of Egypt?', 'Cairo')
sm.addCard('What is the capital of Turkey?', 'Ankara')
sm.addCard('What is the capital of Saudi Arabia?', 'Riyadh')

const cards = shallowRef(sm.getDueCards())
const currentCardIndex = ref(0)
const currentCard = computed(() => cards.value[currentCardIndex.value])
function nextCard() {
  currentCardIndex.value++
  // get remaining cards
  if (currentCardIndex.value >= cards.value.length) {
    cards.value = sm.getDueCards()
    currentCardIndex.value = 0
  }
}
</script>

<template>
  <h1>Reviewing deck</h1>

  <SpacedRepetitionCard
    v-if="currentCard"
    :key="currentCard.id"
    :card="currentCard"
    @pass="nextCard()"
    @review="(grade: Grade) => sm.reviewCard(currentCard.id, grade)"
  />

  <template v-else>
    <p>You finished reviewing them.</p>
  </template>
</template>
