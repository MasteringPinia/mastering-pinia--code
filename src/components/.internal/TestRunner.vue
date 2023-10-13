<script lang="ts" setup>
import { onAfterEach } from '@/.internal/utils'
import { getStatusIcon, useTestStatus, getTestStatusIcon } from '@/.internal/utils/testing'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

const {
  //
  rerun,
  currentRunningTests,
  currentTestsPerSuite,
  hasNestedSuites,
  hasTests,
  currentPassingTests,
  currentFailingTests,
  currentResult,
  title,
  runId,
  testResult,
} = useTestStatus()

const isEnlarged = ref(false)

const route = useRoute()
const isForcefullyHidden = computed(() => 'hideTests' in route.query)
const isHidden = computed(() => isForcefullyHidden.value || isMinimized.value)
const isMinimized = ref(false)

const isRunFinished = computed(() => testResult.value === 'fail' || testResult.value === 'pass')

// rerun tests when entering the exercise for the first time
// so they appear on the user console
onAfterEach((to, from) => {
  if (to.meta.exerciseData && to.meta.exerciseData.dirname !== from.meta.exerciseData?.dirname) {
    rerun()
  }
})

function enlarge() {
  isEnlarged.value = !isEnlarged.value
  if (isEnlarged.value) {
    const details = Array.from(document.querySelectorAll<HTMLDetailsElement>('#test-runner details'))
    for (const detailEl of details) {
      detailEl.open = true
    }
  }
}
</script>

<template>
  <transition name="slide" mode="out-in">
    <section
      v-if="hasTests && !isHidden"
      id="test-runner"
      :key="title"
      class="fixed bottom-10 left-4 z-50 m-0 border border-gray-800 rounded-lg dark:border-gray-300 bg-gray-50 dark:bg-gray-900"
      :class="[isEnlarged ? 'right-4 top-10 bg-opacity-75 dark:bg-opacity-70' : 'w-72']"
    >
      <h3
        class="top-0 z-30 flex px-3 py-1 m-0 text-sm font-bold border-solid border-light-100 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-900/30"
        :class="[isEnlarged ? '' : 'backdrop-blur', isMinimized ? 'rounded-lg' : 'rounded-t-lg border-b-2']"
      >
        <span
          id="test-runner-status"
          :key="runId"
          class="mr-2"
          :class="isRunFinished && 'animate__animated animate__bounce'"
          >{{ currentResult }}</span
        >
        <span>{{ title }}</span>
        <span class="flex-grow"></span>
        <a
          href="#"
          class="font-serif"
          role="button"
          title="Hide test runner"
          aria-label="Hide test runner"
          @click.prevent="isMinimized = true"
          >&#x2b05;&#xFE0F;</a
        >
        <!-- ⬅ -->
        <a href="#" class="font-serif" role="button" title="Rerun tests" aria-label="Rerun tests" @click.prevent="rerun"
          >&#x25b6;&#xFE0F;</a
        >
        <a
          href="#"
          class="font-serif"
          role="button"
          :aria-label="isEnlarged ? 'Collapse' : 'Enlarge'"
          :title="isEnlarged ? 'Collapse' : 'Enlarge'"
          @click.prevent="enlarge"
          >{{ isEnlarged ? '↙️' : '↗️' }}</a
        >
      </h3>

      <div v-if="!isMinimized" class="relative overflow-y-auto text-xs" :class="[isEnlarged ? '' : 'max-h-72']">
        <template v-if="hasNestedSuites">
          <details v-for="[name, group] in currentTestsPerSuite" :key="name" class="p-0 pb-1">
            <summary class="sticky top-0 z-20 px-2 bg-gray-50/30 backdrop-blur dark:bg-gray-900/30">
              <span class="mr-2">{{ group.state }}</span>
              {{ group.name }} ({{ group.tests.length }})
            </summary>

            <ul class="w-full p-0 pl-5 pr-3 overflow-x-auto text-xs">
              <li v-for="test in group.tests" class="flex space-x-2">
                <span>{{ getTestStatusIcon(test) }}</span>
                <span>{{ test.name }}</span>
              </li>
            </ul>
          </details>
        </template>

        <template v-else>
          <div v-if="currentFailingTests.length" key="failing">
            <span
              class="sticky top-0 z-20 block px-2 mt-1 bg-gray-50/30 dark:bg-gray-900/30"
              :class="[isEnlarged ? '' : 'backdrop-blur']"
              >Failing tests</span
            >
            <ul class="w-full p-0 px-3 mb-0 overflow-x-auto">
              <li v-for="test in currentFailingTests" class="flex space-x-2">
                <span>{{ getStatusIcon(test) }}</span>
                <span>{{ test.name }}</span>
              </li>
            </ul>

            <hr class="m-1" />
          </div>

          <div v-if="currentRunningTests.length" key="running">
            <span
              class="sticky top-0 z-20 block px-2 mt-1 bg-gray-50/30 dark:bg-gray-900/30"
              :class="[isEnlarged ? '' : 'backdrop-blur']"
              >Still running...</span
            >
            <ul class="w-full p-0 px-3 mb-0">
              <li v-for="test in currentRunningTests" class="flex space-x-2">
                <span>{{ getStatusIcon(test) }}</span>
                <span>{{ test.name }}</span>
              </li>
            </ul>

            <hr class="m-1" />
          </div>

          <details v-if="currentPassingTests.length" key="pass" class="p-0 pb-[0.75rem]">
            <summary class="sticky top-0 z-20 px-2 bg-gray-50/30 backdrop-blur dark:bg-gray-900/30">
              <span class="mr-2">🟢</span>
              {{ currentPassingTests.length }} tests passing
            </summary>

            <ul class="w-full p-0 pl-5 pr-3 overflow-x-auto text-xs">
              <li v-for="test in currentPassingTests" class="flex space-x-2">
                <span>{{ getStatusIcon(test) }}</span>
                <span>{{ test.name }}</span>
              </li>
            </ul>
          </details>
        </template>
      </div>
    </section>

    <div v-else-if="!isForcefullyHidden && hasTests" class="fixed bottom-10 left-4 z-50">
      <button
        data-test="btn-show-tests"
        class="px-3 py-1 text-sm border border-dashed border-gray-500 bg-gray-50 dark:bg-gray-900 group space-x-2"
        @click="isMinimized = false"
      >
        <span id="test-runner-status" :key="runId" :class="isRunFinished && 'animate__animated animate__bounce'">{{
          currentResult
        }}</span>
        <span class="hidden group-hover:inline">Show Test Runner</span>
      </button>
    </div>
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

#test-runner-status {
  animation-delay: 160ms;
}
</style>
