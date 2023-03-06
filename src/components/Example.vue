<script lang="ts" setup>
import { ref } from 'vue'

const n = ref(0)
</script>


<template>
  <button @click="n++">{{ n }}</button>
</template>
