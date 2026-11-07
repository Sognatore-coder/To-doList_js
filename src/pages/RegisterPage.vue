<script setup>
import { ref, reactive, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore, EMAIL_RE, MIN_PASSWORD_LENGTH } from '../stores/user';
import FormField from '../components/FormField.vue';

const router = useRouter();
const userStore = useUserStore();

const email = ref('');
const password = ref('');
const confirm = ref('');
const errors = reactive({ email: '', password: '', confirm: '' });
const busy = ref(false);
const emailField = ref(null);
const passwordField = ref(null);
const confirmField = ref(null);

watch(email, () => { errors.email = ''; });
watch(password, () => { errors.password = ''; });
watch(confirm, () => { errors.confirm = ''; });

function validate() {
  const value = email.value.trim();
  errors.email = !value
    ? 'Введите email'
    : !EMAIL_RE.test(value)
      ? 'Введите email в формате name@example.com'
      : '';
  errors.password = !password.value
    ? 'Придумайте пароль'
    : password.value.length < MIN_PASSWORD_LENGTH
      ? `Пароль должен быть не короче ${MIN_PASSWORD_LENGTH} символов`
      : '';
  errors.confirm = !confirm.value
    ? 'Повторите пароль'
    : confirm.value !== password.value
      ? 'Пароли не совпадают'
      : '';

  const firstInvalid = [
    [errors.email, emailField],
    [errors.password, passwordField],
    [errors.confirm, confirmField],
  ].find(([error]) => error);
  firstInvalid?.[1].value.focus();
  return !firstInvalid;
}

async function onSubmit() {
  if (!validate()) return;

  busy.value = true;
  const result = await userStore.register(email.value, password.value);
  busy.value = false;

  if (!result.ok) {
    errors.email = result.error;
    return emailField.value.focus();
  }
  router.push({ name: 'login', query: { registered: '1' } });
}
</script>

<template>
  <section class="auth">
    <h1 class="auth__title">Регистрация</h1>
    <p class="auth__lead">Создайте аккаунт — у каждого пользователя свой список задач.</p>

    <form class="auth__form" novalidate @submit.prevent="onSubmit">
      <FormField
        id="register-email"
        ref="emailField"
        v-model="email"
        label="Email"
        type="email"
        autocomplete="email"
        :error="errors.email"
      />
      <FormField
        id="register-password"
        ref="passwordField"
        v-model="password"
        label="Пароль"
        type="password"
        autocomplete="new-password"
        :hint="`Не короче ${MIN_PASSWORD_LENGTH} символов. Это учебное приложение: не используйте пароль от реальных сервисов.`"
        :error="errors.password"
      />
      <FormField
        id="register-confirm"
        ref="confirmField"
        v-model="confirm"
        label="Подтверждение пароля"
        type="password"
        autocomplete="new-password"
        :error="errors.confirm"
      />

      <button class="btn btn--primary" type="submit" :disabled="busy">Зарегистрироваться</button>
    </form>

    <p class="auth__alt">
      Уже есть аккаунт?
      <RouterLink :to="{ name: 'login' }">Войти</RouterLink>
    </p>
  </section>
</template>
