<script lang="ts" setup>
// ⛔️ Feel free to play around with the code below, but you won't need to change this file
// to make the tests pass.
import { usePrivateStore } from './stores/store-private-store'

const privateStoreCounter = usePrivateStore()

const openFile = useOpenFile()
</script>

<template>
  <h2>definePrivateStore()</h2>

  <p class="my-6 leading-relaxed">
    This section covers the store defined in <code>./stores/store-private-store.ts</code>, which uses
    <code>definePrivateStore()</code> from
    <a role="button" href="#" @click.prevent="openFile('./private-store.ts')"><code>./private-store.ts</code></a
    >.
  </p>

  <div class="mb-2 space-x-2">
    <button @click="privateStoreCounter.decrement()">Decrement by 1</button>
    <button @click="privateStoreCounter.decrement(10)">Decrement by 10</button>
  </div>

  <p>Double plus one: {{ privateStoreCounter.doublePlusOne }}</p>

  <p>Counter store state (should be empty):</p>
  <pre><code>{{ privateStoreCounter.$state }}</code></pre>

  <p>The private store can or not expose its getters/actions:</p>

  <pre><code>'double' in privateStoreCounter: {{ 'double' in privateStoreCounter }}</code></pre>
  <pre><code>'increment' in privateStoreCounter: {{ 'increment' in privateStoreCounter }}</code></pre>
</template>
