<script lang="ts" setup>
import { getStatusIcon, useTestStatus } from '~/api/.internal/testing'
import { ref } from 'vue'

const {
  //
  rerun,
  currentRunningTests,
  hasTests,
  currentPassingTests,
  currentFailingTests,
  currentResult,
  title,
} = useTestStatus()

const isEnlarged = ref(false)

function enlarge() {
  isEnlarged.value = !isEnlarged.value
}
</script>

<template>
  <transition name="slide" mode="out-in">
    <section
      v-if="hasTests"
      id="test-runner"
      :key="title"
      class="fixed z-50 m-0 overflow-scroll border border-gray-800 rounded-lg dark:border-gray-300 bg-gray-50 dark:bg-gray-900 bottom-10 left-4"
      :class="[isEnlarged ? 'right-4 top-10 bg-opacity-75 dark:bg-opacity-70' : 'w-72 max-h-72']"
    >
      <h3
        class="sticky top-0 z-30 flex px-3 py-1 m-0 text-sm font-bold border-b-2 border-solid border-light-100 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-900/30"
        :class="[isEnlarged ? '' : 'backdrop-blur']"
      >
        <span class="mr-2">{{ currentResult }}</span>
        <span>{{ title }}</span>
        <span class="flex-grow"></span>
        <a href="#" role="button" title="Rerun tests" @click="rerun">▶️</a>
        <a href="#" role="button" :title="isEnlarged ? 'Collapse' : 'Enlarge'" @click="enlarge">{{
          isEnlarged ? '↙' : '↗️'
        }}</a>
      </h3>

      <div class="text-xs">
        <div v-if="currentFailingTests.length" key="failing">
          <span
            class="sticky z-20 block px-2 mt-1 top-[30px] bg-gray-50/30 dark:bg-gray-900/30"
            :class="[isEnlarged ? '' : 'backdrop-blur']"
            >Failing tests</span
          >
          <ul class="w-full p-0 pl-3 mb-0 overflow-x-scroll whitespace-nowrap">
            <li v-for="test in currentFailingTests">
              <span class="mr-2">{{ getStatusIcon(test) }}</span>
              <span>{{ test.name }}</span>
            </li>
          </ul>

          <hr class="m-1" />
        </div>

        <div v-if="currentRunningTests.length" key="running">
          <span
            class="sticky z-20 block px-2 mt-1 top-[30px] bg-gray-50/30 dark:bg-gray-900/30"
            :class="[isEnlarged ? '' : 'backdrop-blur']"
            >Still running...</span
          >
          <ul class="w-full p-0 pl-3 mb-0 overflow-x-scroll whitespace-nowrap">
            <li v-for="test in currentRunningTests">
              <span class="mr-2">{{ getStatusIcon(test) }}</span>
              <span>{{ test.name }}</span>
            </li>
          </ul>

          <hr class="m-1" />
        </div>

        <details v-if="currentPassingTests.length" key="pass" class="p-0 pb-[0.75rem]" :open="isEnlarged">
          <summary class="sticky z-20 px-2 top-[30px] bg-gray-50/30 backdrop-blur dark:bg-gray-900/30">
            <span class="mr-2">🟢</span>
            {{ currentPassingTests.length }} tests passing
          </summary>
          <ul class="w-full max-w-[30vw] min-w-[256px] p-0 pl-5 pr-2 overflow-x-auto text-xs whitespace-nowrap">
            <li v-for="test in currentPassingTests">
              <span class="mr-2">{{ getStatusIcon(test) }}</span>
              <span>{{ test.name }}</span>
            </li>
          </ul>
        </details>
      </div>
    </section>
  </transition>
</template>

<style scoped>
.slide-enter-active {
  transition: 450ms ease-in-out transform, 700ms ease-in-out opacity;
}
.slide-leave-active {
  transition: 550ms ease-in-out transform, 300ms ease-out opacity;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(calc(-100% - 150px));
  opacity: 0;
}

details,
summary {
  font-size: inherit;
  font-weight: inherit;
}

summary {
  margin-bottom: 0 !important;
}

details {
  margin: 0;
  /* padding: 0.6em 0; */
  background: none;
  border: none;
  border-radius: 0;
}
</style>
