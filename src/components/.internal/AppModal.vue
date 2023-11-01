<script setup lang="ts">
import { nextTick, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router/auto'

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'close'): void
}>()
const props = defineProps<{ modelValue: boolean; id: string }>()

const route = useRoute()

let dialog: HTMLDialogElement | undefined

onMounted(() => {
  dialog = document.getElementById(props.id)! as HTMLDialogElement

  watch(
    () => props.modelValue,
    isOpen => {
      if (isOpen) {
        openDialog()
      } else {
        closeDialog()
      }
    },
    { immediate: true },
  )

  watch(
    () => route.meta.exerciseData?.instructions,
    instructions => {
      if (!instructions) {
        closeDialog()
      }
    },
  )
})

async function openDialog() {
  document.body.classList.add('overflow-y-hidden')
  dialog?.classList.add('from')
  dialog?.showModal()
  await nextTick()
  dialog?.classList.add('from')
  // trigger the animation
  await nextTick()
  dialog?.classList.remove('from')
}

function closeDialog() {
  document.body.classList.remove('overflow-y-hidden')
  dialog?.classList.add('from')
  // avoid never updating the open state in the parent
  if (!dialog?.open) {
    _updateCloseState()
  }
}
// triggers the close when the animation is done
function _updateCloseState() {
  if (dialog?.classList.contains('from')) {
    dialog?.close?.()
    emit('update:modelValue', false)
    emit('close')
  }
}

function closeIfOutside(event: MouseEvent) {
  const el = event.composedPath()[0] as HTMLDialogElement | undefined
  if (typeof el?.showModal === 'function') {
    closeDialog()
    emit('update:modelValue', false)
  }
}
</script>

<template>
  <!-- @cancel is triggered when pressing Esc on some browsers -->
  <dialog
    :id="id"
    class="max-w-6xl md:w-5/6 w-11/12 min-h-1/2 max-h-5/6 m-auto app-modal"
    aria-describedby="instructions"
    aria-modal="true"
    @transitionend="_updateCloseState"
    @cancel.prevent="closeDialog()"
    @click="closeIfOutside"
    @close="closeDialog()"
  >
    <div class="h-full">
      <slot></slot>
    </div>
  </dialog>
</template>

<style scoped>
.app-modal {
  transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
}

.content > header {
  --nc-header-bg: rgba(0, 0, 0, 0.8);

  position: sticky;
  top: 0;
  background-color: var(--nc-header-bg);
  backdrop-filter: blur(5px);
}

@media (prefers-color-scheme: light) {
  .content > header {
    --nc-header-bg: rgba(255, 255, 255, 0.8);
  }
}

.app-modal:modal {
  background-color: var(--nc-bg-1);
  color: currentColor;
  border: 8px double var(--nc-tx-2);
  /* background-color: yellow; */
  box-shadow: 3px 3px 10px rgba(0 0 0 / 0.5);

  transform: translateY(0px);

  border-radius: 6px;
  overflow-x: hidden;
  word-break: break-word;
  overflow-wrap: break-word;
  background: var(--nc-bg-1);
  color: var(--nc-tx-2);
  font-size: 1.03rem;
  line-height: 1.5;
}

.app-modal .content {
  padding: 2rem;
}

.app-modal::backdrop {
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  transition: all 0.3s ease-in-out;
}

.app-modal.from {
  transform: translateY(-30%);
  opacity: 0;
}
.app-modal.from::backdrop {
  background-color: rgba(0, 0, 0, 0);
  backdrop-filter: blur(0);
}
</style>
