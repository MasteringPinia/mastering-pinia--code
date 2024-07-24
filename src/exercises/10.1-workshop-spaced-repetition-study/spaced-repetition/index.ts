import { Card } from './api'

export function createCard(deckId: string, question: string, answer: string): Card {
  return {
    id: crypto.randomUUID(),
    deckId,
    question,
    answer,
    interval: 1,
    repetitions: 0,
    ease: SpacedRepetitionDeck.settings.easeFactorStart,
    dueDate: Date.now(),
  }
}

export enum Grade {
  Again = 0,
  Hard = 1,
  Good = 2,
  Easy = 3,
}

const GRADE_MAX = Grade.Easy
const DAY_IN_MS = 1000 * 60 * 60 * 24

export class SpacedRepetitionDeck {
  private cards = new Map<string, Card>()

  constructor(public id: string) {}

  static settings = {
    easeFactorStart: 1.5,
    /**
     * The minimum value the ease factor can be. This avoids repeating a card too much
     */
    easeFactorMinimum: 1.1,
  }

  addCard(card: Card): Card
  addCard(question: string, answer: string): Card
  addCard(questionOrCard: string | Card, answer?: string): Card {
    if (typeof questionOrCard === 'string') {
      const newCard = createCard(this.id, questionOrCard, answer!)
      this.cards.set(newCard.id, newCard)
      return newCard
    }
    this.cards.set(questionOrCard.id, questionOrCard)
    return questionOrCard
  }

  getCard(id: string) {
    return this.cards.get(id)
  }

  reviewCard(id: string, grade: Grade) {
    const card = this.getCard(id)
    if (!card) {
      console.error('Card not found')
      return
    }

    if (grade >= Grade.Good) {
      // correct answer
      if (card.repetitions === 0) {
        card.interval = 1 * DAY_IN_MS
      } else if (card.repetitions === 1) {
        // card has been correctly reviewed twice in a row
        card.interval = 4 * DAY_IN_MS
      } else {
        // subsequent correct reviews reviews
        card.interval *= card.ease
      }
      card.repetitions += 1 * DAY_IN_MS
    } else {
      // incorrect answer
      // make them due again until they get it right
      card.interval = 0
      card.repetitions = 0
    }

    // Update ease factor
    card.ease += 0.1 - (GRADE_MAX - grade) * (0.08 + (GRADE_MAX - grade) * 0.02)
    card.ease = Math.max(card.ease, SpacedRepetitionDeck.settings.easeFactorMinimum)

    // Set next due date
    const now = Date.now()
    card.dueDate = now + card.interval
  }

  getDueCards() {
    const now = Date.now()
    return Array.from(this.cards.values()).filter(card => card.dueDate <= now)
  }

  listAllCards() {
    return this.cards.values()
  }
}
