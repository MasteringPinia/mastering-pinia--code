import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, ref, shallowRef } from 'vue'
import { useClipboard } from '@vueuse/core'

export const useGradientGenerator = defineStore('gradient-generator', () => {
  const colors = ref<string[]>(['#00c9ff', '#92fe9d'])
  const angle = ref(90)

  const history = shallowRef<Array<{ colors: string[]; angle: number }>>([])

  function addRandomColor() {
    colors.value.push(randomColor())
  }

  function removeColor(index: number) {
    if (
      // gradients must have at least 2 colors
      colors.value.length <= 2 ||
      // the index must be valid
      index >= colors.value.length
    )
      return

    colors.value.splice(index, 1)
  }

  const background = computed(() => {
    const colorsStop = colors.value.join(', ')
    return `linear-gradient(${angle.value}deg, ${colorsStop})`
  })

  function saveColors() {
    const currentColors = colors.value.join(',')
    // only save different gradients
    if (!history.value.some(({ colors }) => colors.join(',') === currentColors)) {
      history.value.push({
        colors: colors.value,
        angle: angle.value,
      })
    }
  }

  function randomize(steps = 2) {
    const newColors = []
    for (let i = 0; i < steps; i++) {
      newColors.push(randomColor())
    }
    saveColors()
    colors.value = newColors
    angle.value = Math.floor(Math.random() * 360)
  }

  const { copy } = useClipboard({})

  function copyToClipboard() {
    return copy(`background-image: ${background.value};`)
  }

  function $reset() {
    saveColors()
    angle.value = 90
    colors.value = ['#00c9ff', '#92fe9d']
  }

  return {
    colors,
    angle,
    history,
    background,
    randomize,
    addRandomColor,
    removeColor,
    $reset,
    saveColors,
    copyToClipboard,
  }
})

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
