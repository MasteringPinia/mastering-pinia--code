# Data fetching

<picture>
  <source srcset="./.internal/screenshot-dark.png" media="(prefers-color-scheme: dark)">
  <img src="./.internal/screenshot-light.png">
</picture>

In this exercise we will create a custom a mini data fetching to learn how to combine stores with regular composables
and how **not** to put everything in a store!

We will be implementing a simplified and limited version of [Pinia Colada](https://github.com/posva/pinia-colada).

<a href="https://github.com/posva/pinia-colada">
  <img src="https://github.com/posva/pinia-colada/assets/664177/02011637-f94d-4a35-854a-02f7aed86a3c" class="instructions-raw-img" style="width: 100px;" alt="Pinia Colada logo">
</a>

## 📝 Your Notes

Write your notes or questions here.

## 🎯 Goals

This exercise can be quite long and there are many ways to implement the same functionality. I will give you some steps
to follow but feel free to do it your own way. During the correction, I will follow the steps below. The main goal of
the exercise is to understand the benefits of combining a store with composables. While we will be adding features to
`use-query.ts` and `use-mutation.ts`, we will also be writing part of the features into the `data-fetching-store.ts`
store. You will find many types to guide you through this exercise, but feel free **not to use them**, and create your
own instead. For example, you can change adapt the _interface_
` UseDataFetchingQueryEntry<TResult = unknown, TError = any>` to your needs.ht

- Implementing `useQuery()`
  - Start by adding `data` to the returned object of `useQuery()`
    - Implement the store action `ensureEntry()`
    - I recommend you to implement the `refetch()` method first.
    - `refetch()` calls return the pending promise if it's **still** fetching.
    - Ensure `useQuery()` uses the correct entry based on the `key` option, **especially with refs and getters**
    - Ensure `data` is updated **only** when the query resolves. That way we can still display the old value while it's
      loading
  - Add the `isFetching` property
    - Ensure it is `true` when the query is running and false otherwise
  - Add the `error` property
    - Ensure it is updated when the query rejects or resolves
  - Implement `refresh()`
    - Deduplicate requests
    - Only fetches if the `cacheTime` has expired (use `isExpired()`)
- Implementing `useMutation()`
  - Handle `isFetching` state
    - Should be `true` when the mutation is running and false otherwise
  - Handle `data`
    - Should be updated when the mutation resolves
  - Handle `error`
    - Should be updated when the mutation rejects or resolves
  - Invalidating cached queries based on the `keys` option when the mutation settles
  - Ensure that new calls to `mutate()` take precedence over the previous ones
    - The old mutation result should be ignored

## 💪 Extra goals

_Extra goals might not have any tests and can be done later or skipped._

- Connect the search text to the URL with a query string named `search`, e.g. `?search=Anna`
- Replace `useFuse()` with a `useMutation()` that keeps track of the search argument for the cache
