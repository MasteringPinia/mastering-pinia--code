<script setup lang="ts">
import { ref } from 'vue'
import TabManager from './TabManager.vue'
import TabPane from './TabPane.vue'

const n = ref(4)
</script>

<template>
  <h1>Tab system</h1>

  <div>
    <TabManager>
      <TabPane v-for="i in n" :key="i" :title="`Tab n ${i} / ${n}`">
        <h2>This is Tab {{ i }}</h2>
      </TabPane>
    </TabManager>
  </div>
</template>
