<script lang="ts" setup>
import { usePrivateCounter } from '../../stores/store-private-state'

const privateCounter = usePrivateCounter()

const openFile = useOpenFile()
</script>

<template>
  <h2><code>definePrivateState()</code></h2>

  <p class="my-6 leading-relaxed">
    This section covers the store defined in <code>./stores/store-private-state.ts</code>, which uses
    <code>definePrivateState()</code> from
    <a role="button" href="#" @click.prevent="openFile('./private-state.ts')"><code>./private-state.ts</code></a
    >. Make sure to check <b>the instructions in the navbar</b> for tips 💡.
  </p>

  <div class="mb-2 space-x-2">
    <button @click="privateCounter.increment()">Increment by 1</button>
    <button @click="privateCounter.increment(10)">Increment by 10</button>
  </div>

  <p>Double: {{ privateCounter.double }}</p>

  <p>Counter store state (should be empty):</p>
  <pre><code>{{ privateCounter.$state }}</code></pre>
</template>
