import { type Card } from './api'

export enum Grade {
  /**
   * Repeat the card again during this session
   */
  Again = 0,
  /**
   * The card was difficult to remember. It will be repeated more often in the future
   */
  Hard = 1,
  /**
   * The card was easy to remember. It will be repeated less often in the future
   */
  Good = 2,
  /**
   * The card was very easy to remember. It will be repeated even less often in the future
   */
  Easy = 3,
}

export const GRADE_MAX = Grade.Easy
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

  addCard(card: Card): Card {
    this.cards.set(card.id, card)
    return card
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
