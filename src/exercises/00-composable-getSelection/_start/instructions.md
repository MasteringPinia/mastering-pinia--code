# Making a composable out of a browser API

Some browsers API can be called on demand like `window.getSelection()` while exposing an event when they change. This makes a perfect candidate for a reactive version of them!
Let's build a composable to returns the selected text as well as the bounding rectangle (top, left, right, bottom, width, height). There is an API, [`window.getSelection()`](https://developer.mozilla.org/en-US/docs/Web/API/Window/getSelection) that gives access to the currently selected text as well as an event on `document`, [`selectionchange`](https://developer.mozilla.org/en-US/docs/Web/API/Document/selectionchange_event), that triggers whenever that selection changes. Combine this composable with `v-bind()` in CSS and you get a overlapping rectangle with the bounding rectangle of your current selection.

## 📝 Your Notes

Write your notes or questions here.

## 🎯 Goals

- `useSelectionText()` should return an object of refs
  - `text`: the raw text of the current selection
  - `top`, `left`, `bottom`, `right`, `width`, `height`: the bounding box rectangle of the _selection range_
- Make sure to handle the cases where the selection doesn't exist
- Make sure to handle the cases where the range is empty
- Use that selection to position the `div.drawn-rect` with the CSS properties `top`, `left`, `width`, and `height`

## 💪 Extra goals

_Extra goals might not have any tests and can be done later or skipped._

- (Bonus): After a delay of 1s, transform the drawn rectangle above the selected text and display the character count
