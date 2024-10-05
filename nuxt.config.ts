import Aura from '@primevue/themes/aura';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  ssr: false,

  srcDir: 'src/',

  modules: ['@primevue/nuxt-module'],

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
