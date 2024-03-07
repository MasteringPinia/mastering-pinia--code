<script lang="ts" setup>
import ContactCard from '../../ContactCard.vue'
import { getContactById, updateContact as _updateContact } from '@/api/contacts'
import { useRoute } from 'vue-router/auto'
import { useQuery } from '../../use-query'
import { useMutation } from '../../use-mutation'

const route = useRoute('/6.8-advanced-data-fetching//[id]')
const { data: contact } = useQuery({
  key: () => 'contacts/' + route.params.id,
  query: () => getContactById(route.params.id),
})

const { mutate: updateContact } = useMutation({
  keys: ['contacts', ({ variables: [{ id }] }) => 'contacts/' + id],
  mutation: _updateContact,
})
</script>

<template>
  <section class="pt-6">
    <ContactCard v-if="contact" :key="contact.id" :contact="contact" @update:contact="updateContact" />
  </section>
</template>
