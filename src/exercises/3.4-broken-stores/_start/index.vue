<script lang="ts" setup>
import { useTodosStore } from './todos'

const todos = useTodosStore()
</script>

<template>
  <h1>Some todos</h1>
  <pre>
    <code>{{ todos.$state }}</code>
   </pre>
</template>
