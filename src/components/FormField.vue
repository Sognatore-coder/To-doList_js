<script setup lang="ts">
import { ref, computed } from 'vue'

const props = withDefaults(
  defineProps<{
    id: string
    label: string
    type?: 'text' | 'email' | 'password'
    autocomplete?: string
    hint?: string
    error?: string
  }>(),
  { type: 'text', autocomplete: 'off', hint: '', error: '' }
)

const model = defineModel<string>({ default: '' })
const input = ref<HTMLInputElement | null>(null)

// Подсказка и ошибка привязываются к полю через aria-describedby
const describedBy = computed(
  () =>
    [props.hint && `${props.id}-hint`, props.error && `${props.id}-error`]
      .filter(Boolean)
      .join(' ') || undefined
)

defineExpose({ focus: () => input.value?.focus() })
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
    />
    <p v-if="hint" :id="`${id}-hint`" class="field__hint">{{ hint }}</p>
    <!-- v-if: ошибка существует в DOM только при невалидном поле; role="alert" озвучит её при появлении -->
    <p v-if="error" :id="`${id}-error`" class="field__error" role="alert">
      {{ error }}
    </p>
  </div>
</template>
