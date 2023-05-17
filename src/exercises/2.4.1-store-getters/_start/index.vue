<script lang="ts" setup>
import { useDangoShop } from './dango-shop'

const dangoShop = useDangoShop()
</script>

<template>
  <h1>Dango Shop 🍡</h1>

  <button data-test="btn-add" class="mx-2" :disabled="dangoShop.amount >= 100" @click="dangoShop.amount++">
    More 🍡
  </button>
  <button data-test="btn-remove" :disabled="dangoShop.amount < 1" @click="dangoShop.amount--">Remove one 🍡</button>

  <DangoShopMessages241>
    <!-- You will only need to display new things here -->
    You are ordering {{ dangoShop.amount }} dango{{ dangoShop.amount > 1 ? 's' : '' }}. That would be a total of
    <span class="line-through">¥700</span>
    <span class="font-bold">¥650</span>
    . You are saving ¥50 with our special offer.
  </DangoShopMessages241>

  <!-- You won't need to change any of the classes of these elements -->
  <section data-test="dangos" class="grid lg:grid-cols-5 grid-cols-3 pt-[100px] pl-[40px] pr-[200px]">
    <div v-for="i in dangoShop.amount" :key="i" class="w-1/3 h-[50px] rotate-[262deg] origin-center">
      <DangoStick241 />
    </div>
  </section>
</template>
