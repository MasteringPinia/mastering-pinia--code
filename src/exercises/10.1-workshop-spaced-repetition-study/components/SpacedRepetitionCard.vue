<script lang="ts" setup>
import { ref } from 'vue'
import { Card, Grade } from '../spaced-repetition'

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
  if (revealed.value) {
    emit('pass')
    return
  }
  emit('review', grade)
  reviewed.value = grade
  revealed.value = true
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
      <button @click="revealed = true">Show</button>
    </template>

    <GlobalEvents
      @keypress.exact.space="review(Grade.Good)"
      @keydown.exact.right="review(Grade.Good)"
      @keydown.exact.left="review(Grade.Hard)"
      @keydown.exact.up="review(Grade.Easy)"
      @keydown.exact.down="review(Grade.Again)"
    />

    <hr />

    <div>
      <button :disabled="reviewed !== false && reviewed !== Grade.Again" @click="review(Grade.Again)">Again</button>
      <button :disabled="reviewed !== false && reviewed !== Grade.Hard" @click="review(Grade.Hard)">Hard</button>
      <button :disabled="reviewed !== false && reviewed !== Grade.Good" @click="review(Grade.Good)">Good</button>
      <button :disabled="reviewed !== false && reviewed !== Grade.Easy" @click="review(Grade.Easy)">Easy</button>
    </div>
  </section>
</template>
