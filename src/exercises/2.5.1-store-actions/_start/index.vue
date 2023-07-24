<script lang="ts" setup>
import { useDango } from './dango'

const dango = useDango()
</script>

<template>
  <h1>Let's eat some Dango 🍡</h1>

  <div class="space-x-2">
    <button data-test="btn-eat" :disabled="dango.amount < 1">Eat!</button>
    <button data-test="btn-start-eating" :disabled="dango.amount < 1">Start Eating until finished</button>
    <button data-test="btn-stop-eating">Stop eating</button>
    <button @click="dango.$reset()">Reset</button>
  </div>

  <EatingDango251 />
</template>
