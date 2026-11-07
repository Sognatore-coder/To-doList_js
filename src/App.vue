<script setup>
import { useAnnouncer } from './composables/useAnnouncer';
import AppHeader from './components/AppHeader.vue';

const { status } = useAnnouncer();

function focusMain() {
  document.getElementById('main')?.focus();
}
</script>

<template>
  <a class="skip-link" href="#main" @click.prevent="focusMain">Перейти к содержимому</a>

  <div class="container">
    <AppHeader />
    <main id="main" class="main" tabindex="-1">
      <RouterView />
    </main>
  </div>

  <p class="visually-hidden" role="status" aria-live="polite">{{ status }}</p>
</template>
