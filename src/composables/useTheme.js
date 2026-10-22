import { ref, watch } from 'vue';

const THEME_KEY = 'todo:theme';

export function useTheme() {
  const theme = ref(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');

  watch(
    theme,
    (value) => {
      document.documentElement.dataset.theme = value;
      try {
        localStorage.setItem(THEME_KEY, value);
      } catch {
      }
    }
  );

  const toggleTheme = () => {
    theme.value = theme.value === 'dark' ? 'light' : 'dark';
  };

  return { theme, toggleTheme };
}
