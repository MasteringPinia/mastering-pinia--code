<script setup lang="ts">
import { Component, computed, defineAsyncComponent, nextTick, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router/auto'
import { openFile } from '@/.internal/utils/files'

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'close'): void
}>()
const props = defineProps<{ modelValue: boolean }>()

const route = useRoute()

const Instructions = computed<undefined | Component>(
  () =>
    route.meta.exerciseData?.dirname &&
    // we cannot directly use route.meta.exerciseData?.instructions because it wouldn't let Vite code split
    defineAsyncComponent(() => import(`../../exercises/${route.meta.exerciseData!.dirname}/instructions.md`)),
)

let dialog: HTMLDialogElement | undefined

onMounted(() => {
  dialog = document.getElementById('instructions-modal')! as HTMLDialogElement

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
    id="instructions-modal"
    class="max-w-6xl md:w-5/6 w-11/12 h-5/6 m-auto"
    aria-describedby="instructions"
    aria-modal="true"
    @transitionend="_updateCloseState"
    @cancel.prevent="closeDialog()"
    @click="closeIfOutside"
    @close="closeDialog()"
  >
    <div v-if="Instructions" class="relative content">
      <header>
        <nav class="text-xs">
          <a
            v-if="route.meta.exerciseData"
            :href="`file://.${route.meta.exerciseData.instructions}`"
            role="button"
            @click.prevent="openFile(route.meta.exerciseData!.instructions)"
            >Open <code class="text-xs">instructions.md</code> in Editor</a
          >
          |
          <a href="#" autofocus role="button" @click.prevent="closeDialog()"
            >Close <span aria-hidden="true">(Esc)</span></a
          >
        </nav>
      </header>

      <main id="instructions" class="mx-auto w-full max-w-4xl">
        <Instructions />
      </main>
    </div>
  </dialog>
</template>

<style scoped>
#instructions-modal {
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

#instructions :deep(img:first-of-type) {
  @apply border rounded-lg my-6;
  border-color: var(--nc-bg-3);
  /* border: 1px solid var(--nc-bg-3);
  border-radius: 0.5rem; */
}

#instructions-modal:modal {
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

#instructions-modal .content {
  padding: 2rem;
}

/* Make images a bit smaller on big screens */
#instructions :deep(img) {
  width: 100%;
  max-width: 800px;
}

#instructions :deep(img.tip-logo) {
  margin: 0;
  padding: 0;
  border: none;
  border-radius: 0%;
  width: 1em;
  height: 1em;
  display: inline-block;
}

#instructions-modal::backdrop {
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  transition: all 0.3s ease-in-out;
}

#instructions-modal.from {
  transform: translateY(-30%);
  opacity: 0;
}
#instructions-modal.from::backdrop {
  background-color: rgba(0, 0, 0, 0);
  backdrop-filter: blur(0);
}
</style>
