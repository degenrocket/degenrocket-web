export default defineNuxtConfig({
  app: {
    head: {
    title: 'DegenRocket - DeFi and NFT news aggregator for degens',
      meta: [
        // 'hid:' key-value pair can be removed
        { name: 'description', content: 'Get the most important news about Web3, DeFi, NFTs, and Urbit. Interact with other degens by signing messages with your private key.' },
        { name: 'apple-mobile-web-app-title', content: 'DegenRocket - DeFi and NFTs news aggregator for degens' },
        { name: 'og:title', property: 'og:title', content: 'DegenRocket - DeFi and NFTs news aggregator for degens' },
        { name: 'og:site_name', property: 'og:site_name', content: 'DegenRocket - DeFi and NFTs news aggregator for degens' },
        { name: 'og:description', property: 'og:description', content: 'Get the most important news about Web3, DeFi, NFTs, and Urbit. Interact with other degens by signing messages with your private key.' }
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
      defaultMetaAppName: 'DegenRocket',
      defaultMetaTitle: 'DegenRocket - DeFi and NFT news aggregator for degens',
      defaultMetaDescription: 'Get the most important news about Web3, DeFi, NFTs, and Urbit. Interact with other degens by signing messages with your private key.'
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
      name: 'DegenRocket.space',
      short_name: 'DegenRocket',
      background_color: '#000000',
      theme_color: '#000000',
      id: 'degenrocket.space',
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
