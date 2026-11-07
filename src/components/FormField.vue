<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  id: { type: String, required: true },
  label: { type: String, required: true },
  type: { type: String, default: 'text' },
  autocomplete: { type: String, default: 'off' },
  hint: { type: String, default: '' },
  error: { type: String, default: '' },
});

const model = defineModel({ type: String, default: '' });
const input = ref(null);

// Подсказка и ошибка привязываются к полю через aria-describedby
const describedBy = computed(
  () => [props.hint && `${props.id}-hint`, props.error && `${props.id}-error`].filter(Boolean).join(' ') || undefined
);

defineExpose({ focus: () => input.value?.focus() });
</script>

<template>
  <div class="field">
    <label class="field__label" :for="id">{{ label }}</label>
    <input
      :id="id"
      ref="input"
      v-model="model"
      class="field__input"
      :type="type"
      :autocomplete="autocomplete"
      :aria-invalid="error ? 'true' : undefined"
      :aria-describedby="describedBy"
    >
    <p v-if="hint" :id="`${id}-hint`" class="field__hint">{{ hint }}</p>
    <p v-if="error" :id="`${id}-error`" class="field__error" role="alert">{{ error }}</p>
  </div>
</template>
