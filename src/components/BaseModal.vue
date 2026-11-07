<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  open: { type: Boolean, default: false },
  labelledby: { type: String, required: true },
  describedby: { type: String, default: undefined },
});
const emit = defineEmits(['close']);

const dialog = ref(null);

watch(
  () => props.open,
  (isOpen) => {
    const el = dialog.value;
    if (isOpen && !el.open) el.showModal();
    else if (!isOpen && el.open) el.close();
  },
  { flush: 'post' }
);

function onBackdropClick(event) {
  if (event.target === dialog.value) emit('close');
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
    <slot v-if="open" />
  </dialog>
</template>
