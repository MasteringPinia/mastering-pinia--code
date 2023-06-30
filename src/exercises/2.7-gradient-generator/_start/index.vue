<script lang="ts" setup></script>

<template>
  <h1 class="mb-5">Gradient Generator</h1>

  <div class="my-2 space-x-1">
    <button data-test="btn-reset">Reset</button>
    <button data-test="btn-randomize">Randomize</button>
    <button data-test="btn-clipboard">Copy to Clipboard</button>
  </div>

  <div class="rounded gradient-preview"></div>

  <div class="flex py-1 my-2">
    <label class="flex items-center">
      <span>Angle: </span>
      <input data-test="angle-value-range" class="mx-3" type="range" step="1" min="0" max="360" />
    </label>
    <input data-test="angle-value-number" type="number" min="0" max="360" />
  </div>

  <div class="flex flex-wrap">
    <!-- Display a swatch of each color in the gradient -->
    <div class="flex flex-col items-center group">
      <input class="w-12 h-10 p-1 m-1" type="color" />

      <!-- Should remove color when this button is clicked -->
      <button class="invisible w-5 h-5 p-0 group-hover:visible" data-test="btn-remove-color" title="Remove this color">
        -
      </button>
    </div>

    <button class="w-12 h-10 p-1 m-1" data-test="btn-add-color" title="Add Color">+</button>
  </div>
</template>

<style scoped>
.gradient-preview {
  aspect-ratio: 2 / 1;
  background-image: linear-gradient(#00c9ff, #92fe9d);
  min-height: 75px;
}
</style>
