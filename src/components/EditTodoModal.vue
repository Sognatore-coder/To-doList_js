<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Todo } from '../types/todo'
import BaseModal from './BaseModal.vue'

const props = defineProps<{
  open: boolean
  todo: Todo | null
}>()
const emit = defineEmits<{ close: []; save: [title: string] }>()

const title = ref('')
const error = ref('')
const input = ref<HTMLInputElement | null>(null)

watch(
  () => props.todo,
  (todo) => {
    title.value = todo ? todo.title : ''
    error.value = ''
  },
  { immediate: true }
)

function onSubmit(): void {
  const value = title.value.trim()
  if (!value) {
    error.value = 'Название не может быть пустым'
    input.value?.focus()
    return
  }
  emit('save', value)
}

function onFocus(event: FocusEvent): void {
  if (event.target instanceof HTMLInputElement) event.target.select()
}
</script>

<template>
  <BaseModal :open="open" labelledby="edit-title" @close="emit('close')">
    <form class="modal__body" novalidate @submit.prevent="onSubmit">
      <h2 id="edit-title" class="modal__title">Редактировать задачу</h2>
      <label class="field__label" for="edit-input">Название задачи</label>
      <input
        id="edit-input"
        ref="input"
        v-model="title"
        class="field__input"
        type="text"
        maxlength="120"
        autocomplete="off"
        autofocus
        :aria-invalid="error ? 'true' : undefined"
        aria-describedby="edit-error"
        @focus="onFocus"
        @input="error = ''"
      />
      <p v-if="error" id="edit-error" class="field__error" role="alert">
        {{ error }}
      </p>
      <div class="modal__actions">
        <button class="btn btn--ghost" type="button" @click="emit('close')">
          Отмена
        </button>
        <button class="btn btn--primary" type="submit">Сохранить</button>
      </div>
    </form>
  </BaseModal>
</template>
