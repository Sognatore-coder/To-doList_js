import { createRouter, createWebHashHistory } from 'vue-router';
import { nextTick } from 'vue';
import { useUserStore } from '../stores/user';
import LoginPage from '../pages/LoginPage.vue';
import RegisterPage from '../pages/RegisterPage.vue';
import TodoPage from '../pages/TodoPage.vue';
import AboutPage from '../pages/AboutPage.vue';

const routes = [
  { path: '/', redirect: { name: 'todo' } },
  { path: '/login', name: 'login', component: LoginPage, meta: { title: 'Вход', guestOnly: true } },
  { path: '/register', name: 'register', component: RegisterPage, meta: { title: 'Регистрация', guestOnly: true } },
  { path: '/todo', name: 'todo', component: TodoPage, meta: { title: 'Мои задачи', requiresAuth: true } },
  { path: '/about', name: 'about', component: AboutPage, meta: { title: 'О приложении' } },
  { path: '/:pathMatch(.*)*', redirect: { name: 'todo' } },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
});

// Guard: гость не попадёт на страницу задач — в том числе по прямой ссылке или после обновления.
// Состояние входа к этому моменту уже восстановлено из localStorage (pinia-plugin-persistedstate).
router.beforeEach((to) => {
  const userStore = useUserStore();

  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }; // после входа вернём пользователя сюда
  }
  if (to.meta.guestOnly && userStore.isAuthenticated) {
    return { name: 'todo' }; // вошедшему форма входа и регистрации не нужны
  }
});

router.afterEach((to, from) => {
  document.title = `${to.meta.title} — To-Do`;

  // При переходе (но не при первой загрузке) переносим фокус на заголовок новой страницы:
  // клавиатурный и скринридер-пользователь сразу оказывается в начале нового содержимого
  if (from.name) {
    nextTick(() => {
      const heading = document.querySelector('main h1');
      heading?.setAttribute('tabindex', '-1');
      heading?.focus();
    });
  }
});

export default router;
