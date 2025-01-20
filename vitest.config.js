// Setting the globals property to true allows us to use
// the Vitest APIs without importing them in the test files.
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// import { resolve } from 'path';

export default defineConfig({
  plugins: [vue()],
  test:{
    globals:true,
    // // environment: 'jsdom'
    // environment: 'nuxt',
    // setupFiles: ['./setupTests.ts']
  },
  // resolve: {
  //   alies: {
  //     '#imports': '.nuxt/imports.d.ts'
  //     '#app': resolve(__dirname, './.nuxt/imports.d.ts'),
  //   }
  // }
})
