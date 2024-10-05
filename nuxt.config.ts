// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  srcDir: 'src/',

  vite: {
    optimizeDeps: {
      include: [
        '@xeokit/xeokit-sdk/dist/xeokit-sdk.es.js',
        '@xeokit/xeokit-sdk/src/index.js'
      ],
    },
  }
})
