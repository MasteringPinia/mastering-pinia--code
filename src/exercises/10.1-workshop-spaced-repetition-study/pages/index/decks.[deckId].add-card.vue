<script lang="ts" setup>
import { useMutation } from '../../composables/mutation'
import { useDecksStore } from '../../stores/decks'
import { onServerPrefetch, onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router/auto'
import ErrorDisplay from '../../components/ErrorDisplay.vue'

const router = useRouter()
const route = useRoute('/10.1-workshop-spaced-repetition-study//decks.[deckId].add-card')

const decks = useDecksStore()
onServerPrefetch(() => decks.fetchDeck(route.params.deckId))
onMounted(() => decks.fetchDeck(route.params.deckId))

const question = ref('')
const answer = ref('')

const { error, mutate, isLoading } = useMutation(
  () => decks.addCard(route.params.deckId, question.value, answer.value),
  {
    onSuccess() {
      router.push({
        name: '/10.1-workshop-spaced-repetition-study//decks.[deckId]',
        params: { deckId: route.params.deckId },
      })
    },
  },
)
</script>

<template>
  <p v-if="!decks.currentDeck">Loading...</p>

  <template v-else>
    <h2>Adding a card to deck "{{ decks.currentDeck.name }}"</h2>

    <p>This deck currently has {{ decks.currentDeck.cards.length }} cards.</p>

    <ErrorDisplay v-if="error" :error="error" />

    <form @submit.prevent="mutate()">
      <fieldset class="flex-col flex" :disabled="isLoading">
        <label for="question">Question:</label>
        <input id="question" v-model="question" required autocomplete="off" type="text" />

        <label for="answer">Answer:</label>
        <input id="answer" v-model="answer" required autocomplete="off" type="text" />
      </fieldset>

      <button :disabled="isLoading">Add card</button>
    </form>

    <hr />

    <h3>Existing cards</h3>

    <ul>
      <li v-for="card in decks.currentDeck.cards">
        {{ card.question }}:
        <strong>{{ card.answer }}</strong>
      </li>
    </ul>
  </template>
</template>
