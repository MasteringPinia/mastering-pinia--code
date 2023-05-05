<script lang="ts" setup>
import { useDango } from './dango'

const dango = useDango()
</script>

<template>
  <h1>Let's eat some Dango 🍡</h1>

  <button data-test="btn-eat" :disabled="dango.amount < 1 || dango.isEating" class="mr-1" @click="dango.eatDango()">
    Eat!
  </button>
  <button
    data-test="btn-start-eating"
    class="mr-1"
    :disabled="dango.isEating || dango.amount < 1"
    @click="dango.startEating()"
  >
    Start Eating until finished
  </button>
  <button data-test="btn-stop-eating" :disabled="!dango.isEating" @click="dango.stopEating()">Stop eating</button>

  <!-- You won't need to change any of the classes of these elements -->
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
