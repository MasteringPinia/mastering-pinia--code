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

- It should...

## 💪 Extra goals

_Extra goals might not have any tests and can be done later or skipped._

- Connect the search text to the URL with a query string named `search`, e.g. `?search=Anna`
- Replace `useFuse()` with a `useMutation()` that keeps track of the search argument for the cache
