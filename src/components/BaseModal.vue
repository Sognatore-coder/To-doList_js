<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  open: boolean
  labelledby: string
  describedby?: string
}>()
const emit = defineEmits<{ close: [] }>()

const dialog = ref<HTMLDialogElement | null>(null)

watch(
  () => props.open,
  (isOpen) => {
    const el = dialog.value
    if (!el) return
    if (isOpen && !el.open) el.showModal()
    else if (!isOpen && el.open) el.close()
  },
  { flush: 'post' }
)

function onBackdropClick(event: MouseEvent): void {
  if (event.target === dialog.value) emit('close')
}
</script>

<template>
  <dialog
    ref="dialog"
    class="modal"
    :aria-labelledby="labelledby"
    :aria-describedby="describedby"
    @close="emit('close')"
    @click="onBackdropClick"
  >
    <!-- v-if: содержимое существует только пока окно открыто — форма каждый раз создаётся «с нуля», без остатков прошлого ввода -->
    <slot v-if="open" />
  </dialog>
</template>
