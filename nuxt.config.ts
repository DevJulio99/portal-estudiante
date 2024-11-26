// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // compatibilityDate: '2024-04-03',
  routeRules: {
    '/inicio': { ssr: false, static: true },
    '/**': { ssr: false },
  },
  runtimeConfig: {
    public: {
      urlApi: process.env.URL_API_BASE,
    }
  },
  modules: ['@nuxtjs/tailwindcss', '@vueuse/nuxt', 'nuxt-icons', '@nuxt/image', '@pinia/nuxt'],
  devtools: { enabled: true },
  imports: {
    dirs: ['stores', 'composables/**'],
  },
  vite: {
    server: {
      hmr : {
        protocol: "http",
        host: 'localhost',
        clientPort: 3000,
        port: 3000,
      }
    }
  }
})