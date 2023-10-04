<script lang="ts" setup>
import { ref } from 'vue'
import { useTasksStore } from './stores/tasks'
import { useTodosStore } from './stores/todos'

const todosStore = useTodosStore()
const tasksStore = useTasksStore()

const todoText = ref('')
function addTodo() {
  todosStore.addTodo(todoText.value)
  todoText.value = ''
}
</script>

<template>
  <h1>Task Management</h1>

  <nav>
    <RouterLink to="/6/2/1-refactoring-stores/some-test">Some Test</RouterLink>
  </nav>

  <form class="space-x-2" @submit.prevent="addTodo()">
    <input v-model="todoText" type="text" />
    <button>Add Todo</button>
  </form>

  <ul>
    <li v-for="todo in todosStore.todos" :key="todo.id">
      <TodoItem :todo="todo" @update="todosStore.updateTodo" @delete="todosStore.removeTodo($event.id)" />
    </li>
  </ul>

  <pre>{{ todosStore.$state }}</pre>
  <pre>{{ tasksStore.$state }}</pre>
</template>
