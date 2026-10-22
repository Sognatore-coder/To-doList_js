<script setup>
defineProps({
  modelValue: { type: String, default: '' },
});
defineEmits(['update:modelValue']);
</script>

<template>
  <form class="search" role="search" @submit.prevent>
    <label class="visually-hidden" for="search-input">Поиск по задачам</label>
    <svg class="search__icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
      <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2"/>
      <path d="M20 20l-4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>
    <input
      id="search-input"
      class="search__input"
      type="search"
      placeholder="Поиск по задачам"
      autocomplete="off"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    >
  </form>
</template>
