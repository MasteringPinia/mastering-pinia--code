<script lang="ts" setup>
import { computed } from 'vue'
import { useDangoShop } from '../../dango-shop'

const dangoShop = useDangoShop()

const discount = computed(() => {
  if (dangoShop.amount >= 10) return 20
  if (dangoShop.amount >= 5) return 15
  if (dangoShop.amount >= 3) return 10
  return 0
})
</script>

<template>
  <p v-if="dangoShop.amount >= 100">That's all the dango I have 😱</p>
  <hr />

  <ul class="my-6">
    <li :class="{ 'opacity-50': discount > 10 }">
      <span :class="{ 'line-through': discount >= 10 }">Buy 3 to get 10% </span>
      <span v-if="discount === 10">✅</span>
    </li>
    <li :class="{ 'opacity-50': discount > 15 }">
      <span :class="{ 'line-through': discount >= 15 }">Buy 5 to get 15% </span>
      <span v-if="discount === 15">✅</span>
    </li>
    <li :class="{ 'opacity-50': discount > 20 }">
      <span :class="{ 'line-through': discount >= 20 }">Buy 10 to get 20% </span>
      <span v-if="discount === 20">✅</span>
    </li>
  </ul>

  <hr />

  <p v-if="dangoShop.amount < 1">
    <i title="Welcome to the shop in Japanese" class="underline">irasshaimase</i>! How many dango do you want?
  </p>
  <p v-else>
    <span data-test="price-message">
      <slot></slot>
    </span>
    <template v-if="dangoShop.amount >= 25 && dangoShop.amount < 50">
      <br />
      Are you buying for everybody in line? 👀
    </template>
  </p>

  <template v-if="dangoShop.amount >= 50">
    <p data-test="msg-huge-order">Are you sure? That's a <b>huge</b> order 😅.</p>
    <button data-test="btn-reset" @click="dangoShop.amount = 0">Let's start over</button>
  </template>
</template>
