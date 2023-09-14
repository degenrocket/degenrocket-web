export default defineNuxtConfig({
  app: {
    head: {
    title: process.env.META_TITLE,
      meta: [
        // 'hid:' key-value pair can be removed
        { name: 'description', content: process.env.META_DESCRIPTION },
        { name: 'apple-mobile-web-app-title', content: process.env.META_TITLE },
        { name: 'og:title', property: 'og:title', content: process.env.META_TITLE },
        { name: 'og:site_name', property: 'og:site_name', content: process.env.META_TITLE },
        { name: 'og:description', property: 'og:description', content: process.env.META_DESCRIPTION }
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

      // Default meta values are used on other pages
      // so it's easy to change values in just one place.
      defaultMetaAppName: process.env.META_APP_NAME,
      defaultMetaTitle: process.env.META_TITLE,
      defaultMetaDescription: process.env.META_DESCRIPTION,

      // Default/custom intro and contacts
      enableDefaultIntro: process.env.ENABLE_DEFAULT_INTRO,
      enableDefaultContacts: process.env.ENABLE_DEFAULT_CONTACTS,
      enableCustomIntro: process.env.ENABLE_CUSTOM_INTRO,
      enableCustomContacts: process.env.ENABLE_CUSTOM_CONTACTS,

      introTitle: process.env.INTRO_TITLE,
      introAbout: process.env.INTRO_ABOUT,

      ifShowContactsInIntro: process.env.IF_SHOW_CONTACTS_IN_INTRO,
      ifShowIntroTutorial: process.env.IF_SHOW_INTRO_TUTORIAL,
      ifShowHomeLatestComments: process.env.IF_SHOW_HOME_LATEST_COMMENTS,

      // Another website links:
      anotherWebsiteLink: process.env.ANOTHER_WEBSITE_LINK,
      torLink: process.env.TOR_LINK,
      ipfsLink: process.env.IPFS_LINK,
      ipfsHttpGatewayLink: process.env.IPFS_HTTP_GATEWAY_LINK,

      // Social media links
      nostrLink: process.env.NOSTR_LINK,
      sessionLink: process.env.SESSION_LINK,
      lensLink: process.env.LENS_LINK,
      hiveLink: process.env.HIVE_LINK,
      mirrorLink: process.env.MIRROR_LINK,
      mastodonLink: process.env.MASTODON_LINK,
      matrixLink: process.env.MATRIX_LINK,
      discordLink: process.env.DISCORD_LINK,
      telegramLink: process.env.TELEGRAM_LINK,
      twitterLink: process.env.TWITTER_LINK,
      redditLink: process.env.REDDIT_LINK,
      youtubeLink: process.env.YOUTUBE_LINK,
      instagramLink: process.env.INSTAGRAM_LINK,
      facebookLink: process.env.FACEBOOK_LINK,
      githubLink: process.env.GITHUB_LINK,

      // Messengers
      nostrNpub: process.env.NOSTR_NPUB,
      sessionName: process.env.SESSION_NAME,
      matrixName: process.env.MATRIX_NAME,
      lensName: process.env.LENS_NAME,
      hiveName: process.env.HIVE_NAME,
      mirrorName: process.env.MIRROR_NAME,
      telegramName: process.env.TELEGRAM_NAME,
      twitterName: process.env.TWITTER_NAME,
      redditName: process.env.REDDIT_NAME,
      signalNumber: process.env.SIGNAL_NUMBER,
      whatsappNumber: process.env.WHATSAPP_NUMBER,
      xmppName: process.env.XMPP_NAME,

      // Blockchain
      uniswapLink: process.env.UNISWAP_LINK,
      sushiswapLink: process.env.SUSHISWAP_LINK,
      etherscanLink: process.env.ETHERSCAN_LINK,
      ethvmLink: process.env.ETHVM_LINK,
      coingeckoLink: process.env.COINGECKO_LINK,
      coinmarketcapLink: process.env.COINMARKETCAP_LINK,
      dextoolsLink: process.env.DEXTOOLS_LINK,

      ifShowDevelopersInfo: process.env.IF_SHOW_DEVELOPERS_INFO,

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
      name: process.env.MANIFEST_NAME,
      short_name: process.env.MANIFEST_SHORT_NAME,
      background_color: '#000000',
      theme_color: '#000000',
      id: process.env.MANIFEST_ID,
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
