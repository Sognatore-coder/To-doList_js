import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import App from './App.vue';
import router from './router';
import './scss/main.scss';

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate); 

// Pinia подключается раньше роутера: guard при первой навигации уже читает стор пользователя
createApp(App).use(pinia).use(router).mount('#app');
