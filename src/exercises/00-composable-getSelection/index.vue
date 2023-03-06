<script setup lang="ts">
import { computed } from 'vue'
import { useSelectionText } from './useSelectionText'

const selection = useSelectionText()
const { top, left, text, width, height } = selection

const rectTop = computed(() => `${top.value}px`)
const rectLeft = computed(() => `${left.value}px`)
const rectWidth = computed(() => `${width.value}px`)
const rectHeight = computed(() => `${height.value}px`)
</script>

<template>
  <p>
    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's
    standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a
    type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting,
    remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing
    Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of
    Lorem Ipsum
  </p>

  <div class="fixed top-0 left-0">
    <div class="flex items-start justify-center drawn-rect">
      <div
        v-if="text.length"
        class="absolute px-2 bg-gray-800 border-2 border-solid rounded pointer-events-auto  text-light-300 border-rose-500 -top-10 min-w-6"
      >
        {{ text.length }}
      </div>
    </div>
  </div>

  <hr />

  <pre>{{ selection }}</pre>
</template>

<style scoped>
.drawn-rect {
  position: absolute;
  pointer-events: none;
  background-color: rgb(91 249 106 / 49%);
  transition: top 300ms ease-out, left 300ms ease-out, width 300ms ease-out, height 300ms ease-out;
  top: v-bind(rectTop);
  left: v-bind(rectLeft);
  width: v-bind(rectWidth);
  height: v-bind(rectHeight);
}
</style>
