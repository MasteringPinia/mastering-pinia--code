<script lang="ts" setup>
import { getContactById } from '~/api/contacts'
import { useAsyncData } from './useAsyncData'
import { ref } from 'vue'
import AppPagination from '~/components/AppPagination.vue'
import ContactCard from '~/components/ContactCard.vue'

const contactId = ref(1)
const { data, error, isPending, trigger } = useAsyncData(() => getContactById(contactId.value - 1))
</script>

<template>
  <h1>Contact Fetching</h1>

  <AppPagination v-model:currentPage="contactId" :total="1000" :per-page="1" />

  <ContactCard v-if="data" :contact="data" />
</template>
