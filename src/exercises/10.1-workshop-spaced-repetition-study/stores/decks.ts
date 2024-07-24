import { defineStore, acceptHMRUpdate } from 'pinia'
import {
  createCard,
  createDeck,
  DeckWithCards,
  deleteDeck,
  getDeckList,
  getDeckWithCards,
} from '../spaced-repetition/api'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router/auto'

export const useDecksStore = defineStore('10-srs-decks', () => {
  function create(name: string) {
    return createDeck(name)
  }

  function addCard(deckId: string, question: string, answer: string) {
    return createCard(deckId, question, answer)
  }

  const collection = ref<DeckWithCards[]>([])

  async function fetchList() {
    collection.value = await getDeckList()
  }

  const route = useRoute()
  const currentDeck = computed<DeckWithCards | null>(() => {
    if ('deckId' in route.params) {
      const { deckId } = route.params
      return collection.value.find(deck => deck.id === deckId) ?? null
    }
    return null
  })

  async function fetchDeck(id: string) {
    try {
      const deck = await getDeckWithCards(id)
      // add the deck to the collection or update it
      const index = collection.value.findIndex(d => d.id === id)
      if (index > -1) {
        collection.value.splice(index, 1, deck)
      } else {
        collection.value.push(deck)
      }
    } catch (err) {
      console.error(err)
    }
  }

  async function remove(id: string) {
    await deleteDeck(id)
    const index = collection.value.findIndex(d => d.id === id)
    if (index > -1) {
      collection.value.splice(index, 1)
    }
  }

  return {
    create,
    addCard,
    remove,
    fetchList,
    collection,

    currentDeck,
    fetchDeck,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDecksStore, import.meta.hot))
}
