<script lang="ts" setup>
import { usePrivateStore } from '../stores/store-private-store'

const privateCounter = usePrivateStore()
</script>

<template>
  <h2>Private Store counter</h2>

  <p>
    ⛔️ This page is the <i>advanced goal</i> of the exercise. Make sure to complete the other version before trying
    this one.
  </p>

  <div class="space-x-2 mb-2">
    <button @click="privateCounter.decrement()">Decrement by 1</button>
    <button @click="privateCounter.decrement(10)">Decrement by 10</button>
  </div>

  <p>Double plus one: {{ privateCounter.doublePlusOne }}</p>

  <p>Counter store state (should be empty):</p>
  <pre><code>{{ privateCounter.$state }}</code></pre>
  <pre><code>'double' in privateCounter: {{ 'double' in privateCounter }}</code></pre>
  <pre><code>'increment' in privateCounter: {{ 'increment' in privateCounter }}</code></pre>
</template>
