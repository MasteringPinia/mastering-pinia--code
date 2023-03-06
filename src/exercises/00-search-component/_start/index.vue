<script lang="ts" setup>
import { searchContacts as _searchContacts } from '~/api/contacts'
import SearchPaginator from './SearchPaginator.vue'
// You can display a contact with this component
// import ContactCard from '~/components/ContactCard.vue'

// stick to this version to simplify the search call
function searchContacts(searchText: string, page: number) {
  return _searchContacts(searchText, page, {
    // How many is a good amount?
    // perPage: ??,
  })
}
</script>

<template>
  <div>
    <SearchPaginator>
      <!-- This is a proposed design, we still need to get the results from somewhere -->
      <ul role="list" class="p-0 mx-auto my-0 space-y-16 sm:grid sm:grid-cols-2 sm:gap-16 sm:space-y-0 lg:grid-cols-3">
        <!--
          Hmm 🤔
        -->
        <li class="m-0"></li>
      </ul>
    </SearchPaginator>
  </div>
</template>
