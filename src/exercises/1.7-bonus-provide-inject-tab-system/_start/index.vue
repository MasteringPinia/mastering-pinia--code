<script setup lang="ts">
import { ref } from 'vue'
import TabManager from './TabManager.vue'
import TabPane from './TabPane.vue'

const n = ref(4)
const currentTab = ref(0)
</script>

<template>
  <h1>Tab system</h1>

  <label>
    Total tabs ({{ n }})
    <br />
    <input v-model.number="n" data-test="current-tab" type="range" min="0" max="10" />
  </label>

  <div>Selected Tab: {{ currentTab }}</div>

  <hr />

  <div>
    <TabManager>
      <TabPane v-for="i in n" :key="i" data-test="tab-pane" :title="`Tab ${i} / ${n}`">
        <h2>This is Tab {{ i }}</h2>
      </TabPane>
    </TabManager>
  </div>
</template>
