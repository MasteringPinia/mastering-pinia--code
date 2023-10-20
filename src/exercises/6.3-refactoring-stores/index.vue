<script lang="ts" setup>
import { ref } from 'vue'
import TodoItem from './components/TodoItem.vue'
import { useTasksStore } from './stores/tasks'
import { useTodosStore } from './stores/todos'

const todos = useTodosStore()
const tasksStore = useTasksStore()

const todoText = ref('')
function addTodo() {
  todos.add(todoText.value)
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

  <ClientOnly>
    <ul>
      <li v-for="todo in todos.list" :key="todo.id">
        <TodoItem
          :todo="todo"
          @update="todos.update"
          @delete="todos.remove($event.id)"
          @start="tasksStore.startTodo($event.id)"
        />
      </li>
    </ul>

    <pre>{{ todos.$state }}</pre>
    <pre>{{ tasksStore.$state }}</pre>
  </ClientOnly>
</template>
