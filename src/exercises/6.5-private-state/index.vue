<script lang="ts" setup>
import { usePrivateCounter } from './stores/store-private-state'
import { useReadonlyCounter } from './stores/store-readonly-state'

const privateCounter = usePrivateCounter()
const readonlyCounter = useReadonlyCounter()
</script>

<template>
  <h2>Private counter</h2>

  <div class="space-x-2">
    <button @click="privateCounter.increment()">Increment by 1</button>
    <button @click="privateCounter.increment(10)">Increment by 10</button>
  </div>

  <p>Double: {{ privateCounter.double }}</p>

  <p>Counter store state:</p>
  <pre><code>{{ privateCounter.$state }}</code></pre>

  <hr />

  <h2>Readonly Counter</h2>

  <div class="space-x-2">
    <button @click="readonlyCounter.increment()">Increment by 1</button>
    <button @click="readonlyCounter.increment(10)">Increment by 10</button>
    <!-- NOTE: this one should be highlighted in red -->
    <button @click="readonlyCounter.n++">Direct increment (fails)</button>
  </div>

  <p>N: {{ readonlyCounter.n }}</p>
  <p>Double: {{ readonlyCounter.double }}</p>

  <p>Counter store state:</p>
  <pre><code>{{ readonlyCounter.$state }}</code></pre>
</template>
