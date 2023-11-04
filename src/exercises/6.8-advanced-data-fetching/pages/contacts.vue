<script lang="ts" setup>
import { getAllContacts } from '@/api/contacts'
import { useFuse } from '@vueuse/integrations/useFuse'
import { ref } from 'vue'
import { useQuery } from '../use-query'

const { data: contactList } = useQuery({
  key: 'contacts',
  fetcher: () => getAllContacts(),
})

const searchText = ref('')
const { results } = useFuse(searchText, () => contactList.value || [], {
  fuseOptions: {
    keys: ['firstName', 'lastName', 'bio'],
  },
  matchAllWhenSearchEmpty: true,
})

// TODO: tip in tests if they are reading data, error or other as they are computed properties, on the server they won't
// update so they will keep their initial undefined value
</script>

<template>
  <main>
    <h1>📇 My Contacts</h1>

    <form class="space-x-2" @submit.prevent>
      <input v-model="searchText" type="search" />
      <button>Search</button>
    </form>

    <ul>
      <li v-for="{ item: contact } in results" :key="contact.id">
        <RouterLink
          :to="{
            name: '/6.8-advanced-data-fetching/contacts/[id]',
            params: {
              id: contact.id,
            },
          }"
        >
          <img v-if="contact.photoURL" :src="contact.photoURL" class="rounded-full inline-block w-8" />
          {{ contact.firstName }} {{ contact.lastName }}
        </RouterLink>
      </li>
    </ul>

    <RouterView />
  </main>
</template>
