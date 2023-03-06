# Using composables within Pinia stores

Takeaways:

- What is really a composables
- Why is it special and cannot be called anywhere
- How to use within Pinia stores
  - Basics
    - `useLocalStorage()` <https://vueuse.org/core/useLocalStorage/>
    - <https://vueuse.org/core/useColorMode/>
  - Advanced usage with composables that require extra refs like <https://vueuse.org/shared/useLastChanged/>
  - Limitations for Option Stores
    - Only state properties
    - Remember non-serializable values won't work or will need some extra modifications with SSR apps. e.g.<https://vueuse.org/core/useActiveElement/>
  - No limits in Setup stores

## 📝 Your Notes

Write your notes or questions here.

## 🎯 Goals

- It should...

## 💪 Extra goals

_Extra goals might not have any tests and can be done later or skipped._

- do ...
