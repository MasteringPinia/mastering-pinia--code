<script setup lang="ts">
import { Component, computed, defineAsyncComponent, DefineComponent, nextTick, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router/auto'
import { openFile } from '~/api/.internal/files'

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'close'): void
}>()
const props = defineProps<{ modelValue: boolean }>()

const route = useRoute()

const Instructions = computed<undefined | Component>(
  () =>
    route.meta.exerciseData?.dirname &&
    defineAsyncComponent(() => import(`../../exercises/${route.meta.exerciseData!.dirname}/_start/instructions.md`)),
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
  dialog?.classList.add('from')
  dialog?.showModal()
  await nextTick()
  dialog?.classList.add('from')
  // trigger the animation
  await nextTick()
  dialog?.classList.remove('from')
}

function closeDialog() {
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
    @transitionend="_updateCloseState"
    @cancel.prevent="closeDialog()"
    @click="closeIfOutside"
    @close="closeDialog()"
  >
    <div class="content" v-if="Instructions">
      <header>
        <nav class="text-xs">
          <a
            v-if="route.meta.exerciseData"
            :href="`file://.${route.meta.exerciseData.filepath}`"
            role="button"
            @click.prevent="openFile(route.meta.exerciseData!.filepath)"
            >Open <code class="text-xs">index.vue</code> in Editor</a
          >
          |
          <a
            v-if="route.meta.exerciseData"
            :href="`file://.${route.meta.exerciseData.instructions}`"
            role="button"
            @click.prevent="openFile(route.meta.exerciseData!.instructions)"
            >Open <code class="text-xs">instructions.md</code> on Editor</a
          >
          |
          <a href="#" role="button" @click="closeDialog()">Close (Esc)</a>
        </nav>
      </header>

      <Instructions />
    </div>
  </dialog>
</template>

<style scoped>
#instructions-modal {
  transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
}

.content > header {
  position: sticky;
  top: 0;
  background-color: rgba(35, 35, 35, 0.8);
  backdrop-filter: blur(5px);
}

#instructions-modal:modal {
  background-color: var(--nc-bg-1);
  color: currentColor;
  border: 8px double var(--nc-tx-2);
  /* background-color: yellow; */
  box-shadow: 3px 3px 10px rgba(0 0 0 / 0.5);

  transform: translateY(0px);

  margin: auto auto;
  width: 80vw;
  height: 80vh;
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
