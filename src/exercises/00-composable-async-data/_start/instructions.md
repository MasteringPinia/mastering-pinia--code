# Building a stateful async data fetcher

Fetching data from an API endpoint is something we often deal with in applications. It's not a difficult task when the request is fast and it doesn't error but there is nothing more frustrating as a user than an application that gives no feedback to the user when an API call is taking too long or when it fails. The application feels broken and users give up. However, the boilerplate needed to handle the loading and error state can feel overwhelming to use everywhere.
Let's build a composable that creates that state for us!

## 📝 Your Notes

Write your notes or questions here.

## 🎯 Goals

The goal is to build a composable that can be used to fetch data from an API endpoint. The composable should handle the loading and error state for us. You can start by writing the code directly in the `index.vue` and move it to the `useAsyncData.ts` file after.

- Your code should automatically call the API endpoint when the component is mounted and whenever `contactId` changes.
- `useAsyncData()` should accept a function that returns a Promise
- it should return an object of refs:
  - `data` the fetched data, initially `undefined`
  - `isPending` true while fetching, false otherwise
  - `error` contains an error when the call failed, `null` otherwise
- it should also return a function `refresh` to trigger a new API call
  - this should also _cancel_ any pending call. Note it's easier to just ignore them than properly canceling them

## 💪 Extra goals

_Extra goals might not have any tests and can be done later or skipped._

- Return an extra ref, `isDelayElapsed` that is set to `false` after each _trigger_ and is set to `true` after 300ms
- Make the function typesafe
- Make that delay amount configurable through a second parameter
