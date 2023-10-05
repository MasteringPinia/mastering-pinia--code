<script lang="ts" setup>
import { ref, toRef, toRefs } from 'vue'
import { useTodosStore } from '../../stores/todos'
import { storeToRefs } from 'pinia'

const todos = useTodosStore()

const { list } = toRefs(todos)
const { finished } = storeToRefs(todos)
const { add } = toRefs(todos)
const update = toRef(todos, 'update')

const text = ref('')
function addTodo() {
  if (!text.value) return
  useTodosStore().add(text.value)
  text.value = ''
}
</script>

<template>
  <!-- 🚨 Do not modify the template, only the script must be changed in this exercise -->

  <ClientOnly>
    <main>
      <h2>Destructuring stores (2)</h2>

      <form class="space-x-2" @submit.prevent="addTodo()">
        <input v-model="text" type="text" />
        <button>Add</button>
      </form>

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
