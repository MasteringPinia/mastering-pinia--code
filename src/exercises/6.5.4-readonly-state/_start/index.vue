<script lang="ts" setup>
// ⛔️ Feel free to play around with the code below, but you won't need to change this file
// to make the tests pass.
import { usePrivateCounter } from './stores/store-private-state'
import { usePrivateStore } from './stores/store-private-store'

const privateCounter = usePrivateCounter()
const privateStoreCounter = usePrivateStore()
</script>

<template>
  <h2>Private counter</h2>

  <div class="mb-2 space-x-2">
    <button @click="privateCounter.increment()">Increment by 1</button>
    <button @click="privateCounter.increment(10)">Increment by 10</button>
  </div>

  <p>Double: {{ privateCounter.double }}</p>

  <p>Counter store state (should be empty):</p>
  <pre><code>{{ privateCounter.$state }}</code></pre>

  <hr />

  <h2>Private Store counter</h2>

  <div class="mb-2 space-x-2">
    <button @click="privateStoreCounter.decrement()">Decrement by 1</button>
    <button @click="privateStoreCounter.decrement(10)">Decrement by 10</button>
  </div>

  <p>Double plus one: {{ privateStoreCounter.doublePlusOne }}</p>

  <p>Counter store state (should be empty):</p>
  <pre><code>{{ privateStoreCounter.$state }}</code></pre>
  <pre><code>'double' in privateStoreCounter: {{ 'double' in privateStoreCounter }}</code></pre>
  <pre><code>'increment' in privateStoreCounter: {{ 'increment' in privateStoreCounter }}</code></pre>
  <hr />

  <p>
    If you are done with these, you can try the harder version
    <RouterLink to="/6/5-private-state/readonly-state">Readonly State</RouterLink> 👹.
  </p>
</template>
