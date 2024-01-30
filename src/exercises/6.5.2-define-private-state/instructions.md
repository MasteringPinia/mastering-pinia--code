# Private state in Stores

<picture>
  <source srcset="./.internal/screenshot-dark.png" media="(prefers-color-scheme: dark)">
  <img src="./.internal/screenshot-light.png">
</picture>

In the next few exercises, we are going to implement some custom _defineStore()_.
We will start with `definePrivateState()`,
then do `definePrivateStore()`, and `defineReadonlyState()` functions. These exercises can feel **particularly challenging** if
done in TypeScript. Feel free to use some of the _forbidden_ `as any`, or `@ts-ignore` to make _the yellow/red lines go
away_.

## 📝 Your Notes

Write your notes or questions here.

## 🎯 Goals

If you decide to go the difficult route and make everything type safe, try to let TS infer as much as possible,
especially **the return types** of the functions we are going to write. If you feel blocked, unveil the _Tips_ below.

**Note**: The tests cannot cover TypeScript errors, they only cover the runtime behavior. If you are interested in
working on your Typing skills, keep an eye on your editor's TypeScript warning/errors.

The work will happen **only** in `private-state.ts`. The other file are just meant to be there to help you understand
what we are trying to achieve and to test out things in the browser.

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
  >(id: Id, privateState: PrivateState, setup: SetupStore) {
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
