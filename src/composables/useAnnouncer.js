import { ref } from 'vue';

const status = ref('');

export function useAnnouncer() {
  function announce(message) {
    status.value = ''; // сброс, чтобы одинаковое сообщение прозвучало повторно
    setTimeout(() => { status.value = message; }, 50);
  }
  return { status, announce };
}
