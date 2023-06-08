import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, ref, shallowRef } from 'vue'

export const useGradientGenerator = defineStore('gradient-generator', () => {
  // build out your composable here
})

/**
 * Utility function for generating a random color
 */
function randomColor() {
  return `#${Math.floor(Math.random() * 0xffffff)
    .toString(16)
    // the input also does lowercase so this is more consistent
    .toLowerCase()
    .padStart(6, '0')}`
}

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useGradientGenerator, import.meta.hot))
}
