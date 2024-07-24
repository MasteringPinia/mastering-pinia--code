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
export async function deleteDeck(deckId: string) {
  return decks.delete(deckId)
}

export async function createCard(deckId: string, question: string, answer: string) {
  const card = CardSchema.parse({
    id: crypto.randomUUID(),
    deckId,
    question,
    answer,
    interval: 1 * 1000 * 60 * 60 * 24, // 1 day
    repetitions: 0,
    ease: 1.5,
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

export async function getDeckList() {
  const deckList = await decks.get({
    query: {
      _sort: 'createdAt',
      _order: 'desc',
      _embed: 'cards',
    },
  })

  return DeckListWithCardsSchema.parse(deckList)
}

export const DeckWithCardsSchema = DeckSchema.extend({
  cards: z.array(CardSchema),
})
export type DeckWithCards = z.infer<typeof DeckWithCardsSchema>
export const DeckListWithCardsSchema = z.array(DeckWithCardsSchema)
export type DeckListWithCards = z.infer<typeof DeckListWithCardsSchema>

export async function getDeckWithCards(deckId: string): Promise<DeckWithCards> {
  const deck = await decks.get<Deck>(deckId, { query: { _embed: 'cards' } })

  if (!deck) {
    throw new Error('Deck not found')
  }

  return DeckWithCardsSchema.parse(deck)
}

/**
 * SEED DATA
 */

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export async function seedDecksAndCards() {
  const TIME = 50
  // Get all decks and cards
  const deckList = await getDeckList()

  // delete all cards of each deck and then delete the deck
  for (const deck of deckList) {
    console.log(`Deleting cards for deck "${deck.name}" (${deck.id})`)
    for (const card of deck.cards) {
      console.log(`Deleting card "${card.question}" (${card.id})`)
      await delay(TIME)
      await deleteCard(card.id)
    }
    console.log(`Deleting deck "${deck.name}" (${deck.id})`)
    await delay(TIME)
    await decks.delete(deck.id)
  }

  // Create some decks about general knowledge

  console.log('Creating a deck with capital cities')
  await delay(TIME)
  const capitalCitiesDeck = await createDeck('Capital Cities')

  const capitals = [
    { country: 'France', capital: 'Paris' },
    { country: 'Germany', capital: 'Berlin' },
    { country: 'Italy', capital: 'Rome' },
    { country: 'Spain', capital: 'Madrid' },
    { country: 'Portugal', capital: 'Lisbon' },
    { country: 'United Kingdom', capital: 'London' },
    { country: 'United States', capital: 'Washington, D.C.' },
    { country: 'Canada', capital: 'Ottawa' },
    { country: 'Mexico', capital: 'Mexico City' },
    { country: 'Brazil', capital: 'Brasília' },
    { country: 'Argentina', capital: 'Buenos Aires' },
    { country: 'Australia', capital: 'Canberra' },
    { country: 'Japan', capital: 'Tokyo' },
    { country: 'South Korea', capital: 'Seoul' },
    { country: 'China', capital: 'Beijing' },
    { country: 'India', capital: 'New Delhi' },
    { country: 'Russia', capital: 'Moscow' },
    { country: 'South Africa', capital: 'Pretoria' },
    { country: 'Nigeria', capital: 'Abuja' },
    { country: 'Egypt', capital: 'Cairo' },
    { country: 'Kenya', capital: 'Nairobi' },
    { country: 'Morocco', capital: 'Rabat' },
  ]

  console.log(`Creating ${capitals.length} cards for capital cities`)
  for (const { country, capital } of capitals) {
    await delay(TIME)
    await createCard(capitalCitiesDeck.id, `What is the capital of ${country}?`, capital)
  }

  // Create a deck about Chinese language
  console.log('Creating a deck with most common Chinese words')
  await delay(TIME)
  const chineseDeck = await createDeck('Most common Chinese words')

  // List of unique cards to add
  const uniqueCards = [
    { word: '一', pinyin: 'yī', translation: 'one' },
    { word: '二', pinyin: 'èr', translation: 'two' },
    { word: '三', pinyin: 'sān', translation: 'three' },
    { word: '四', pinyin: 'sì', translation: 'four' },
    { word: '五', pinyin: 'wǔ', translation: 'five' },
    { word: '六', pinyin: 'liù', translation: 'six' },
    { word: '七', pinyin: 'qī', translation: 'seven' },
    { word: '八', pinyin: 'bā', translation: 'eight' },
    { word: '九', pinyin: 'jiǔ', translation: 'nine' },
    { word: '十', pinyin: 'shí', translation: 'ten' },
    { word: '百', pinyin: 'bǎi', translation: 'hundred' },
    { word: '千', pinyin: 'qiān', translation: 'thousand' },
    { word: '万', pinyin: 'wàn', translation: 'ten thousand' },
    { word: '人', pinyin: 'rén', translation: 'person' },
    { word: '天', pinyin: 'tiān', translation: 'day' },
    { word: '地', pinyin: 'dì', translation: 'earth' },
    { word: '水', pinyin: 'shuǐ', translation: 'water' },
    { word: '火', pinyin: 'huǒ', translation: 'fire' },
    { word: '风', pinyin: 'fēng', translation: 'wind' },
    { word: '山', pinyin: 'shān', translation: 'mountain' },
    { word: '田', pinyin: 'tián', translation: 'field' },
    { word: '林', pinyin: 'lín', translation: 'forest' },
    { word: '花', pinyin: 'huā', translation: 'flower' },
    { word: '草', pinyin: 'cǎo', translation: 'grass' },
    { word: '树', pinyin: 'shù', translation: 'tree' },
    { word: '石', pinyin: 'shí', translation: 'stone' },
    { word: '金', pinyin: 'jīn', translation: 'gold' },
    { word: '木', pinyin: 'mù', translation: 'wood' },
    { word: '土', pinyin: 'tǔ', translation: 'soil' },
    { word: '禾', pinyin: 'hé', translation: 'grain' },
    { word: '米', pinyin: 'mǐ', translation: 'rice' },
    { word: '车', pinyin: 'chē', translation: 'car' },
    { word: '船', pinyin: 'chuán', translation: 'boat' },
    { word: '飞', pinyin: 'fēi', translation: 'fly' },
    { word: '走', pinyin: 'zǒu', translation: 'walk' },
    { word: '看', pinyin: 'kàn', translation: 'look' },
    { word: '听', pinyin: 'tīng', translation: 'listen' },
    { word: '说', pinyin: 'shuō', translation: 'speak' },
    { word: '读', pinyin: 'dú', translation: 'read' },
    { word: '写', pinyin: 'xiě', translation: 'write' },
    { word: '学', pinyin: 'xué', translation: 'learn' },
    { word: '工', pinyin: 'gōng', translation: 'work' },
    { word: '子', pinyin: 'zǐ', translation: 'child' },
    { word: '女', pinyin: 'nǚ', translation: 'woman' },
    { word: '男', pinyin: 'nán', translation: 'man' },
    { word: '父', pinyin: 'fù', translation: 'father' },
    { word: '母', pinyin: 'mǔ', translation: 'mother' },
    { word: '兄', pinyin: 'xiōng', translation: 'elder brother' },
    { word: '弟', pinyin: 'dì', translation: 'younger brother' },
    { word: '姐', pinyin: 'jiě', translation: 'elder sister' },
    { word: '妹', pinyin: 'mèi', translation: 'younger sister' },
    { word: '朋友', pinyin: 'péngyǒu', translation: 'friend' },
    { word: '老', pinyin: 'lǎo', translation: 'old' },
    { word: '少', pinyin: 'shǎo', translation: 'few' },
    { word: '多', pinyin: 'duō', translation: 'many' },
    { word: '高', pinyin: 'gāo', translation: 'tall' },
    { word: '矮', pinyin: 'ǎi', translation: 'short' },
    { word: '长', pinyin: 'cháng', translation: 'long' },
    { word: '短', pinyin: 'duǎn', translation: 'short' },
    { word: '大', pinyin: 'dà', translation: 'big' },
    { word: '小', pinyin: 'xiǎo', translation: 'small' },
    { word: '好', pinyin: 'hǎo', translation: 'good' },
    { word: '坏', pinyin: 'huài', translation: 'bad' },
    { word: '快', pinyin: 'kuài', translation: 'fast' },
    { word: '慢', pinyin: 'màn', translation: 'slow' },
    { word: '新', pinyin: 'xīn', translation: 'new' },
    { word: '旧', pinyin: 'jiù', translation: 'old' },
    { word: '亮', pinyin: 'liàng', translation: 'bright' },
    { word: '暗', pinyin: 'àn', translation: 'dark' },
    { word: '冷', pinyin: 'lěng', translation: 'cold' },
    { word: '热', pinyin: 'rè', translation: 'hot' },
    { word: '干', pinyin: 'gān', translation: 'dry' },
    { word: '湿', pinyin: 'shī', translation: 'wet' },
  ]

  console.log(`Creating ${uniqueCards.length} cards for common Chinese words`)
  for (const card of uniqueCards) {
    await delay(TIME)
    await createCard(chineseDeck.id, card.word, `${card.pinyin} | ${card.translation}`)
  }
}
