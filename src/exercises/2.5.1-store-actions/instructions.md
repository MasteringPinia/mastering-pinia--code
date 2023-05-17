# Store getters

Let's review actions actions in Pinia. In this exercise we will practice with synchronous actions and asynchronous
actions. We will consider we have a stock of dangos that we can eat

## 📝 Your Notes

Write your notes or questions here.

## 🎯 Goals

- Create an action named `eatDango` that eats one dango ball. Each dango stick has 3 balls, so only once we eat 3 times,
  we will be able to decrement the number of sticks.
  - Make sure not to do anything if there are no dangos left
  - Don't reset the `eatenBalls` variable, use the module operator `%` to check if we have eaten 3 balls
- Call that action when the user clicks on the "Eat!" button
- Create an action named `startEating` that starts eating dangos every 500ms until there are no dangos left
  - It should call the `eatDango` action every 500ms
  - Add a boolean state property named `isEating` that would allow us to stop eating and interrupt the action at any
    time
  - Ensure `startEating` stops if `isEating` is false
- Call that action when the user clicks on the "Start eating!" button
- Create an action named `stopEating` that stops eating dangos
- Call that action when the user clicks on the "Stop eating!" button

Hints:

- `startEating` should return a promise and run as
- If they are calling setInterval instead of setTimeout, hint them
