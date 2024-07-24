import { z } from 'zod'
import { mande } from 'mande'

const decks = mande('http://localhost:7777/decks', {})
const cards = mande('http://localhost:7777/cards', {})

export const CardSchema = z.object({
  /**
   * The unique identifier of the card.
   */
  id: z.string().uuid(),

  /**
   * Deck the card belongs to.
   */
  deckId: z.string().uuid(),

  /**
   * The front of the card, the question.
   */
  question: z.string().min(1).max(1000),
  /**
   * The back of the card, the answer.
   */
  answer: z.string().min(1).max(1000),
  /**
   * Time in ms to wait before reviewing the card again.
   */
  interval: z.number().gte(0),
  /**
   * The number of times in a row the card has been correctly reviewed.
   */
  repetitions: z.number().gte(0),
  /**
   * The ease factor determines how much the interval should increase after each review.
   */
  ease: z.number().gte(1),
  /**
   * The date when the card is due for review in ms, created with `Date.now()`.
   */
  dueDate: z.number(),
})

export type Card = z.infer<typeof CardSchema>

export const DeckSchema = z.object({
  /**
   * The unique identifier of the deck.
   */
  id: z.string().uuid(),
  /**
   * The name of the deck.
   */
  name: z.string().min(2).max(100),
  /**
   * The creation date of the deck.
   */
  createdAt: z.string().datetime(),
})
export type Deck = z.infer<typeof DeckSchema>

export async function createDeck(name: string) {
  const deck = DeckSchema.parse({
    name,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  })

  return decks.post<Deck>(deck)
}

export async function createCard(deckId: string, question: string, answer: string) {
  const card = CardSchema.parse({
    id: crypto.randomUUID(),
    deckId,
    question,
    answer,
    interval: 1,
    repetitions: 0,
    ease: 2.1,
    dueDate: Date.now(),
  })

  if (!(await decks.get(deckId))) {
    throw new Error('Deck not found')
  }

  return cards.post<Card>(card)
}

export async function updateCard(cardId: string, card: Partial<Card>) {
  return cards.patch<Card>(cardId, card)
}

export async function deleteCard(cardId: string) {
  return cards.delete(cardId)
}

export async function updateDeck(deckId: string, deck: Partial<Deck>) {
  return decks.patch<Deck>(deckId, deck)
}

export const DeckWithCardsSchema = DeckSchema.extend({
  cards: z.array(CardSchema),
})
export type DeckWithCards = z.infer<typeof DeckWithCardsSchema>

export async function getDeckWithCards(deckId: string): Promise<DeckWithCards> {
  const deck = await decks.get<Deck>(deckId, { query: { _embed: 'cards' } })

  if (!deck) {
    throw new Error('Deck not found')
  }

  return DeckWithCardsSchema.parse(deck)
}
