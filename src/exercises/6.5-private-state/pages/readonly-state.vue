<script lang="ts" setup>
import { useReadonlyCounter } from '../stores/store-readonly-state'

const readonlyCounter = useReadonlyCounter()
</script>

<template>
  <h2>Readonly Counter</h2>

  <div class="space-x-2 mb-2">
    <button @click="readonlyCounter.increment()">Increment by 1</button>
    <button @click="readonlyCounter.increment(10)">Increment by 10</button>
    <button
      @click="
        /* @ts-expect-error: this shouldn't be allowed */
        readonlyCounter.n++
      "
    >
      Direct increment (fails)
    </button>
  </div>

  <p>N: {{ readonlyCounter.n }}</p>
  <p>Double: {{ readonlyCounter.double }}</p>

  <p>Counter store state (should be empty):</p>
  <pre><code>{{ readonlyCounter.$state }}</code></pre>
</template>
