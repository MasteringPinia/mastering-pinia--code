<script lang="ts" setup>
import { useCurrentContact } from './stores/currentContact'
import ContactCard from '~/components/ContactCard.vue'

const currentContact = useCurrentContact()
</script>

<template>
  <h1>Contact {{ currentContact.id }}</h1>
  <input v-model.number="currentContact.id" type="number" />
  <ContactCard v-if="currentContact.current" :contact="currentContact.current" />
  <p v-else>No contact loaded</p>
</template>
