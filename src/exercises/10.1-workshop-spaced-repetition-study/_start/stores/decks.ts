import { defineStore, acceptHMRUpdate } from 'pinia'
import { Card, createDeck, getDeckList, updateCard as _updateCard } from '../spaced-repetition/api'

export const useDecksStore = defineStore('10-srs-decks', () => {
  function create(name: string) {
    // ...
  }

  return {
    create,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDecksStore, import.meta.hot))
}
