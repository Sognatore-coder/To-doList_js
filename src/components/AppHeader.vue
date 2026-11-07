<script setup>
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useUserStore } from '../stores/user';
import { useTodoStore } from '../stores/todo';
import { useTheme } from '../composables/useTheme';
import { useAnnouncer } from '../composables/useAnnouncer';
import ThemeToggle from './ThemeToggle.vue';

const router = useRouter();
const userStore = useUserStore();
const todoStore = useTodoStore();
const { currentUser, isAuthenticated } = storeToRefs(userStore);
const { theme, toggleTheme } = useTheme();
const { announce } = useAnnouncer();

function onLogout() {
  todoStore.resetFilters(); // поиск и фильтр одного пользователя не должны достаться следующему
  userStore.logout();
  announce('Вы вышли из аккаунта');
  router.push({ name: 'login' });
}

function onToggleTheme() {
  toggleTheme();
  announce(theme.value === 'dark' ? 'Включена тёмная тема' : 'Включена светлая тема');
}
</script>

<template>
  <header class="header">
    <RouterLink class="header__brand" to="/">To-Do</RouterLink>

    <nav class="nav" aria-label="Основная навигация">
      <ul class="nav__list" role="list">
        <li v-if="isAuthenticated"><RouterLink class="nav__link" :to="{ name: 'todo' }">Задачи</RouterLink></li>
        <li v-if="!isAuthenticated"><RouterLink class="nav__link" :to="{ name: 'login' }">Вход</RouterLink></li>
        <li v-if="!isAuthenticated"><RouterLink class="nav__link" :to="{ name: 'register' }">Регистрация</RouterLink></li>
        <li><RouterLink class="nav__link" :to="{ name: 'about' }">О приложении</RouterLink></li>
      </ul>
    </nav>

    <div class="header__actions">
      <span v-if="currentUser" class="header__user">{{ currentUser.email }}</span>
      <button v-if="isAuthenticated" class="btn btn--ghost" type="button" @click="onLogout">Выйти</button>
      <ThemeToggle :theme="theme" @toggle="onToggleTheme" />
    </div>
  </header>
</template>
