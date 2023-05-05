import { defineStore } from 'pinia'

export const useDangoShop = defineStore('2.3.1 store-state', {
  state: () => ({ amount: 0 }),
})

// Do not change this value, you will need it
const DANGO_PRICE = 350
