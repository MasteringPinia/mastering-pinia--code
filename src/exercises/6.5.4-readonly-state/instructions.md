# Private state in Stores

<picture>
  <source srcset="./.internal/screenshot-dark.png" media="(prefers-color-scheme: dark)">
  <img src="./.internal/screenshot-light.png">
</picture>

**Note**: Make sure to finish the previous exercises before working on this one.

Let's create a custom `defineReadonlyState()` that creates private state and then exposes it as readonly in the public
store. This is like the `definePrivateState()` with a twist!

## 📝 Your Notes

Write your notes or questions here.

## 🎯 Goals

**Note**: the same tips regarding TypeScript seen in the previous exercise apply here.

The work will happen **only** in `readonly-state.ts`. The other file are just meant to be there to help you understand
what we are trying to achieve and to test out things in the browser.

- Create a custom `defineReadonlyState()`, with the **same arguments as** the first `definePrivateState()` but that
  returns a store that exposes all of the private state properties **as getters**.

  ```ts
  export const useReadonlyCounter = defineReadonlyState(
    '6.5-readonly-state-counter',
    () => ({
      n: 0,
    }),
    priv => {
      const double = computed(() => priv.n * 2)

      function increment(amount = 1) {
        priv.n += amount
      }

      return {
        // note how we are not exposing n
        double,
        increment,
      }
    },
  )
  ```

  - Create an object that holds a `computed` property (a _getter_) for each `privateStore.$state` property.
  - Merge and return the object with the `setup()` return value.
  - **Note**: It's okay if you need to use 1 `as any` cast on this one for TypeScript to be happy.

  <details>
  <summary>💡 <img class="tip-logo" src="/logo-ts.svg" alt="TypeScript"> Tip: <i>getters from another store state</i></summary>

  You can type the object that holds the getters be using a `K in keyof PrivateState` and the `ComputedRef` type from
  Vue:

  ```ts
  const privateStateAsGetters: {
    [K in keyof PrivateState]: ComputedRef<PrivateState[K]>
    // NOTE: this one is a bit harder to get typed correctly as we fill the object afterwards
  } = {} as any

  for (const key in privateStore.$state) {
    // ...
  }
  ```

  This should let TypeScript to infer the correct type if you return it with

  ```ts
  return { ...privateStateAsGetters, ...setupReturn }
  ```

  </details>
