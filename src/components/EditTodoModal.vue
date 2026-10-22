<script setup>
import { ref, watch } from 'vue';
import BaseModal from './BaseModal.vue';

const props = defineProps({
  open: { type: Boolean, default: false },
  todo: { type: Object, default: null },
});
const emit = defineEmits(['close', 'save']);

const title = ref('');
const error = ref('');
const input = ref(null);

watch(
  () => props.todo,
  (todo) => {
    title.value = todo ? todo.title : '';
    error.value = '';
  },
  { immediate: true }
);

function onSubmit() {
  const value = title.value.trim();
  if (!value) {
    error.value = 'Название не может быть пустым';
    input.value.focus();
    return;
  }
  emit('save', value);
}
</script>

<template>
  <BaseModal :open="open" labelledby="edit-title" @close="emit('close')">
    <form class="modal__body" novalidate @submit.prevent="onSubmit">
      <h2 id="edit-title" class="modal__title">Редактировать задачу</h2>
      <label class="task-form__label" for="edit-input">Название задачи</label>
      <input
        id="edit-input"
        ref="input"
        v-model="title"
        class="task-form__input"
        type="text"
        maxlength="120"
        autocomplete="off"
        autofocus
        :aria-invalid="error ? 'true' : undefined"
        aria-describedby="edit-error"
        @focus="$event.target.select()"
        @input="error = ''"
      >
      <p v-if="error" id="edit-error" class="task-form__error" role="alert">{{ error }}</p>
      <div class="modal__actions">
        <button class="btn btn--ghost" type="button" @click="emit('close')">Отмена</button>
        <button class="btn btn--primary" type="submit">Сохранить</button>
      </div>
    </form>
  </BaseModal>
</template>
