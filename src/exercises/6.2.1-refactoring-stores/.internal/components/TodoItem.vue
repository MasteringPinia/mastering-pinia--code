<script lang="ts" setup>
import { computed, ref } from 'vue'
import { TodoItem } from '../../stores/todos'

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
</script>

<template>
  <div>
    <form v-if="todoCopy" class="space-x-2 mb-0" @submit.prevent="saveTodo">
      <input v-model="todoCopy.text" type="text" />
      <button @click="saveTodo">Save</button>
      <button type="button" @click="todoCopy = null">Cancel</button>
    </form>
    <div v-else class="space-x-2 mb-0">
      <span :class="{ 'line-through': todo.finished, 'text-gray': todo.finished }">{{ todo.text }}</span>
      <button @click="startEdit">Edit</button>
      <button @click="emit('delete', todo)">Delete</button>
    </div>
  </div>
</template>
