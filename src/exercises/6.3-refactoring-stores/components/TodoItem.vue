<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useTasksStore } from '../stores/tasks'
import { TodoItem } from '@/api/todos'
import { formatTime } from '@/utils'

const props = defineProps<{
  todo: TodoItem
}>()

const emit = defineEmits<{
  (e: 'update', todo: TodoItem): void
  (e: 'delete', todo: TodoItem): void
  (e: 'start', todo: TodoItem): void
  (e: 'pause', todo: TodoItem): void
}>()

// null when not editing, otherwise a copy of the todo
const todoCopy = ref<TodoItem | null>(null)
function startEdit() {
  todoCopy.value = { ...props.todo }
}

function saveTodo() {
  emit('update', todoCopy.value!)
  todoCopy.value = null
}

const tasks = useTasksStore()

const isTaskStarted = computed(() => tasks.isTodoStarted(props.todo.id))
const finishedTask = computed(() => tasks.finishedTasks.find(t => t.id === props.todo.id))
</script>

<template>
  <div>
    <form v-if="todoCopy" class="mb-0 space-x-2" @submit.prevent="saveTodo">
      <input v-model="todoCopy.text" type="text" />
      <button @click="saveTodo">Save</button>
      <button type="button" @click="todoCopy = null">Cancel</button>
    </form>
    <div v-else class="mb-0 space-x-2">
      <span :class="{ 'line-through': todo.finished, 'text-gray': todo.finished }">{{ todo.text }}</span>
      <template v-if="tasks.activeTask?.id === todo.id">
        <button @click="tasks.pauseCurrentTodo()">Pause Task</button>
        <button @click="tasks.finishCurrentTodo()">Finish Task</button>
      </template>
      <template v-else>
        <template v-if="!finishedTask">
          <button @click="startEdit">Edit</button>
          <button v-if="!isTaskStarted" @click="emit('delete', todo)">Delete</button>
          <button v-if="isTaskStarted" @click="tasks.startTodo(todo.id)">Resume Task</button>
          <button v-else @click="tasks.startTodo(todo.id)">Start Task</button>
        </template>
        <span v-else
          ><i
            >Finished
            <time :datetime="new Date(finishedTask.end).toISOString()">{{
              new Date(finishedTask.end).toDateString()
            }}</time>
            in {{ formatTime(finishedTask.totalTime) }}.</i
          ></span
        >
      </template>
    </div>
  </div>
</template>
