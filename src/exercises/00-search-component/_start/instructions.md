# Building a reusable Search Component

Sometimes, composables are not enough to build reusable code for your applications, sometimes you also need some template to be reused. This is when _slots_ comes in really handy, they provide you a way to let the consumer of your component to decide how things are displayed.

## 📝 Your Notes

Write your notes or questions here.

## 🎯 Goals

- Build a Pagination Component in `AppPaginator.vue`. Build it with what you are comfortable with. Then migrate it to the Composition API and `script setup` if you want
  - Its props should be as follows:

  ```js
  currentPage: {
    type: Number,
    required: true,
  },
  perPage: {
    type: Number,
    default: 10,
  },
  total: {
    type: Number,
    required: true,
  }
  ```

  - Make sure the pagination displays the correct amount of pages by feeding it the right value for its prop `perPage`
  - Disable the _Next_ Button on the last page
  - Disable the _Previous_ Button on the first page
- ☕️ We will review the solution at this point
- Make `<SearchPaginator>` call the search contacts API included in `index.vue` when the user submits the search form (and not on every keystroke)
- Hide the error message for the moment, we will use it later
- Allow customizing what the `<SearchPaginator>` component displays via `v-slot`, start by displaying the raw results in text format
- Use the `<ContactCard>` (import from `~/components/ContactCard`) component to display results **outside** of the `<SearchPaginator>` component
- Make sure changing pages also triggers an API call. Should we rely on the `@submit` or on a `watch`er?
- Display a message when no contacts are found
- (Bonus) Triggering a new search should reset the page to 1
- ☕️ We will review the solution at this point
- Refactor the fetching logic inside `<SearchPaginator>` so it handles a loading state and an error state
- Make sure to display the loading and error state. You can test them by changing the Network throttling setting in devtools to _Offline_ (error) and _Slow 3G_ (loading state)
- (Bonus) Wait 200ms before displaying the loading state to make the experience look faster
- ☕️ We will review the solution at this point
- Write a `useQueryParam()` composable that returns a reactive variable that automatically pushes a new navigation when changed
  - You should read from the route with `useRoute()` and write to it with `useRouter()`
  - It should allow customizing the _name_ of the query param
  - It should allow parsing the value for formatting purposes (e.g. _string_ to _number_)
  - It should be able to serialize the value to a _string_
  - It should be able to remove the value from the query for default values (e.g. page 1)
  - Make sure changing multiple query params at the same time **only triggers one navigation**
- Use the freshly written `useQueryParam()` to keep the search query and the current page on the URL. Make sure to name the query parameters `searchText` and `page`.

## 💪 Extra goals

_Extra goals might not have any tests and can be done later or skipped._

- Avoid flashing the Search button when changing pages
- Find a simple way to always have full rows on the first page of search results (1 line change)
- Fully Type `useQueryParam()` with a Generic. You are allowed to one `@ts-expect-error` / `as any`
