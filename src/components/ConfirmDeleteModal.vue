<script setup>
import BaseModal from './BaseModal.vue';

defineProps({
  open: { type: Boolean, default: false },
  todo: { type: Object, default: null },
});
const emit = defineEmits(['close', 'confirm']);
</script>

<template>
  <BaseModal :open="open" labelledby="delete-title" describedby="delete-text" @close="emit('close')">
    <form class="modal__body" @submit.prevent="emit('confirm')">
      <h2 id="delete-title" class="modal__title">Удалить задачу?</h2>
      <p id="delete-text" class="modal__text">
        Задача «{{ todo?.title }}» будет удалена без возможности восстановления.
      </p>
      <div class="modal__actions">
        <button class="btn btn--ghost" type="button" autofocus @click="emit('close')">Отмена</button>
        <button class="btn btn--danger" type="submit">Удалить</button>
      </div>
    </form>
  </BaseModal>
</template>
