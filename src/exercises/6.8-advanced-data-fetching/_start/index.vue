<script lang="ts" setup>
import { getAllContacts } from '@/api/contacts'
import { useFuse } from '@vueuse/integrations/useFuse'
import { useQuery } from './use-query'
import { useRouter, useRoute } from 'vue-router/auto'
import { watchDebounced } from '@vueuse/core'
import { useRouteQuery } from '@vueuse/router'

const { data: contactList, isFetching } = useQuery({
  key: 'contacts',
  query: () => getAllContacts(),
})

const searchText = useRouteQuery('search', '', {
  mode: 'push',
})
const { results } = useFuse(searchText, () => contactList.value || [], {
  fuseOptions: {
    keys: ['firstName', 'lastName', 'bio'],
  },
  matchAllWhenSearchEmpty: true,
})

// after one second of having only one result, we navigate to it
const router = useRouter()
const route = useRoute('/6.8-advanced-data-fetching/')
watchDebounced(
  () => results.value.length,
  length => {
    if (length === 1) {
      router.push({
        name: '/6.8-advanced-data-fetching//[id]',
        params: {
          id: results.value[0].item.id,
        },
        query: {
          ...route.query,
        },
      })
    }
  },
  { debounce: 1000 },
)

// TODO: tip in tests if they are reading data, error or other as they are computed properties, on the server they won't
// update so they will keep their initial undefined value
</script>

<template>
  <main class="big-layout">
    <h1 class="mb-12">📇 My Contacts</h1>

    <div class="contacts-search">
      <div>
        <form class="space-x-2" @submit.prevent>
          <input v-model="searchText" autofocus type="search" placeholder="Eduardo" />
          <!-- NOTE: ensure no fetch is done on client while hydrating or this will cause
           a Hydration mismatch -->
          <div v-if="isFetching"><span class="spinner"></span><span> Fetching</span></div>
        </form>

        <ul>
          <li v-for="{ item: contact } in results" :key="contact.id">
            <RouterLink
              :to="{
                name: '/6.8-advanced-data-fetching//[id]',
                params: { id: contact.id },
              }"
            >
              <img v-if="contact.photoURL" :src="contact.photoURL" class="rounded-full inline-block w-8" />
              {{ contact.firstName }} {{ contact.lastName }}
            </RouterLink>
          </li>
        </ul>
      </div>

      <RouterView />
    </div>
  </main>
</template>
