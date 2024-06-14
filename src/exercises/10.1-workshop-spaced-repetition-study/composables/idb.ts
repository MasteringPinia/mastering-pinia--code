import { openDB, type IDBPDatabase } from 'idb'
import { useStorageAsync } from '@vueuse/core'
import { defineStore, skipHydrate } from 'pinia'
import { onScopeDispose, shallowRef } from 'vue'

export interface UsePersistedValueOptions<T> {
  initialValue: () => T
}

export function usePersistedValue<T>(key: string, options: UsePersistedValueOptions<T>) {
  const { initialValue } = options
  const store = useIDBStore()
  const storeKey = 'store'
  const data = useStorageAsync<T>(
    key,
    initialValue,
    {
      async getItem(key) {
        const db = await store.ensureDB()
        return db.get(storeKey, key)
      },
      async setItem(key, value) {
        const db = await store.ensureDB()
        await db.put(storeKey, value, key)
      },
      async removeItem(key) {
        const db = await store.ensureDB()
        return db.delete(storeKey, key)
      },
    },
    {},
  )

  return data
}

const useIDBStore = defineStore('idb', () => {
  const db = skipHydrate(shallowRef<IDBPDatabase>())

  const dbPromise = openDB('my-db', 1, {}).then(idb => (db.value = idb))

  async function ensureDB(): Promise<IDBPDatabase> {
    return db.value || dbPromise
  }

  onScopeDispose(async () => {
    const db = await ensureDB()
    db.close()
  })

  return { db, ensureDB }
})
