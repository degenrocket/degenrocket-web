export default defineNuxtConfig({
  app: {
    head: {
    title: process.env.CUSTOM_META_TITLE,
      meta: [
        // 'hid:' key-value pair can be removed
        { name: 'description', content: process.env.CUSTOM_META_DESCRIPTION },
        { name: 'apple-mobile-web-app-title', content: process.env.CUSTOM_META_TITLE },
        { name: 'og:title', property: 'og:title', content: process.env.CUSTOM_META_TITLE },
        { name: 'og:site_name', property: 'og:site_name', content: process.env.CUSTOM_META_TITLE },
        { name: 'og:description', property: 'og:description', content: process.env.CUSTOM_META_DESCRIPTION }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'shortcut icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', href: '/favicon.ico', sizes: '512x512' },
      ]
    }
  },

  runtimeConfig: {
    public: {
      apiURL: process.env.API_URL,
      apiHOST: process.env.API_HOST,
      apiPORT: process.env.API_PORT,

      // Default meta values are used on other pages
      // so it's easy to change values in just one place.
      defaultMetaAppName: process.env.CUSTOM_META_APP_NAME,
      defaultMetaTitle: process.env.CUSTOM_META_TITLE,
      defaultMetaDescription: process.env.CUSTOM_META_DESCRIPTION,

      ifShowCategoriesFilter: process.env.IF_SHOW_CATEGORIES_FILTER,
      ifAllowGuestLogin: process.env.IF_ALLOW_GUEST_LOGIN,
    }
  },

  // modules
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    '@pinia/nuxt',
    '@vite-pwa/nuxt'
  ],
  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
    configPath: 'tailwind.config.js',
    exposeConfig: false,
    config: {},
    injectPosition: 0,
    viewer: true,
  },
  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'dark',
  },
  typescript: {
    strict: true
  },

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: process.env.CUSTOM_MANIFEST_NAME,
      short_name: process.env.CUSTOM_MANIFEST_SHORT_NAME,
      background_color: '#000000',
      theme_color: '#000000',
      id: process.env.CUSTOM_MANIFEST_ID,
      start_url: '.',
      display: 'standalone',
      lang: 'en',
      icons: [
        {
          src: 'pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
        // {
        //   src: 'pwa-512x512.png',
        //   sizes: '512x512',
        //   type: 'image/png',
        //   purpose: 'any maskable',
        // },
      ],
    },
    workbox: {
      // navigateFallback: '/',
      // globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
    },
    client: {
      installPrompt: true,
      // you don't need to include this: only for testing purposes
      // if enabling periodic sync for update use 1 hour or so (periodicSyncForUpdates: 3600)
      // periodicSyncForUpdates: 20,
    },
    devOptions: {
      enabled: true,
      type: 'module',
    },
  },
})
