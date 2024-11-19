// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // compatibilityDate: '2024-04-03',
  routeRules: {
    '/inicio': { ssr: true, static: true },
  },
  runtimeConfig: {
    public: {
      urlApi: process.env.URL_API_BASE,
    }
  },
  devServer: {
    port: 3002
  },
  modules: ['@nuxtjs/tailwindcss', '@vueuse/nuxt', 'nuxt-icons', '@nuxt/image', '@pinia/nuxt'],
  devtools: { enabled: true },
  imports: {
    dirs: ['stores', 'composables/**'],
  },
})