<script lang="ts" setup>
import { useDecksStore } from '../../stores/decks'
import { ref } from 'vue'
import ErrorDisplay from '../../components/ErrorDisplay.vue'
import { useRouter } from 'vue-router/auto'
import { useMutation } from '../../composables/mutation'

const decks = useDecksStore()
const name = ref('')
const router = useRouter()

const { error, mutate, isLoading } = useMutation(() => decks.create(name.value), {
  onSuccess(data) {
    router.push({
      name: '/10.1-workshop-spaced-repetition-study//decks.[deckId]',
      params: { deckId: data.id },
    })
  },
})
</script>

<template>
  <h2>Create a new Deck</h2>

  <ErrorDisplay v-if="error" :error="error" />

  <form @submit.prevent="mutate()">
    <fieldset class="flex-col flex" :disabled="isLoading">
      <label for="name">Name:</label>
      <input v-model="name" autocomplete="off" type="text" />
    </fieldset>

    <button :disabled="isLoading">Create Deck</button>
  </form>
</template>
