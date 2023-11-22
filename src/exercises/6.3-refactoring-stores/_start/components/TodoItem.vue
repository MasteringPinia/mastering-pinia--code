<script lang="ts" setup>
import { computed, ref } from 'vue'
import { type TodoItem } from '@/api/todos'
import { formatTime } from '@/utils'
import { useTodosStore } from '../stores/todos'

const props = defineProps<{
  todo: TodoItem
}>()

const emit = defineEmits<{
  (e: 'update', todo: TodoItem): void
  (e: 'delete', todo: TodoItem): void
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

const todos = useTodosStore()

const isTaskStarted = computed(() => todos.isTodoStarted(props.todo.id))
const finishedTask = computed(() => todos.finishedTasks.find(t => t.todoId === props.todo.id))
</script>

<template>
  <div>
    <form v-if="todoCopy" class="mb-0 space-x-2" data-test="todo-edit" @submit.prevent="saveTodo">
      <input v-model="todoCopy.text" type="text" />
      <button @click="saveTodo">Save</button>
      <button type="button" @click="todoCopy = null">Cancel</button>
    </form>
    <div v-else class="mb-0 space-x-2">
      <span data-test="todo-text" :class="{ 'line-through': todo.finished, 'text-gray': todo.finished }">{{
        todo.text
      }}</span>
      <template v-if="todos.activeTask?.todoId === todo.id">
        <button data-test="todo-btn-pause" @click="todos.pauseCurrentTodo()">Pause Task</button>
        <button data-test="todo-btn-finish" @click="todos.finishCurrentTodo()">Finish Task</button>
      </template>
      <template v-else>
        <template v-if="!finishedTask">
          <button data-test="todo-btn-start-edit" @click="startEdit">Edit</button>
          <button v-if="!isTaskStarted" data-test="todo-btn-delete" @click="emit('delete', todo)">Delete</button>
          <button v-if="isTaskStarted" data-test="todo-btn-resume-todo" @click="todos.startTodo(todo.id)">
            Resume Task
          </button>
          <button v-else data-test="todo-btn-start-todo" @click="todos.startTodo(todo.id)">Start Task</button>
        </template>
        <span v-else-if="finishedTask.end"
          ><i data-test="todo-finished-info"
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
