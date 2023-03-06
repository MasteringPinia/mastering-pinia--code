<script setup lang="ts">
import { ref, computed } from 'vue'
import Foo from './MyFoo.vue'

const times = ref(2)
const props = defineProps<{ count: number }>()

const result = computed(() => props.count * times.value)

defineExpose(props)
</script>

<template>
  <Foo>
    <div>{{ count }} x {{ times }} = {{ result }}</div>
    <button @click="times += 1">x1</button>
  </Foo>
</template>
