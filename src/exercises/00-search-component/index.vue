<script lang="ts" setup>
import { searchContacts as _searchContacts } from '~/api/contacts'
import SearchPaginator from './SearchPaginator.vue'
import ContactCard from '~/components/ContactCard.vue'

function searchContacts(searchText: string, page: number) {
  return _searchContacts(searchText, page, {
    perPage: 12,
  })
}
</script>

<template>
  <div>
    <SearchPaginator :api-method="searchContacts">
      <template v-slot="{ results }">
        <ul
          role="list"
          class="p-0 mx-auto my-0 space-y-16 sm:grid sm:grid-cols-2 sm:gap-16 sm:space-y-0 lg:grid-cols-3"
        >
          <li v-for="contact in results" :key="contact.id" class="m-0">
            <ContactCard :contact="contact" />
          </li>
        </ul>
      </template>
    </SearchPaginator>
  </div>
</template>
