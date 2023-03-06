# Building a Local Storage based Composable

The goal of this exercise will be to write a `useLocalStorage()` composable function that returns a _writable_ `ref()` and can be used as follows:

```js
const data = useLocalStorage('storagekey', initialValue)
```

The `storagekey` is the key used to save in localStorage while `initialValue` is the initial (or default) value of `data` when it doesn't exist in local storage yet.

Storage key

## 📝 Your Notes

Write your notes or questions here.

## 🎯 Goals

- Start by handling just strings
- Connect the input in the page with the result of your new composable
- It should keep changes when reloading
- It should use the default value if no value is present when the page starts
- It should handle changes from the localStorage (you can try this by manually changing the value in the browser's devtools **in a different tab**)
- It should handle all other primitives (boolean, number, string, etc but no symbol, or bigint) and plain objects
- It should remove any event listener when leaving the page
- The button should increment and persist the counter
- It should clear the storage if the value is the same as the `initialValue`

## 💪 Extra goals

_Extra goals might not have any tests and can be done later or skipped._

- It should work when called outside of a component
- Make the function type safe with a generic:

  ```ts
  const counter = useLocalStorage('counter', 0) // Ref<number>
  const name = useLocalStorage('username', '') // Ref<string>
  ```

- Use a [customRef](https://v3.vuejs.org/api/refs-api.html#customref) instead of a watcher
