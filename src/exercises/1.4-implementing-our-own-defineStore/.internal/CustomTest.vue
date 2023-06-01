<script lang="ts" setup>
const props = defineProps<{
  useStore: () => {
    double: number
    n: number
  }
}>()

const { double, n } = props.useStore()
</script>

<template>
  <p>
    Count: <span data-test="count">{{ n }}</span
    >. {{ n }} x 2 = <span data-test="double">{{ double }}</span>
  </p>
  <button data-test="increment" @click="n++">Increment ({{ n }})</button>
</template>
