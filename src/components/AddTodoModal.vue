<script setup>
import { ref, watch } from 'vue';
import BaseModal from './BaseModal.vue';

const props = defineProps({
  open: { type: Boolean, default: false },
});
const emit = defineEmits(['close', 'submit']);

const title = ref('');
const error = ref('');
const input = ref(null);

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      title.value = '';
      error.value = '';
    }
  }
);

function onSubmit() {
  const value = title.value.trim();
  if (!value) {
    error.value = 'Введите название задачи';
    input.value.focus();
    return;
  }
  emit('submit', value);
}
</script>

<template>
  <BaseModal :open="open" labelledby="add-title" @close="emit('close')">
    <form class="modal__body" novalidate @submit.prevent="onSubmit">
      <h2 id="add-title" class="modal__title">Новая задача</h2>
      <label class="task-form__label" for="add-input">Название задачи</label>
      <input
        id="add-input"
        ref="input"
        v-model="title"
        class="task-form__input"
        type="text"
        maxlength="120"
        autocomplete="off"
        placeholder="Например, купить молоко"
        autofocus
        :aria-invalid="error ? 'true' : undefined"
        aria-describedby="add-error"
        @input="error = ''"
      >
      <p v-if="error" id="add-error" class="task-form__error" role="alert">{{ error }}</p>
      <div class="modal__actions">
        <button class="btn btn--ghost" type="button" @click="emit('close')">Отмена</button>
        <button class="btn btn--primary" type="submit">Добавить</button>
      </div>
    </form>
  </BaseModal>
</template>
