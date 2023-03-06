import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref, shallowRef, watch } from 'vue'
import { Contact, getContactById } from '~/api/contacts'

export const useCurrentContact = defineStore('currentContact', {
  state: () => ({
    id: 1,
    current: null as Contact | null,
  }),
  actions: {
    async refreshContact() {
      this.current = await getContactById(this.id)
    },
  },

  watch: {
    id: {
      action: 'refreshContact',
      immediate: true,
    },
  },
})

// in setup stores we can do this
const useContactsStore = defineStore('store that can watch', () => {
  const id = ref(0)
  const current = shallowRef<Contact | null>(null)

  async function refreshContact() {
    current.value = await getContactById(id.value)
  }

  watch(id, refreshContact)

  return {
    id,
    current,
    refreshContact,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useContactsStore, import.meta.hot))
}
