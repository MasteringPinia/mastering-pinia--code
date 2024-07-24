import { defineStore, acceptHMRUpdate } from 'pinia'
import { Card, CardSchema, DeckWithCards, updateCard } from '../spaced-repetition/api'
import { useLocalStorage } from '@vueuse/core'
import { z } from 'zod'
import { Grade, GRADE_MAX } from '../spaced-repetition'
import { watch } from 'vue'

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

  // strip off empty reviews
  watch(
    ongoingReviews,
    reviews => {
      for (let i = 0; i < reviews.length; i++) {
        const review = reviews[i]
        if (review.cards.length === 0) {
          reviews.splice(i, 1)
        }
      }
    },
    { deep: true },
  )

  /**
   * Checks if a deck can be reviewed. If it can't, it returns a string with the reason. Otherwise it returns 'yes'
   *
   * @param deck - The deck to review
   * @param now - The current time
   * @returns
   */
  function canReview(deck: DeckWithCards, now: number = Date.now()): string | 'yes' {
    if (deck.cards.length === 0) {
      return `Deck ${deck.id} is empty`
    }

    const dueCards = deck.cards.filter(card => card.dueDate <= now)
    if (dueCards.length === 0) {
      return `No cards due for deck ${deck.id}`
    }

    return 'yes'
  }

  function getReviewCards(deck: DeckWithCards, now: number = Date.now()): Card[] {
    const cards: Card[] = []

    for (const card of deck.cards) {
      if (card.dueDate <= now) {
        cards.push(card)
      }
    }

    return shuffle(cards)
  }

  function start(deck: DeckWithCards, now: number = Date.now()) {
    const canReviewResult = canReview(deck, now)
    if (canReviewResult !== 'yes') {
      throw new Error(canReviewResult)
    }

    // reuse an ongoing review if it exists
    const startedReview = ongoingReviews.value.find(review => review.deckId === deck.id)
    if (startedReview) {
      return startedReview
    }

    const cards = getReviewCards(deck, now)
    const review: ReviewSession = {
      id: crypto.randomUUID(),
      createdAt: now,
      deckId: deck.id,
      deckName: deck.name,
      cards,
      reviewCount: 0,
      total: cards.length,
    }

    ongoingReviews.value.push(review)

    return review
  }

  function abortSession(sessionId: string) {
    const index = ongoingReviews.value.findIndex(review => review.id === sessionId)
    if (index >= 0) {
      ongoingReviews.value.splice(index, 1)
    }
  }

  function reviewCard(deckId: string, cardId: string, grade: Grade) {
    const review = ongoingReviews.value.find(review => review.deckId === deckId)
    if (!review) {
      throw new Error(`Review for deck ${deckId} not found`)
    }

    const cardIndex = review.cards.findIndex(card => card.id === cardId)
    if (cardIndex < 0) {
      throw new Error(`Card ${cardId} not found in review ${review.id}`)
    }

    // create a copy to modify
    const card = gradeCard(review.cards[cardIndex]!, grade)

    updateCard(card.id, card).catch(err => {
      console.error('Failed to update card', err)
      // TODO: we could handle the different errors:
      // - card not found, remove it from review if it exists
    })

    review.reviewCount++
    // remove the old card
    review.cards.splice(cardIndex, 1)
    // if the card is still due, add it back randomly
    if (card.dueDate <= Date.now()) {
      review.cards.splice(Math.round(Math.random() * review.cards.length), 0, card)
    }
  }

  return {
    start,
    abortSession,
    ongoingReviews,
    canReview,
    getReviewCards,
    reviewCard,
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
