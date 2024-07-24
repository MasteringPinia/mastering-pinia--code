# Title

short description

## 📝 Your Notes

Write your notes or questions here.

## 🎯 Goals

- Display the deck list

  - fetch within store
  - handle SSR (+ refresh on mount, it's okay to have double fetch for this one)
  - Display deck names + number of cards
  - Add a link to the deck page
  - Add a link to create a new deck

- Deck creation

  - Create the page with a form
    - A deck only needs a name
  - Create the `create` action in the decks store
  - redirect to deck page after creation

- Create a `useMutation()` composable to handle the form submission. The goal of this is to explain the difference
  between putting things in the store or in composables

  - Handle loading state (throttle to test)
  - Display errors

- Deck page

  - Fetch the deck within the store and store it in the collection
  - use the route params to find the current deck within the collection
  - Ensure SSR works
  - Display the deck name
  - Display the cards count
  - Display the creation date
  - Display in a collapsible block (`<details>`) the cards
  - Add delete deck feature
    - Delete button
    - Confirm dialog
    - Delete action in the store that deletes the deck
    - Redirect to deck list after deletion
  - Add a link/button to review the deck (not working yet)
  - Add a lkn/button to add a card to the deck

- Add a card page

  - Question and answer fields
  - Create an `addCard` action in the store
    - Handle loading state with `useMutation()`
  - Redirect to the deck page after creation
  - Display list of cards in the deck
    - Ensure the deck is fetched in the page
    - Handle SSR

- Reviewing cards (`stores/deck-review.ts`)
  - Link the review button to the review page
  - Create a `start` action in the store
    - It should ensure the deck can be reviewed:
      - The deck has at least one card
      - The deck has at least one card that is due
      - The deck is not already being reviewed
    - Generate the array of cards that are due for review
    - Create a review session object and store it in the ongoing reviews
    - If the deck is already being reviewed, it should reuse it
- Reviewing cards (part 2)

  - Automatically invoke the `start` action on the _current deck_
  - If the deck cannot be reviewed, redirect to the deck list
  - Display information about the review session
    - How many cards are left
    - Use the `<SpacedRepetitionCard>` (feel free to customize it) to display the first card in the queue

- Reviewing cards (part 3)

  - Implement a `reviewCard()` action in the store
    - Grade the card
    - Update the card on the DB
    - Remove it from the queue
    - If the queue is empty, the review session should be removed

- Display the ongoing reviews in the deck list

  - Display the number of ongoing reviews
  - Display the name, the percentage of completion
  - Add a link to the review page

- Create an `abortSession` action in the store
  - It should remove the review session from the ongoing reviews
  - Add a button to abort the session in the deck list

## 💪 Extra goals

_Extra goals might not have any tests and can be done later or skipped._

- If a deck is not found, an ongoing review should be cancelled
- Updating cards
- Deleting cards
- Filtering cards
- Quiz mode (pick random replies)
