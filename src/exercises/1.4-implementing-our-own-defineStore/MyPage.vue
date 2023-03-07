<script lang="ts" setup>
import { useCountStore } from './store'

const { double, n } = useCountStore()
</script>

<template>
  <p>Count: {{ n }}. {{ n }} x 2 = {{ double }}</p>
  <button @click="n++">Increment ({{ n }})</button>
</template>
