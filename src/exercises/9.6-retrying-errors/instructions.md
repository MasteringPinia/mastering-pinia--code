# Retrying failed actions

<picture>
  <source srcset="./.internal/screenshot-dark.png" media="(prefers-color-scheme: dark)">
  <img src="./.internal/screenshot-light.png">
</picture>

In this exercise, we will implement a retrying mechanism for stores. We have a store that fetches artworks from a public
API. We are simulating random errors in the actions that fetch the data. The goal of the exercise is to implement a
Pinia Plugin that uses `store.$onAction()` to retry the action if it fails.

## 📝 Your Notes

Write your notes or questions here.

## 🎯 Goals

Everything you need to implement will happen in the `retry-plugin.ts` file. **You won't need to change the store or the pages**.

- Retry the action if it fails
- Keep retrying until it succeeds or the maximum number of retries is reached
- Accept a `retry` function that receives the error and the number of retries (starts at 0)
- Delay the execution of the action based on the `delay` option
- Accept a `delay` function that receives the number of attempts (starts at 0)
- Type the `retry` option in the `declare module 'pinia'` block
- Make sure that any successful attempt resets the number of retries and the delay
- Manually invoking the action **while it's still retrying** should reset the retry count
  <details>
  <summary>💡 Tip: <i>Differentiate <b>how</b> is the action called</i></summary>

  The difficult part is to differentiate between the action being called by the user and the action being called by the retry plugin. Since the `$onAction()` gets called synchronously when the action is called, we can use a flag to differentiate between the two cases. Set the flag to `true` when the action is called (_retried_) within the plugin:

  ```ts
  let isInternalCall = false
  store.$onAction((action, context) => {
    if (!isInternalCall) {
      // reset the retry count
    }
    // ...
    isInternalCall = true
    store[name](...args) // or similar 😁
    isInternalCall = false
    // ...
  });
  ```

  </details>

## 💪 Extra goals

_Extra goals might not have any tests and can be done later or skipped._

The current implementation has a small issue. It doesn't work with actions that return something. Since the retry
happens within the `$onAction()`, they cannot overwrite the returned value if the promise is rejected. How could you fix
this? Instead of using `$onAction()`, we could implement a plugin that overwrite the `store[actionName]` action with a
new function that handles inside of it the retrying mechanism.
