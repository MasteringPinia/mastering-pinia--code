<script lang="ts" setup>
import { ref } from 'vue'
import TodoItem from './components/TodoItem.vue'
import TaskActive from './components/TaskActive.vue'
import { useTasksStore } from './stores/tasks'
import { useTodosStore } from './stores/todos'

const todos = useTodosStore()
const tasks = useTasksStore()

const todoText = ref('')
function addTodo() {
  todos.add(todoText.value)
  todoText.value = ''
}
</script>

<template>
  <h2>Todo Manager</h2>

  <!--
    NOTE: we need to wrap this in a ClientOnly component because we are using local storage
    and without it, it creates a hydration mismatch error.
  -->
  <ClientOnly>
    <section>
      <h3>Current Task</h3>

      <TaskActive v-if="tasks.activeTaskWithTodo" :task="tasks.activeTaskWithTodo" />
    </section>

    <form class="space-x-2" data-test="add-todo" @submit.prevent="addTodo()">
      <input v-model="todoText" type="text" />
      <button>Add Todo</button>
    </form>

    <h3>Todo List</h3>

    <ul data-test="todo-list">
      <li v-for="todo in todos.list" :key="todo.id">
        <TodoItem :todo="todo" @update="todos.update" @delete="todos.remove($event.id)" />
      </li>
    </ul>
  </ClientOnly>
</template>
