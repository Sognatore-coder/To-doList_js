import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { nextTick } from 'vue'
import '../types/router'
import { useUserStore } from '../stores/user'
import LoginPage from '../pages/LoginPage.vue'
import RegisterPage from '../pages/RegisterPage.vue'
import TodoPage from '../pages/TodoPage.vue'
import AboutPage from '../pages/AboutPage.vue'

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: { name: 'todo' } },
  {
    path: '/login',
    name: 'login',
    component: LoginPage,
    meta: { title: 'Вход', guestOnly: true }
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterPage,
    meta: { title: 'Регистрация', guestOnly: true }
  },
  {
    path: '/todo',
    name: 'todo',
    component: TodoPage,
    meta: { title: 'Мои задачи', requiresAuth: true }
  },
  {
    path: '/about',
    name: 'about',
    component: AboutPage,
    meta: { title: 'О приложении' }
  },
  { path: '/:pathMatch(.*)*', redirect: { name: 'todo' } }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 })
})

router.beforeEach((to) => {
  const userStore = useUserStore()

  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  if (to.meta.guestOnly && userStore.isAuthenticated) {
    return { name: 'todo' }
  }
})

router.afterEach((to, from) => {
  document.title = `${to.meta.title} — To-Do`

  if (from.name) {
    nextTick(() => {
      const heading = document.querySelector<HTMLElement>('main h1')
      heading?.setAttribute('tabindex', '-1')
      heading?.focus()
    })
  }
})

export default router
