<script lang="ts" setup>
import { useDango } from '../../dango'

const dango = useDango()
</script>

<template>
  <section data-test="dangos" class="grid grid-cols-3 pt-8 pb-32">
    <div class="">
      <template v-if="dango.amount > 1">
        <div v-for="i in dango.amount - 1" :key="i" class="h-[56px] -mb-[38px] animate__animated animate__bounceIn">
          <DangoStick251 class="rotate-[262deg] translate-y-[-28px]" />
        </div>
      </template>
    </div>

    <div class="">
      <div v-if="dango.amount > 0" :key="dango.amount" class="h-[56px] -mb-[38px] animate__animated animate__bounceIn">
        <DangoStick251 :dango="3 - (dango.eatenBalls % 3)" />
      </div>
    </div>

    <div class="">
      <div v-for="i in dango.finishedSticks" :key="i" class="h-[56px] -mb-[46px] animate__animated animate__bounceIn">
        <DangoStick251 :dango="0" class="rotate-[-262deg] translate-y-[-28px]" />
      </div>
    </div>
  </section>
</template>
