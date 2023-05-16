<script lang="ts" setup>
import { computed } from 'vue'
import { useGradientGenerator } from './gradient-generator'

const gradient = useGradientGenerator()

const historyColor = computed({
  get: () => gradient.colors.join(', '),
  set(newColors: string) {
    gradient.saveColors()
    gradient.colors = newColors.split(', ')
  },
})
</script>

<template>
  <h1 class="mb-5">Gradient Generator</h1>

  <div class="my-2">
    <button class="mr-1" @click="gradient.$reset()">Reset</button>
    <button class="mr-1" @click="gradient.randomize(2 + Math.floor(Math.random() * 2))">Randomize</button>
    <hr />
    <label>
      Revert to a previous color:
      <select v-model="historyColor" class="max-w-full" title="Saved Colors">
        <option
          v-for="{ colors } in gradient.history"
          :value="colors.join(', ')"
          :disabled="historyColor === colors.join(', ')"
        >
          {{ colors.join(', ') }} {{ historyColor === colors.join(', ') ? '(Current)' : '' }}
        </option>
      </select>
    </label>
  </div>

  <div class="rounded gradient-preview"></div>

  <div class="flex py-1 my-2">
    <label class="flex items-center">
      <span>Angle: </span>
      <input v-model.number="gradient.angle" class="mx-3" type="range" step="1" min="0" max="360" />
    </label>
    <input v-model.number="gradient.angle" type="number" min="0" max="360" />
  </div>

  <div class="flex flex-wrap">
    <div v-for="(color, i) in gradient.colors" class="flex flex-col items-center group">
      <input v-model="gradient.colors[i]" class="w-12 h-10 p-1 m-1" type="color" />
      <button
        class="invisible w-5 h-5 p-0 group-hover:visible"
        title="Remove this color"
        :disabled="gradient.colors.length <= 2"
        @click="gradient.removeColor(i)"
      >
        -
      </button>
    </div>

    <button class="w-12 h-10 p-1 m-1" title="Add Color" @click="gradient.addRandomColor()">+</button>
  </div>
</template>

<style scoped>
.gradient-preview {
  aspect-ratio: 2 / 1;
  background: v-bind('gradient.background');
  min-height: 75px;
}
</style>
