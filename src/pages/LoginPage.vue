<script setup>
import { ref, reactive, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore, EMAIL_RE } from '../stores/user';
import FormField from '../components/FormField.vue';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const email = ref('');
const password = ref('');
const errors = reactive({ email: '', password: '' });
const formError = ref('');
const busy = ref(false);
const emailField = ref(null);
const passwordField = ref(null);

// После регистрации приходим сюда с ?registered=1
const justRegistered = computed(() => route.query.registered === '1');

// Правка поля снимает его ошибку
watch(email, () => { errors.email = ''; formError.value = ''; });
watch(password, () => { errors.password = ''; formError.value = ''; });

// Возвращаем пользователя туда, куда он шёл (только внутренние пути)
function redirectTarget() {
  const target = route.query.redirect;
  return typeof target === 'string' && target.startsWith('/') && !target.startsWith('//') ? target : { name: 'todo' };
}

async function onSubmit() {
  errors.email = !email.value.trim()
    ? 'Введите email'
    : !EMAIL_RE.test(email.value.trim())
      ? 'Введите email в формате name@example.com'
      : '';
  errors.password = password.value ? '' : 'Введите пароль';

  if (errors.email) return emailField.value.focus();
  if (errors.password) return passwordField.value.focus();

  busy.value = true;
  const result = await userStore.login(email.value, password.value);
  busy.value = false;

  if (!result.ok) {
    formError.value = result.error;
    return passwordField.value.focus();
  }
  router.push(redirectTarget());
}
</script>

<template>
  <section class="auth">
    <h1 class="auth__title">Вход</h1>
    <p class="auth__lead">Войдите, чтобы работать со своими задачами.</p>

    <p v-if="justRegistered" class="auth__notice" role="status">Аккаунт создан. Теперь можно войти.</p>

    <form class="auth__form" novalidate @submit.prevent="onSubmit">
      <FormField
        id="login-email"
        ref="emailField"
        v-model="email"
        label="Email"
        type="email"
        autocomplete="email"
        :error="errors.email"
      />
      <FormField
        id="login-password"
        ref="passwordField"
        v-model="password"
        label="Пароль"
        type="password"
        autocomplete="current-password"
        :error="errors.password"
      />

      <p v-if="formError" class="auth__error" role="alert">{{ formError }}</p>

      <button class="btn btn--primary" type="submit" :disabled="busy">Войти</button>
    </form>

    <p class="auth__alt">
      Нет аккаунта?
      <RouterLink :to="{ name: 'register' }">Зарегистрироваться</RouterLink>
    </p>
  </section>
</template>
