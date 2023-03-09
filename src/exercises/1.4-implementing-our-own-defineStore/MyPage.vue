<script lang="ts" setup>
import { useCountStore } from './store'

const { double, n } = useCountStore()
</script>

<template>
  <p>
    Count: <span data-test="count">{{ n }}</span
    >. {{ n }} x 2 = <span data-test="double">{{ double }}</span>
  </p>
  <button data-test="increment" @click="n++">Increment ({{ n }})</button>
</template>
