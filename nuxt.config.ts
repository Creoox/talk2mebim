import Aura from '@primevue/themes/aura';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  ssr: false,

  srcDir: 'src/',

  runtimeConfig: {
    OPENAI_API_KEY: '',
  },

  modules: ['@primevue/nuxt-module', '@pinia/nuxt', '@nuxtjs/tailwindcss'],

  css: ['~/assets/main.scss'],

  primevue: {
    options: {
      theme: {
        preset: Aura,
      },
    },
  },

  vite: {
    optimizeDeps: {
      include: ['@xeokit/xeokit-sdk/dist/xeokit-sdk.es.js', '@xeokit/xeokit-sdk/src/index.js'],
    },
  },

  build: {
    transpile: ['trpc-nuxt'],
  },
});
