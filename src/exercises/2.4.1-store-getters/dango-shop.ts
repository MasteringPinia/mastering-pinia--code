import { acceptHMRUpdate, defineStore } from 'pinia'

export const useDangoShop = defineStore('2.4.1 store-getters', {
  state: () => ({
    amount: 0,
  }),

  getters: {
    totalPrice: state => state.amount * DANGO_PRICE,

    discountedPrice(): number {
      if (this.amount < 3) return this.totalPrice
      if (this.amount < 5) return Math.ceil(this.totalPrice * 0.9)
      if (this.amount < 10) return Math.ceil(this.totalPrice * 0.85)
      return Math.ceil(this.totalPrice * 0.8)
    },

    hasPriceDiscount: state => state.amount >= 3,

    savedMoney(): number {
      return this.totalPrice - this.discountedPrice
    },
  },
})

// Do not change this value
const DANGO_PRICE = 350

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDangoShop, import.meta.hot))
}
