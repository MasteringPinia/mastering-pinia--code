import { acceptHMRUpdate, defineStore } from 'pinia'
import { shallowRef } from 'vue'
import { Contact, getAllContacts } from '~/api/contacts'

export const useContactsStore = defineStore('contacts', () => {
  const list = shallowRef<Contact[]>([])

  async function refresh() {
    list.value = await getAllContacts()
    return list.value.length
  }

  function failAction() {
    throw new Error('This action failed.')
  }

  return {
    refresh,
    failAction,
    list,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useContactsStore, import.meta.hot))
}
