<script lang="ts" setup>
import { useMutation } from '@ex/10.1-workshop-spaced-repetition-study/composables/mutation'
import { useDecksStore } from '@ex/10.1-workshop-spaced-repetition-study/stores/decks'
import { onServerPrefetch, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router/auto'
import ErrorDisplay from '@ex/10.1-workshop-spaced-repetition-study/components/ErrorDisplay.vue'

const router = useRouter()
const route = useRoute('/10.1-workshop-spaced-repetition-study//cards.[cardId].edit')

const decks = useDecksStore()
onServerPrefetch(() => decks.fetchCard(route.params.cardId))
onMounted(() => decks.fetchCard(route.params.cardId))

const { error, mutate, isLoading } = useMutation(() => decks.updateCardEdit(), {
  onSuccess() {
    if (!decks.editingCard) {
      router.push('/10/1-workshop-spaced-repetition-study/decks')
    } else {
      router.push({
        name: '/10.1-workshop-spaced-repetition-study//decks.[deckId]',
        params: { deckId: decks.editingCard!.deckId },
      })
    }
  },
})

const dueDate = computed({
  get() {
    if (!decks.editingCard) return ''
    return new Date(decks.editingCard.dueDate).toISOString().slice(0, 10)
  },
  set(value: string) {
    if (decks.editingCard) {
      const date = new Date(value)
      if (Number.isNaN(date.getTime())) return
      decks.editingCard.dueDate = date.getTime()
    }
  },
})
</script>

<template>
  <p v-if="!decks.editingCard">Loading...</p>

  <template v-else>
    <h2>Editing card</h2>

    <ErrorDisplay v-if="error" :error="error" />

    <form @submit.prevent="mutate()">
      <fieldset class="flex-col flex" :disabled="isLoading">
        <label for="question">Question: </label>
        <input id="question" v-model="decks.editingCard.question" required autocomplete="off" type="text" />

        <label for="answer">Answer: </label>
        <input id="answer" v-model="decks.editingCard.answer" required autocomplete="off" type="text" />

        <label for="ease">Ease ratio: </label>
        <input
          id="ease"
          v-model.number="decks.editingCard.ease"
          type="number"
          min="1.1"
          step="0.05"
          max="5"
          required
          autocomplete="off"
        />

        <label for="interval">Interval (ms): {{ decks.editingCard.interval }}</label>
        <input
          id="interval"
          v-model.number="decks.editingCard.interval"
          min="0"
          step="1000"
          :max="500_000_000"
          type="range"
          required
          autocomplete="off"
        />

        <label for="due-date">Due date: </label>
        <input id="due-date" v-model="dueDate" type="date" required autocomplete="off" />
      </fieldset>

      <button :disabled="isLoading">Update Card</button>
    </form>
  </template>
</template>
