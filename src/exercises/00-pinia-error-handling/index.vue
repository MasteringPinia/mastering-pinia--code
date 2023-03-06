<script lang="ts" setup>
import { useContactsStore } from './stores/contacts'

const contacts = useContactsStore()
</script>

<template>
  <h1>Contact list</h1>
  <p>We have {{ contacts.list.length }} contacts.</p>

  <button @click="contacts.refresh()">Refresh contacts</button>
  <button @click="contacts.failAction()">Fail Action</button>
</template>
