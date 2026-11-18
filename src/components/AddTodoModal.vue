<script setup lang="ts">
import { ref, watch } from 'vue'
import BaseModal from './BaseModal.vue'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: []; submit: [title: string] }>()

const title = ref('')
const error = ref('')
const input = ref<HTMLInputElement | null>(null)

// Побочный эффект: при каждом открытии очищаем поле и ошибку
watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      title.value = ''
      error.value = ''
    }
  }
)

function onSubmit(): void {
  const value = title.value.trim()
  if (!value) {
    error.value = 'Введите название задачи'
    input.value?.focus()
    return
  }
  emit('submit', value)
}
</script>

<template>
  <BaseModal :open="open" labelledby="add-title" @close="emit('close')">
    <form class="modal__body" novalidate @submit.prevent="onSubmit">
      <h2 id="add-title" class="modal__title">Новая задача</h2>
      <label class="field__label" for="add-input">Название задачи</label>
      <input
        id="add-input"
        ref="input"
        v-model="title"
        class="field__input"
        type="text"
        maxlength="120"
        autocomplete="off"
        placeholder="Например, купить молоко"
        autofocus
        :aria-invalid="error ? 'true' : undefined"
        aria-describedby="add-error"
        @input="error = ''"
      />
      <!-- v-if: сообщение об ошибке нужно только при невалидном вводе -->
      <p v-if="error" id="add-error" class="field__error" role="alert">
        {{ error }}
      </p>
      <div class="modal__actions">
        <button class="btn btn--ghost" type="button" @click="emit('close')">
          Отмена
        </button>
        <button class="btn btn--primary" type="submit">Добавить</button>
      </div>
    </form>
  </BaseModal>
</template>
