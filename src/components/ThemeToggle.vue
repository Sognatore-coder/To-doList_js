<script setup>
defineProps({
  theme: { type: String, required: true },
});
defineEmits(['toggle']);
</script>

<template>
  <button
    class="theme-switcher"
    type="button"
    :aria-pressed="theme === 'dark'"
    @click="$emit('toggle')"
  >
    <span class="visually-hidden">Тёмная тема</span>
    <svg class="theme-switcher__icon theme-switcher__icon--sun" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/>
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>
    <svg class="theme-switcher__icon theme-switcher__icon--moon" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">
      <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
    </svg>
  </button>
</template>
