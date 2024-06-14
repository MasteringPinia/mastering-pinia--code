import { defineStore, acceptHMRUpdate } from 'pinia'
import { openDB, IDBPDatabase, DBSchema } from 'idb'
import { Card } from '../spaced-repetition'

interface Deck {
  id: string
  name: string
  creationDate: Date

  cards: Card[] | null
}

export interface SpacedRepetitionDB extends DBSchema {
  decks: {
    key: string
    value: Omit<Deck, 'cards'>
    indexes: {
      byName: string
      byCreationDate: Date
    }
  }

  cards: {
    key: string
    value: Card & { deckId: string }
    indexes: {
      byDeck: string
    }
  }
}

export const useDecksStore = defineStore('10-srs-decks', () => {
  let db: IDBPDatabase<SpacedRepetitionDB> | null = null

  let openDBPromise: Promise<IDBPDatabase<SpacedRepetitionDB>>

  if (typeof document !== 'undefined') {
    openDBPromise = openDB<SpacedRepetitionDB>('srs-decks', 2, {
      upgrade(database) {
        console.log('Creating decks idb store...')
        const decksStore = database.createObjectStore('decks', {
          keyPath: 'id',
        })
        console.log('Creating indexes...')
        decksStore.createIndex('byName', 'name', { unique: true })
        decksStore.createIndex('byCreationDate', 'creationDate')

        console.log('Creating cards idb store...')
        const cardsStore = database.createObjectStore('cards', {
          keyPath: 'id',
        })
        console.log('Creating indexes...')
        cardsStore.createIndex('byDeck', 'deckId')
        console.log('Done!')
      },
    })
  }

  async function ensureDB() {
    if (!db) {
      db = await openDBPromise
    }
    return db
  }

  async function getDecks() {
    const db = await ensureDB()
    const decks = (await db.getAll('decks')).map(
      (deck): Deck =>
        ({
          ...deck,
          cards: null,
        } satisfies Deck),
    )
    await Promise.all(
      decks.map(async deck => {
        const cards = await db.getAllFromIndex('cards', 'byDeck', deck.id)
        deck.cards = cards
      }),
    )
    console.log(decks)
  }

  return { ensureDB, getDecks }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDecksStore, import.meta.hot))
}
