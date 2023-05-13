// Setting the globals property to true allows us to use
// the Vitest APIs without importing them in the test files.
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test:{
    globals:true,
    // environment: 'jsdom'
  }
})
