<script setup lang="ts">
import type { TodoFilter } from '../types/todo'

defineProps<{ modelValue: TodoFilter }>()
defineEmits<{ 'update:modelValue': [value: TodoFilter] }>()

const options: { value: TodoFilter; label: string }[] = [
  { value: 'all', label: 'Все' },
  { value: 'active', label: 'Активные' },
  { value: 'done', label: 'Готовые' }
]
</script>

<template>
  <div class="filters" role="group" aria-label="Показывать задачи">
    <button
      v-for="option in options"
      :key="option.value"
      class="filters__btn"
      type="button"
      :aria-pressed="modelValue === option.value"
      @click="$emit('update:modelValue', option.value)"
    >
      {{ option.label }}
    </button>
  </div>
</template>
