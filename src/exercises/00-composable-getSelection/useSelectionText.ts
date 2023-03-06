import { onMounted, onUnmounted, reactive, toRefs } from 'vue'

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

  function selectionChange() {
    const selection = window.getSelection()
    if (!selection || selection.rangeCount < 1) {
      range.text = ''
      range.width = 0
      range.height = 0
      return
    }
    const rect = selection.rangeCount > 0 ? selection.getRangeAt(0).getBoundingClientRect() : null
    range.text = selection?.toString() || ''
    range.height = rect?.height || 0
    range.width = rect?.width || 0
    range.top = rect?.top || 0
    range.left = rect?.left || 0
    range.right = rect?.right || 0
    range.bottom = rect?.bottom || 0
  }

  onMounted(() => {
    document.addEventListener('selectionchange', selectionChange)
  })

  onUnmounted(() => {
    document.removeEventListener('selectionchange', selectionChange)
  })

  return toRefs(range)
}
