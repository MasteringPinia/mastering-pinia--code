<script lang="ts" setup>
import { useElapsedTime } from '@/utils'
import { type TodoTaskWithTodo } from '@/api/todos'

const props = defineProps<{
  task: TodoTaskWithTodo
}>()

const currentTimeSpent = useElapsedTime(() => props.task.createdAt)
const totalTimeSpent = useElapsedTime(() => props.task.createdAt - props.task.totalTime)
</script>

<template>
  <p data-test="task-active">Your current task is "{{ task.todo.text }}"</p>
  <p>
    You have spent a total of <b>{{ totalTimeSpent }}</b> on this task.
    <br />
    Since you last started this task, you spent
    <b>{{ currentTimeSpent }}</b
    >.
  </p>
</template>
