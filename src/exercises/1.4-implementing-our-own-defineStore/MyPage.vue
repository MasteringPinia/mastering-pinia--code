<script lang="ts" setup>
import { useCountStore } from './store'

const { double, n, increment } = useCountStore()
</script>

<template>
  <p>
    Count: <span data-test="count">{{ n }}</span
    >. {{ n }} x 2 = <span data-test="double">{{ double }}</span>
  </p>
  <button data-test="increment" @click="increment(1)">Increment ({{ n }})</button>
</template>
