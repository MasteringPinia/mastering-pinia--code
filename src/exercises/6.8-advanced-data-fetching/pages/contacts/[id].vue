<script lang="ts" setup>
import ContactCard from '../../ContactCard.vue'
import { getContactById, updateContact } from '@/api/contacts'
import { useRoute } from 'vue-router/auto'

const route = useRoute('/0.0-advanced-data-fetching/contacts/[id]')
const {
  data: contact,
  error,
  isLoading,
} = useQuery({
  // TODO: add function syntax
  key: 'contact-detail',
  fetcher: () => getContactById(route.params.id),
})
</script>

<template>
  <AppModal id="contact-details" model-value @close="$router.push('./')">
    <section class="pt-6">
      <ContactCard v-if="contact" :key="contact.id" :contact="contact" @update:contact="updateContact" />
    </section>
  </AppModal>
</template>
