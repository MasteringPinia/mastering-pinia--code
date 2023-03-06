# Getting started with components

Components, like functions, are a way of encapsulating logic but they also go beyond that: they let you encapsulate a template, and style as well

## 📝 Your Notes

Write your notes or questions here.

## 🎯 Goals

- Build a Pagination Component in `AppPaginator.vue`. Build it with what you are comfortable with (you will have to convert it to composition API and `script setup` later on anyway).
  - Its props should be as follows:

  ```js
  /**
   * Currently selected page. Can be modified with `v-model:currentPage`. Starts at 1.
   */
  currentPage: {
    type: Number,
    required: true,
  },
  /**
   * Amount of elements to display per page.
   */
  perPage: {
    type: Number,
    default: 10,
  },
  /**
   * Amount of elements to paginate through.
   */
  total: {
    type: Number,
    required: true,
  }
  ```

  - Make sure the pagination displays the correct amount of pages by feeding it the right value for its prop `perPage`
  - Disable the _Next_ Button on the last page
  - Disable the _Previous_ Button on the first page
- Migrate your solution to use the Composition API, then migrate it to `script setup` (or do it all at once if that's easier for you)
- Ensure `currentPage` can be used with `v-model:currentPage` on `index.vue` so the `AppPaginator` component handles updates.

## 💪 Extra goals

_Extra goals might not have any tests and can be done later or skipped._

- Define props using a type only definition with `defineProps()`
