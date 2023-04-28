<script lang="ts" setup>
import { useDangoShop } from './dango-shop'

const dangoShop = useDangoShop()
</script>

<template>
  <h1>Dango Shop 🍡</h1>

  <button data-test="btn-add" class="mx-2" :disabled="dangoShop.cartAmount >= 100" @click="dangoShop.cartAmount++">
    More 🍡
  </button>
  <button data-test="btn-remove" :disabled="dangoShop.cartAmount < 1" @click="dangoShop.cartAmount--">
    Remove one 🍡
  </button>

  <!-- You don't need to change this line -->
  <DangoShopMessages231 />

  <template v-if="dangoShop.cartAmount >= 50">
    <p data-test="msg-huge-order">Are you sure? That's a <b>huge</b> order 😅.</p>
    <button data-test="btn-reset" @click="dangoShop.cartAmount = 0">Let's start over</button>
  </template>

  <!-- You won't need to change any of the classes of these elements -->
  <section data-test="dangos" class="grid lg:grid-cols-5 grid-cols-3 pt-[100px] pl-[40px] pr-[200px]">
    <div v-for="i in dangoShop.cartAmount" :key="i" class="w-1/3 h-[50px] rotate-[262deg] origin-center">
      <DangoStick231 />
    </div>
  </section>
</template>
