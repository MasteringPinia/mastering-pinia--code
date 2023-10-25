<script lang="ts" setup>
import { computed } from 'vue'
import { useTodosStore } from '../stores/todos'
import { useElapsedTime } from '@/utils'
import { type TodoTask } from '@/api/todos'

const props = defineProps<{
  task: TodoTask
}>()

const todos = useTodosStore()
const taskTodo = computed(() => todos.list.find(todo => todo.id === props.task.id))

const currentTimeSpent = useElapsedTime(() => props.task.createdAt)
const totalTimeSpent = useElapsedTime(() => props.task.createdAt - props.task.totalTime)
</script>

<template>
  <p>Your current task is "{{ taskTodo?.text }}"</p>
  <p>
    You have spent a total of <b>{{ totalTimeSpent }}</b> on this task.
    <br />
    Since you last started this task, you spent
    <b>{{ currentTimeSpent }}</b
    >.
  </p>
</template>
