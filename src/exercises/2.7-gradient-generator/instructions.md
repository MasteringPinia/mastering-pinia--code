# Building a Gradient Generator

![Gradient Generator](./.internal/screenshot.png)

During this exercise, you will build a gradient generator setup store and hook it up to a nice UI.

The user should be able to select different colors and see the gradient change in real time.

We will add the ability to generate random gradients.

The user will be able to visualize the CSS code for the gradient and copy it to the clipboard with the press of a
button.

## 📝 Your Notes

Write your notes or questions here.

## 🎯 Goals

- Inside of the `GradientGenerator` store:
  - Store the different colors of the gradient in an array named `colors`
  - Add an `angle` property to the store so the user can control the angle of the gradient
  - Generate the CSS gradient using the colors and the angle
  - Create a function that allows adding a new color to the gradient
  - Create a function that allows removing a color from the gradient
    - (The user should not be able to remove a color if there are only two colors left)
  - Create a function to randomize the array
  - Create a funciton to reset the colors
- Use the `GradientGenerator` in the component to:
  - Apply the gradient as a `background-image` property to the `.gradient-preview` element
  - Allow changing the color using the `<input type="color">` element (a native color picker)
  - Display the preview of the CSS code for the gradient
  - Hookup the UI buttons to the proper store functions
  - Add a button that allows the user to copy it to the clipboard
    - 💡HINT: VueUse is installed and exposes a useClipboard composable

## 💪 Extra goals

_Extra goals might not have any tests and can be done later or skipped._

As an extra goal, let's add a history of all the generated gradients. Everytime the user randomizes the gradient, we
save the current one into an array. Then you can display the list with a `<select>` and let the user go back to any
previous gradient.
