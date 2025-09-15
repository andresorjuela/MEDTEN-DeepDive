import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools({
      enabled: true,
      componentInspector: true,
    })
  ],
  server: {
    proxy: {
      // For local dev without deploying the serverless function
      // If you run a local Node server for the PostHog proxy on port 8787:
      //   npm run posthog:dev (see command below)
      // Then we forward /api to it.
      '/api': {
        target: 'http://localhost:8787',
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
