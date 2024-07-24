<script lang="ts" setup>
import { ref } from 'vue'
import { Grade } from '../spaced-repetition'
import { type Card } from '../spaced-repetition/api'

defineProps<{
  card: Card
}>()

const emit = defineEmits<{
  review: [grade: Grade]
  pass: []
}>()

const revealed = ref(false)
const reviewed = ref<Grade | false>(false)

function review(grade: Grade) {
  emit('review', grade)
  reviewed.value = grade
}

// TODO: add keyboard shortcuts
</script>

<template>
  <section>
    <slot>
      <p>{{ card.question }}</p>
    </slot>

    <template v-if="revealed">
      <slot>
        <p>{{ card.answer }}</p>
      </slot>
    </template>
    <template v-else>
      <button @click="revealed = true">Show (space)</button>
    </template>

    <GlobalEvents
      @keyup.exact.right="review(Grade.Good)"
      @keyup.exact.left="review(Grade.Hard)"
      @keyup.exact.up="review(Grade.Easy)"
      @keyup.exact.down="review(Grade.Again)"
      @keypress.exact.space="revealed = true"
    />

    <hr />

    <div class="flex justify-items-stretch space-x-2">
      <button class="flex-grow" :disabled="reviewed !== false && reviewed !== Grade.Again" @click="review(Grade.Again)">
        <span class="font-emoji">⬇️</span> Again
      </button>
      <button class="flex-grow" :disabled="reviewed !== false && reviewed !== Grade.Hard" @click="review(Grade.Hard)">
        <span class="font-emoji">⬅️</span> Hard
      </button>
      <button class="flex-grow" :disabled="reviewed !== false && reviewed !== Grade.Good" @click="review(Grade.Good)">
        <span class="font-emoji">➡️</span> Good
      </button>
      <button class="flex-grow" :disabled="reviewed !== false && reviewed !== Grade.Easy" @click="review(Grade.Easy)">
        <span class="font-emoji">⬆️</span> Easy
      </button>
    </div>
  </section>
</template>

<style scoped>
.font-emoji {
  font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', 'Android Emoji', 'EmojiSymbols';
}
</style>
