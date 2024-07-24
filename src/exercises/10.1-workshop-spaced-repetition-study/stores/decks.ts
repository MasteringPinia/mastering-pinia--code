import { defineStore, acceptHMRUpdate } from 'pinia'
import { createDeck } from '../spaced-repetition/api'

export const useDecksStore = defineStore('10-srs-decks', () => {
  function create(name: string) {
    return createDeck(name)
  }

  return { create }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDecksStore, import.meta.hot))
}
