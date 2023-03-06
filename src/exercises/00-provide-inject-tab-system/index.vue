<script setup lang="ts">
import { ref } from 'vue'
import TabManager from './TabManager.vue'
import TabPane from './TabPane.vue'

const n = ref(4)

const currentTab = ref(0)
// We could also connect the currentTab to the route
// const routeTab = useRouteQuery<string>('tab', '', { mode: 'push' })
// const currentTab = computed<number>({
//   get: () => Number(routeTab.value) || 0,
//   set(tab) {
//     routeTab.value = String(tab)
//   },
// })
</script>

<template>
  <h1>Tab system</h1>

  <label>
    Total tabs ({{ n }})
    <br />
    <input v-model.number="n" type="range" min="0" max="10" />
  </label>

  <div>Selected Tab: {{ currentTab }}</div>

  <hr />

  <div>
    <TabManager v-model="currentTab">
      <TabPane v-for="i in n" :key="i" :title="`Tab n ${i} / ${n}`">
        <h2>This is Tab {{ i }}</h2>
      </TabPane>
    </TabManager>
  </div>
</template>
