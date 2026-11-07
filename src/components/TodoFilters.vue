<script setup>
defineProps({
  modelValue: { type: String, required: true },
});
defineEmits(['update:modelValue']);

const options = [
  { value: 'all', label: 'Все' },
  { value: 'active', label: 'Активные' },
  { value: 'done', label: 'Готовые' },
];
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
