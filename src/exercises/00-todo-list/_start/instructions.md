# Todo List

Let's review all of the basic concepts of Vue.js and its syntax by building yet another todo list.

## 📝 Your Notes

Write your notes or questions here.

## 🎯 Goals

Do the exercise with what you are **comfortable** and **you already know**: if you are familiar with the [Options API](https://staging.vuejs.org/guide/introduction.html#options-api) use that for the whole exercise, if you **already know** the [Composition API](https://staging.vuejs.org/guide/introduction.html#composition-api), you can use that instead. We Will do the whole exercise with the Options API and then, move it to the composition API.

- Create a data structure to hold the list of todos
  - Each todo should have a `text` and an `isFinished` property
- Display the list of todos using an `<ul>`
- Create a small _form_ that allows adding a new todo
  - Disable adding an empty todo
  - Pressing enter instead of the _Submit_ button should also submit the form
  - You don't need `@keyup` (or similar) to create this behavior 👀
  - (Bonus Question): can you do this by only using one event and no `v-model`?
- Use a checkbox to display the state `isFinished` of each todo, allowing you to modify it at the same time
- Add a _Delete_ button next to each todo to remove them from the list
  - You might need to add a generated `id` to each todos (using an incrementing number is the easiest dependency free version)

☕️ Correction

- Allow displaying all / finished / unfinished todos:
  - Start by creating a data structure to hold the currently selected list (`"all" | "finished" | "unfinished"`)
  - Allow changing the current view with 3 `<input type="radio">`
  - (Bonus) Using multiple `computed`, prevent the list from re-rendering when not necessary: Switching from _All_ to _Finished_ should not run your filtering function (probably a `todoList.filter()`)
- Visually differentiate _finished_ from _unfinished_ todos with a strikethrough in CSS
- Allow editing todos by double clicking them:
  - Double clicking any todo item should turn the text into an input
  - Hide the _Delete_ button as well as the _checkbox_ while editing a todo
  - Allow pressing _ESC_ or _enter_ to get out of the editing mode
  - Do NOT use the existing form

☕️ Correction

- Create a `<TodoItem>` Component to display todo items
  - What should go as a `props`, what should be a `data`?
  - Instead of directly changing the passed todo (e.g. by using `v-model="todo.isFinished"`), use _events_ to let the parent component update todos
  - (Bonus) Use only **one event** to update the todo
  - (Bonus) Rely on [Writable Computed](https://staging.vuejs.org/guide/essentials/computed.html#writable-computed) to emit events
- Allow canceling the edition of a todo:
  - While editing, display a _Save_ and _Cancel_ (you might want to use a form)
  - Pressing _Enter_ should _Save_ changes and return back to non editing state
  - Pressing _ESC_ should _discard_ changes (Like pressing the _Cancel_ button) and return back to non editing state
  - The value of the todo item **should not change** until the user decides to _Save_

## 💪 Extra goals

_Extra goals might not have any tests and can be done later or skipped. They should be done after finishing everything in Goals._

- (Bonus) Allow passing a `v-model` to your `<TodoItem>` component
- (Bonus) Animate the change of the currently selected list
- (Bonus) Animate adding and removing new todo items
- (Bonus) Save in local storage all todo items
- (Bonus) If you are using vue-router, save the current selected view on the URL. Otherwise, save it in Local Storage
