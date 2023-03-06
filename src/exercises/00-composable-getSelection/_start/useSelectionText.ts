import { reactive } from 'vue'

export function useSelectionText() {
  const range = reactive({
    text: '',
    height: 0,
    width: 0,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  })

  // return ...
}
