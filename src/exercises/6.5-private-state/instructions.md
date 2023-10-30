# Private state in Stores

<picture>
  <source srcset="./.internal/screenshot-dark.png" media="(prefers-color-scheme: dark)">
  <img src="./.internal/screenshot-light.png">
</picture>

In this exercise we are going to start by adding some private state to a store. Then, we are going to push the concept
further: defining private state through extra stores is a bit verbose so let's create our own `definePrivateState()`,
`definePrivateStore()`, and `defineReadonlyState()` functions. This exercise can feel **particularly challenging** if
done in TypeScript. Feel free to use some of the _forbidden_ `as any`, or `@ts-ignore` to make _the yellow/red lines go
away_.

## 📝 Your Notes

Write your notes or questions here.

## 🎯 Goals

### 1. Add private state to a store

Let's first practice what we just watched by adding a private state to a store. The store is already created in
`stores/auth.ts`.

- Ensure the store's `currentUser` is defined as _private state_, like we saw in the lesson
- Expose the `currentUser` as a getter in the auth store so it can be used in the template

### 2. Implement our own `definePrivateState()` methods

If you decide to go the difficult route and make everything type safe, try to let TS infer as much as possible,
especially **the return types** of the functions we are going to write. If you feel blocked, unveil the _Tips_ below.

**Note**: The tests cannot cover TypeScript errors, they only cover the runtime behavior. If you are interested in
working on your Typing skills, keep an eye on your editor's TypeScript errors.

The work will happen **only** in `private-state.ts`, `private-store.ts`, and `readonly-state.ts`. The other file are
just meant to be there to help you understand what we are trying to achieve and to test out things in the browser.

- In `private-state.ts`, implement `definePrivateState()` so it can be used in `stores/store-private-state.ts` like
  this:

  ```ts
  export const usePrivateCounter = definePrivateState(
    'my-id',
    // a function that returns the initial state
    // just like in option stores
    () => ({ n: 0 }),
    // this is a setup store **with an argument**
    // it should give access to the private state defined above
    privateState => {
      const double = computed(() => privateState.n * 2)

      function increment(amount = 1) {
        privateState.n += amount
      }

      return {
        double,
        increment,
      }
    },
  )
  ```

  - Use the 2nd argument `privateState` to define a store that **holds the private state**, just like we saw in the
    lesson. Make sure **not to have duplicated ids** for stores.
  - Define another store that will _use_ the one we just defined. This store will be the **public store** that will be
    returned by `definePrivateState()`.

  <details>
  <summary>💡 <img class="tip-logo" src="/logo-ts.svg" alt="TypeScript"> Tip: <i>Arguments</i></summary>

  `definePrivateState()` should accept 3 generics. One used by each argument. This doesn't mean it should just be:

  ```ts
  definePrivateState<
    // feel free to name them as you want
    Id,
    PrivateState,
    SetupStore
  >(id: Id, privateState: PrivateState, SetupStore) {
    // ...
  }
  ```

  The _more_ you can constrain a type, the better TypeScript will be at inferring it!

  </details>

  <details>
  <summary>💡 <img class="tip-logo" src="/logo-ts.svg" alt="TypeScript"> Tip: <i>Generic Types</i></summary>

  If you one of the following error:

  ```
  Type 'Id' is not assignable to type 'string'
  Type 'PrivateState' is not assignable to type 'StateTree'
  ```

  `Id` and `PrivateState` are the generic types I used but you might have named them differently.

  It means the generic `PrivateState` is not constrained enough. You can fix it by adding a constraint to the generic:

  ```ts
  function definePrivateState<
    Id extends string,
    PublicState extends StateTree,
    // TODO: You still have to figure out this one
    SetupReturn,
  >(/* ... */) {
    // ...
  }
  ```

  </details>

  <details>
  <summary>💡 <img class="tip-logo" src="/logo-ts.svg" alt="TypeScript"> Tip: <i>Letting TS infer types</i></summary>

  In order to get the most out of TypeScript inference, try to be as close to the actual type you want to use in your
  generics. For example, instead of doing this:

  ```ts
  export function definePrivateState<
    Id,
    // we are aligning with the type of the 2nd argument
    PrivateState extends () => StateTree,
    SetupReturn,
  >(
    id: Id,
    // 👉 look how we just consume the type here
    privateStateFn: PrivateState,
    // 👉 here we can use type helpers but the return type is not inferred as we want
    setup: (privateSTate: ReturnType<PrivateState>) => SetupReturn,
  ) {
    // ... hiding the rest of the solution
    setup(privateStore.$state) // 🔴 type error
  }
  ```

  What we want is the actual shape of the state, not the function that returns it. We can do this:

  ```ts
  export function definePrivateState<
    Id,
    // we are aligning with the type of the 2nd argument
    PrivateState extends StateTree,
    SetupReturn,
  >(
    id: Id,
    // 👉 Here the type PrivateState is closer to what we need
    privateStateFn: () => PrivateState,
    // 👉 And we can use it directly here
    setup: (privateSTate: PrivateState) => SetupReturn,
  ) {
    // ... hiding the rest of the solution
    setup(privateStore.$state) // ✅ No error!
  }
  ```

  </details>

- Let's do a more advanced version: In `private-store.ts`, implement `definePrivateStore()` so it can be used in
  `stores/store-private-store.ts` like this:

  ```ts
  export const usePrivateCounter = definePrivateStore(
    'my-id',
    // a function that defines a private store
    () => {
      const n = ref(0)

      function increment(amount = 1) {
        privateStore.n += amount
      }

      return { n, increment }
    }
    // this is a setup store **with an argument**
    // it should give access to the private state defined above
    privateStore => {
      const double = computed(() => privateStore.n * 2)

      return {
        double,
        // we can decide to expose increment if we want to
        increment: privateStore.increment,
      }
    },
  )
  ```

  - Use the 2nd argument `privateStoreSetup` to _define a store_ that holds private state **and any private getters or
    actions**.
  - Define another store that will be the **public store** that will be returned by `definePrivateStore()`.
  - This version of the store should be fairly similar to the one we just did, **it mostly differs in Types**.

  <details>
  <summary>💡 <img class="tip-logo" src="/logo-ts.svg" alt="TypeScript"> Tip: <i>Pinia type Helpers</i></summary>

  Pinia exposes some type helpers to work with Store types. In this scenario, we need a way to extract the type of a
  _Store instance_ from the `privateStoreSetup` function. We can use `SetupStoreDefinition` for that:

  ```ts
  import { SetupStoreDefinition, defineStore } from 'pinia'

  export function definePrivateStore<
    Id extends string,
    // 👇 no extends constraint this time, like with StoreSetup
    PrivateStore,
    StoreSetup,
  >(
    id: Id,
    // 👇 same as before
    privateStoreSetup: () => PrivateStore,
    setup: (
      // 👇 We need to get a bit more complex here
      privateState: ReturnType<SetupStoreDefinition<string, PrivateStore>>,
    ) => StoreSetup,
  ) {
    // ...
  }
  ```

  </details>

## 💪 Extra goals

_Extra goals might not have any tests and can be done later or skipped._

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
