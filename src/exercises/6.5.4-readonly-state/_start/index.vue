<script lang="ts" setup>
// ⛔️ Feel free to play around with the code below, but you won't need to change this file
// to make the tests pass.
import { useReadonlyCounter } from './stores/store-readonly-state'

const readonlyCounter = useReadonlyCounter()

const openFile = useOpenFile()
</script>

<template>
  <h2>defineReadonlyState</h2>

  <p class="my-6 leading-relaxed">
    This section covers the store defined in <code>./stores/store-readonly-state.ts</code>, which uses
    <code>defineReadonlyState()</code> from
    <a role="button" href="#" @click.prevent="openFile('./readonly-state.ts')"><code>./readonly-state.ts</code></a
    >. Make sure to check <b>the instructions in the navbar</b> for tips 💡.
  </p>

  <div class="mb-2 space-x-2">
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
