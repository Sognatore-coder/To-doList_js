import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  // Относительные пути: собранный сайт одинаково работает и на
  // https://<user>.github.io/<repo>/, и в корне домена, и при открытии dist/ локально через preview.
  base: './'
})
