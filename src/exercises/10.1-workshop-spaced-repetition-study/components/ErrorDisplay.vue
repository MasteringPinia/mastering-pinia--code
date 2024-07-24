<script lang="ts" setup>
import { MandeError } from 'mande'
import { computed } from 'vue'
import { ZodError } from 'zod'

const props = withDefaults(
  defineProps<{
    error: MandeError<{ code: number; msg: string }> | ZodError | Error
    debug?: boolean
  }>(),
  {
    debug: () => import.meta.env.DEV,
  },
)

const formattedError = computed<{
  title: string
  description: string | string[]
}>(() => {
  const error = props.error
  if (error instanceof ZodError) {
    const title = error.issues.length < 2 ? 'Validation Error' : `${error.issues.length} Validation Errors`

    return {
      title,
      description: error.issues.map(issue => issue.path.join('.') + ': ' + issue.message),
    }
  }

  if (error instanceof Error && 'body' in error) {
    return {
      title: `Network Error (${error.body.code})`,
      description: error.body.msg,
    }
  }
  return {
    title: 'Error',
    description: error.message,
  }
})
</script>

<template>
  <details v-if="error" class="bg-red-200 dark:bg-red-950" open>
    <summary class="text-red-900 dark:text-red-100">{{ formattedError.title }}</summary>

    <ul v-if="Array.isArray(formattedError.description)">
      <li v-for="text in formattedError.description">{{ text }}</li>
    </ul>
    <p v-else>{{ formattedError.description }}</p>

    <pre v-if="debug && error.stack">{{ error.stack }}</pre>
  </details>
</template>
