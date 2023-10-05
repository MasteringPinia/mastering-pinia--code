<script lang="ts" setup>
import { ref } from 'vue'
import { useTodosStore } from '../../stores/todos'
import { storeToRefs } from 'pinia'

// NOTE: failing cases to keep in starter
// const { list, finished, add, update } = useTodosStore()
// const { list, finished, add, update } = toRefs(todos)

const todos = useTodosStore()
const { add, update } = todos
const { list, finished } = storeToRefs(todos)

const text = ref('')
function addTodo() {
  if (!text.value) return
  add(text.value)
  text.value = ''
}
</script>

<template>
  <!-- 🚨 Do not modify the template, only the script must be changed in this exercise -->

  <ClientOnly>
    <main>
      <h3>Destructuring stores (1)</h3>

      <p>Try adding some tasks.</p>

      <form class="space-x-2" @submit.prevent="addTodo()">
        <input v-model="text" type="text" />
        <button>Add</button>
      </form>

      <!-- NOTE: the finished isn't updating -->
      <p>You have {{ list.length }} todos. {{ finished.length }} are finished.</p>

      <ul>
        <li v-for="todo in list">
          <span class="mr-2" :class="todo.finished && 'line-through'">{{ todo.text }}</span>
          <button title="Finish this todo" @click="update({ ...todo, finished: true })">✔️</button>
        </li>
      </ul>
    </main>
  </ClientOnly>
</template>
