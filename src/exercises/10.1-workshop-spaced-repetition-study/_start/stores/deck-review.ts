import { defineStore, acceptHMRUpdate } from 'pinia'
import { Card, CardSchema, DeckWithCards } from '../spaced-repetition/api'
import { useLocalStorage } from '@vueuse/core'
import { z } from 'zod'
import { Grade, GRADE_MAX } from '../spaced-repetition'

export const ReviewSessionSchema = z.object({
  id: z.string().uuid(),

  /**
   * When the review session was created.
   */
  createdAt: z.number(),

  /**
   * The id of deck being reviewed.
   */
  deckId: z.string().uuid(),

  /**
   * Deck name.
   */
  deckName: z.string(),

  /**
   * The cards left to review in this session.
   */
  cards: z.array(CardSchema),

  /**
   * Total number of cards in the review session.
   */
  total: z.number(),

  /**
   * Total number of reviews done (can be larger than the number of cards in the deck)
   */
  reviewCount: z.number(),
})
export type ReviewSession = z.infer<typeof ReviewSessionSchema>
export const ReviewSessionListSchema = z.array(ReviewSessionSchema)

export const useDeckReviewStore = defineStore('10-srs-deck-review', () => {
  const ongoingReviews = useLocalStorage<ReviewSession[]>('ongoingReviews', [], {
    serializer: {
      read: value => {
        try {
          return ReviewSessionListSchema.parse(JSON.parse(value)) || []
        } catch (error) {
          console.error(error)
        }
        return []
      },
      write: value => JSON.stringify(value),
    },
    initOnMounted: true,
  })

  function start(deck: DeckWithCards, now: number = Date.now()) {
    // ...
  }

  return {
    start,
    ongoingReviews,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDeckReviewStore, import.meta.hot))
}

function shuffle<T>(array: T[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

function gradeCard(originalCard: Card, grade: Grade) {
  const card = { ...originalCard }

  if (grade >= Grade.Good) {
    // correct answer
    if (card.repetitions === 0) {
      card.interval = 1 * 1000 * 60 * 60 * 24 // 1 day
    } else if (card.repetitions === 1) {
      // card has been correctly reviewed twice in a row
      card.interval = 4 * 1000 * 60 * 60 * 24 // 4 days
    } else {
      // subsequent correct reviews reviews
      card.interval *= card.ease
    }
    card.repetitions += 1
  } else {
    // incorrect answer
    // make them due again until they get it right
    card.interval = 0
    card.repetitions = 0
  }

  // Update ease factor
  card.ease += 0.1 - (GRADE_MAX - grade) * (0.08 + (GRADE_MAX - grade) * 0.02)
  card.ease = Math.max(card.ease, 1.1)

  // Set next due date
  const now = Date.now()
  card.dueDate = now + card.interval

  return card
}
