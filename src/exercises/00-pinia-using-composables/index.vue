<script lang="ts" setup>
import { useCounterStore } from './stores/counter'

const counter = useCounterStore()
</script>

<template>
  <h1>Counter with composables</h1>

  <p>Current value is {{ counter.n }}. It was last incremented {{ counter.secondsSinceUpdate }} seconds ago</p>
  <button @click="counter.increment(1)">Increment</button>
</template>
