import { ref } from 'vue'

const status = ref('')

export function useAnnouncer() {
  function announce(message: string): void {
    status.value = ''
    setTimeout(() => {
      status.value = message
    }, 50)
  }
  return { status, announce }
}
