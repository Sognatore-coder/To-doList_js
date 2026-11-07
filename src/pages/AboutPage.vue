<script setup>
import { computed } from 'vue';
import { useUserStore } from '../stores/user';
import { useTodoStore } from '../stores/todo';

const userStore = useUserStore();
const todoStore = useTodoStore();

const usersCount = computed(() => userStore.users.length);
const todosCount = computed(() => todoStore.todos.length);
const donePercent = computed(() => {
  const total = todoStore.todos.length;
  return total ? Math.round((todoStore.todos.filter((t) => t.done).length / total) * 100) : 0;
});

const stack = ['Vue 3', 'Vite', 'Pinia', 'Vue Router', 'Sass', 'localStorage'];

const history = [
  { title: 'Вёрстка и Sass', text: 'Статичный To-Do на ванильном JavaScript: БЭМ, темы через CSS-переменные, адаптивность и доступность.' },
  { title: 'Переход на Vue 3', text: 'Интерфейс разбит на компоненты, состояние стало реактивным, сборку взял на себя Vite, сайт опубликован на GitHub Pages.' },
  { title: 'Pinia и Vue Router', text: 'Появились аккаунты, личные списки задач, четыре страницы и защита страницы задач навигационным guard.' },
];
</script>

<template>
  <article class="about">
    <header class="about__hero">
      <h1>О приложении</h1>
      <p class="about__lead">
        Небольшой To-Do, который вырос из учебной вёрстки в приложение с аккаунтами. Задачи хранятся
        в браузере, у каждого пользователя — свой список, а интерфейс одинаково удобно использовать
        мышью, клавиатурой и скринридером.
      </p>
    </header>

    <section aria-labelledby="about-stats">
      <h2 id="about-stats">Приложение в цифрах</h2>
      <dl class="stats">
        <div class="stats__item">
          <dt class="stats__label">Аккаунтов на устройстве</dt>
          <dd class="stats__value">{{ usersCount }}</dd>
        </div>
        <div class="stats__item">
          <dt class="stats__label">Всего задач</dt>
          <dd class="stats__value">{{ todosCount }}</dd>
        </div>
        <div class="stats__item">
          <dt class="stats__label">Выполнено</dt>
          <dd class="stats__value">{{ donePercent }}%</dd>
        </div>
      </dl>
    </section>

    <section aria-labelledby="about-stack">
      <h2 id="about-stack">Из чего сделано</h2>
      <ul class="chips" role="list">
        <li v-for="item in stack" :key="item" class="chips__item">{{ item }}</li>
      </ul>
    </section>

    <section aria-labelledby="about-history">
      <h2 id="about-history">История разработки</h2>
      <ol class="timeline" role="list">
        <li v-for="step in history" :key="step.title" class="timeline__item">
          <h3 class="timeline__title">{{ step.title }}</h3>
          <p class="timeline__text">{{ step.text }}</p>
        </li>
      </ol>
    </section>

    <aside class="about__note" aria-labelledby="about-note">
      <h2 id="about-note">Важно про вход</h2>
      <p>
        Это учебная авторизация без сервера: аккаунты и пароли лежат в <code>localStorage</code> вашего
        браузера и доступны скриптам страницы. Она не защищает реальные данные — используйте только
        вымышленные адреса и пароли, которые нигде больше не применяются.
      </p>
    </aside>
  </article>
</template>
