<script lang="ts" setup>
import { useTasksStore } from './stores/tasks'
import { useTodosStore } from './stores/todos'

const todosStore = useTodosStore()
const tasksStore = useTasksStore()
</script>

<template>
  <h1>Task Management</h1>

  <nav>
    <RouterLink to="/6/2/1-refactoring-stores/some-test">Some Test</RouterLink>
  </nav>

  <pre>{{ todosStore.$state }}</pre>
  <pre>{{ tasksStore.$state }}</pre>
</template>
