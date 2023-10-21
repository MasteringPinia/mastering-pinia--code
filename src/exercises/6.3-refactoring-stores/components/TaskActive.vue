<script lang="ts" setup>
import { computed } from 'vue'
import { TodoTaskActive, useTasksStore } from '../stores/tasks'
import { useTodosStore } from '../stores/todos'
import { useTimeAgo } from '@vueuse/core'

const props = defineProps<{
  task: TodoTaskActive
}>()

const todos = useTodosStore()
const tasks = useTasksStore()
const taskTodo = computed(() => todos.list.find(todo => todo.id === props.task.id))

const activeTimeSpent = useTimeAgo(
  //
  () => props.task.start - props.task.totalTime,
  {
    showSecond: true,
    rounding: 'floor',
    updateInterval: 1000,
  },
)

const timeSpent = computed(() => {
  return tasks.activeTask?.id === props.task.id ? activeTimeSpent.value : 0
})
</script>

<template>
  <p>Your current task is "{{ taskTodo?.text }}"</p>
  <p>You have spent a total of {{ timeSpent }} on this task. {{ activeTimeSpent }} since you last started this task.</p>
</template>
