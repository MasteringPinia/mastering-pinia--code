<script lang="ts" setup>
import { computed } from 'vue'
import type { Contact } from '@/api/contacts'

const props = defineProps<{ contact: Contact }>()

const fullName = computed(() => `${props.contact.firstName} ${props.contact.lastName}`)
</script>

<template>
  <div class="space-y-6">
    <img class="w-40 h-40 mx-auto rounded-full" :src="contact.avatar" />
    <div class="space-y-2">
      <div class="space-y-1 font-medium leading-6 text-center">
        <h3 class="leading-snug text-md">{{ fullName }}</h3>
        <p class="m-0 text-sm">{{ contact.job }}</p>
      </div>
    </div>
  </div>
</template>
