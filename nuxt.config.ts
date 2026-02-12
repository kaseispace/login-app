// https://nuxt.com/docs/api/configuration/nuxt-config

import { fileURLToPath } from 'node:url'

export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxt/ui'],
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  alias: {
    '#schemas': fileURLToPath(new URL('./schemas', import.meta.url)),
  },
  compatibilityDate: '2025-07-15',
  eslint: {
    config: {
      stylistic: true,
    },
  },
})
