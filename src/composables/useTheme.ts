import { ref, watch } from 'vue'
import type { Theme } from '../types/theme'

const THEME_KEY = 'todo:theme'

export function useTheme() {
  const theme = ref<Theme>(
    document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
  )

  watch(theme, (value) => {
    document.documentElement.dataset.theme = value
    try {
      localStorage.setItem(THEME_KEY, value)
    } catch {
      // localStorage недоступен
    }
  })

  const toggleTheme = (): void => {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  return { theme, toggleTheme }
}
