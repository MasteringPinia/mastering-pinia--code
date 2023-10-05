<script lang="ts" setup>
import { computed, ref, toRef, watch } from 'vue'
import { useTodosStore } from '../../stores/todos'
import { storeToRefs } from 'pinia'
import { useTimeAgo } from '@vueuse/core'

const todos = useTodosStore()

const { list, finished } = storeToRefs(todos)
const { add, update } = todos

const text = ref('')
function addTodo() {
  if (!text.value) return
  add(text.value)
  text.value = ''
}

const lastAdded = useTimeAgo(
  computed(
    () =>
      toRef(todos, 'mostRecent').value?.createdAt ||
      // this is just to avoid an undefined value
      Date.now(),
  ),
  {
    showSecond: true,
    rounding: 'floor',
    updateInterval: 1000,
  },
)

const todoListChanges = ref(0)
watch(
  todos,
  () => {
    todoListChanges.value++
  },
  { deep: false },
)
</script>

<template>
  <!-- 🚨 Do not modify the template, only the script must be changed in this exercise -->

  <ClientOnly>
    <main>
      <h2>Performance (1)</h2>

      <p>
        The list of todos have been changed {{ todoListChanges }} time(s). Try marking the same todo as finished
        multiple times...
      </p>

      <p v-if="list.length">The most recent todo was added {{ lastAdded }}.</p>

      <form class="space-x-2" @submit.prevent="addTodo()">
        <input v-model="text" type="text" />
        <button>Add</button>
      </form>

      <p>You have {{ list.length }} todos. {{ finished.length }} are finished.</p>

      <div v-if="list.length > 20">
        <p>That's a lot of todos... {{ list.length }} to be precise. Do you want to remove them all?</p>
        <button @click="list = []">Clear the todo list</button>
      </div>

      <ul>
        <li v-for="todo in list">
          <span class="mr-2" :class="todo.finished && 'line-through'">{{ todo.text }}</span>
          <button title="Finish this todo" @click="update({ ...todo, finished: true })">✔️</button>
        </li>
      </ul>
    </main>
  </ClientOnly>
</template>
