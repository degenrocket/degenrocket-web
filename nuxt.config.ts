export default defineNuxtConfig({
  devServer: {
    port: parseInt(process.env.FRONTEND_DEV_PORT as string) || 3000
  },

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

      // Testing
      useMockedDataIfBackendIsDown: process.env.USE_MOCKED_DATA_IF_BACKEND_IS_DOWN,

      // Default meta values are used on other pages
      // so it's easy to change values in just one place.
      defaultMetaAppName: process.env.META_APP_NAME,
      defaultMetaTitle: process.env.META_TITLE,
      defaultMetaDescription: process.env.META_DESCRIPTION,

      // App config
      enableAppConfigChanges: process.env.ENABLE_APP_CONFIG_CHANGES,
      enableAppConfigChangesByAdmin: process.env.ENABLE_APP_CONFIG_CHANGES_BY_ADMIN,

      // Admin
      enableAdmin: process.env.ENABLE_ADMIN,
      admins: process.env.ADMINS,

      // Moderation
      enableModeration: process.env.ENABLE_MODERATION,
      moderators: process.env.MODERATORS,

      // Default/custom intro and contacts
      enableDefaultIntro: process.env.ENABLE_DEFAULT_INTRO,
      enableDefaultContacts: process.env.ENABLE_DEFAULT_CONTACTS,
      enableCustomIntro: process.env.ENABLE_CUSTOM_INTRO,
      enableCustomContacts: process.env.ENABLE_CUSTOM_CONTACTS,

      introTitle: process.env.INTRO_TITLE,
      introTitleExtra: process.env.INTRO_TITLE_EXTRA,
      introAbout: process.env.INTRO_ABOUT,

      postPlaceholder: process.env.POST_PLACEHOLDER,
      commentPlaceholder: process.env.COMMENT_PLACEHOLDER,

      ifShowContactsInIntro: process.env.IF_SHOW_CONTACTS_IN_INTRO,
      ifShowIntroTutorial: process.env.IF_SHOW_INTRO_TUTORIAL,
      ifShowHomeLatestComments: process.env.IF_SHOW_HOME_LATEST_COMMENTS,

      // Menu
      showNewPostButtonInMenu: process.env.SHOW_NEW_POST_BUTTON_IN_MENU,

      // Enable shortened URLs for web3 actions
      enableShortUrlsForWeb3Actions: process.env.ENABLE_SHORT_URLS_FOR_WEB3_ACTIONS,
      shortUrlsLengthOfWeb3Ids: process.env.SHORT_URLS_LENGTH_OF_WEB3_IDS,

      // New web3 actions
      enableNewWeb3ActionsAll: process.env.ENABLE_NEW_WEB3_ACTIONS_ALL,
      enableNewWeb3ActionsPost: process.env.ENABLE_NEW_WEB3_ACTIONS_POST,
      enableNewWeb3ActionsReply: process.env.ENABLE_NEW_WEB3_ACTIONS_REPLY,
      enableNewWeb3ActionsReact: process.env.ENABLE_NEW_WEB3_ACTIONS_REACT,
      enableNewWeb3ActionsModerate: process.env.ENABLE_NEW_WEB3_ACTIONS_MODERATE,

      enableNewNostrActionsAll: process.env.ENABLE_NEW_NOSTR_ACTIONS_ALL,
      enableNewEthereumActionsAll: process.env.ENABLE_NEW_ETHEREUM_ACTIONS_ALL,

      // White list
      enableWhitelistForActionPost: process.env.ENABLE_WHITELIST_FOR_ACTION_POST,
      whitelistedForActionPost: process.env.WHITELISTED_FOR_ACTION_POST,
      enableWhitelistForActionReply: process.env.ENABLE_WHITELIST_FOR_ACTION_REPLY,
      whitelistedForActionReply: process.env.WHITELISTED_FOR_ACTION_REPLY,
      enableWhitelistForActionReact: process.env.ENABLE_WHITELIST_FOR_ACTION_REACT,
      whitelistedForActionReact: process.env.WHITELISTED_FOR_ACTION_REACT,

      // Nostr network
      enableNostrNetwork: process.env.ENABLE_NOSTR_NETWORK,
      enableNostrNetworkFetchProfiles: process.env.ENABLE_NOSTR_NETWORK_FETCH_PROFILES,
      enableNostrNetworkFetchPreferredRelays: process.env.ENABLE_NOSTR_NETWORK_FETCH_PREFERRED_RELAYS,
      enableNostrNetworkFetchMessages: process.env.ENABLE_NOSTR_NETWORK_FETCH_MESSAGES,
      enableNostrNetworkUsePreferredRelays: process.env.ENABLE_NOSTR_NETWORK_USE_PREFERRED_RELAYS,
      enableNostrDisplayProfilesUsernames: process.env.ENABLE_NOSTR_DISPLAY_PROFILES_USERNAMES,
      enableNostrDisplayProfilesAbouts: process.env.ENABLE_NOSTR_DISPLAY_PROFILES_ABOUTS,
      enableNostrDisplayProfilesWebsites: process.env.ENABLE_NOSTR_DISPLAY_PROFILES_WEBSITES,
      enableNostrDisplayProfilesPictures: process.env.ENABLE_NOSTR_DISPLAY_PROFILES_PICTURES,
      enableNostrDisplayProfilesMessages: process.env.ENABLE_NOSTR_DISPLAY_PROFILES_MESSAGES,
      nostrDefaultRelays: process.env.NOSTR_DEFAULT_RELAYS,

      // Markdown
      enableMarkdownInPosts: process.env.ENABLE_MARKDOWN_IN_POSTS,
      enableMarkdownInComments: process.env.ENABLE_MARKDOWN_IN_COMMENTS,

      // Iframe tags (warning: manage with caution)
      enableEmbedIframeTagsForSelectedUsers: process.env.ENABLE_EMBED_IFRAME_TAGS_FOR_SELECTED_USERS,
      enableEmbedIframeTagsInPosts: process.env.ENABLE_EMBED_IFRAME_TAGS_IN_POSTS,
      enableEmbedIframeTagsInComments: process.env.ENABLE_EMBED_IFRAME_TAGS_IN_COMMENTS,
      signersAllowedToEmbedIframeTags: process.env.SIGNERS_ALLOWED_TO_EMBED_IFRAME_TAGS,
      iframeTagsAllowedDomains: process.env.IFRAME_TAGS_ALLOWED_DOMAINS,
      iframeVideoWidth: process.env.IFRAME_VIDEO_WIDTH,
      iframeVideoHeight: process.env.IFRAME_VIDEO_HEIGHT,
      iframeAdditionalParams: process.env.IFRAME_ADDITIONAL_PARAMS,
      iframeHideOneLineUrl: process.env.IFRAME_HIDE_ONE_LINE_URL,

      // Default explorers for Ethereum/Nostr addresses
      defaultExplorerEthereumAddress: process.env.DEFAULT_EXPLORER_ETHEREUM_ADDRESS,
      defaultExplorerNostrAddress: process.env.DEFAULT_EXPLORER_NOSTR_ADDRESS,

      // Another website links
      anotherWebsiteLink: process.env.ANOTHER_WEBSITE_LINK,
      torLink: process.env.TOR_LINK,
      ipfsLink: process.env.IPFS_LINK,
      ipfsHttpGatewayLink: process.env.IPFS_HTTP_GATEWAY_LINK,

      // Social media links
      nostrLink: process.env.NOSTR_LINK,
      sessionLink: process.env.SESSION_LINK,
      simplexLink: process.env.SIMPLEX_LINK,
      statusLink: process.env.STATUS_LINK,
      lensLink: process.env.LENS_LINK,
      farcasterLink: process.env.FARCASTER_LINK,
      hiveLink: process.env.HIVE_LINK,
      pushLink: process.env.PUSH_LINK,
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
      linkedinLink: process.env.LINKEDIN_LINK,
      wikipediaLink: process.env.WIKIPEDIA_LINK,
      githubLink: process.env.GITHUB_LINK,

      // Messengers
      nostrNpub: process.env.NOSTR_NPUB,
      sessionName: process.env.SESSION_NAME,
      matrixName: process.env.MATRIX_NAME,
      lensName: process.env.LENS_NAME,
      farcasterName: process.env.FARCASTER_NAME,
      hiveName: process.env.HIVE_NAME,
      pushName: process.env.PUSH_NAME,
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
      dexscreenerLink: process.env.DEXSCREENER_LINK,
      birdeyeLink: process.env.BIRDEYE_LINK,
      geckoterminalLink: process.env.GECKOTERMINAL_LINK,

      // Extra contact links
      extraContactInfo: process.env.EXTRA_CONTACT_INFO,

      ifShowDevelopersInfo: process.env.IF_SHOW_DEVELOPERS_INFO,

      // Categories
      ifShowCategoriesFilter: process.env.IF_SHOW_CATEGORIES_FILTER,
      envCategories:
        (
          process.env.CATEGORIES &&
          typeof(process.env.CATEGORIES) === "string"
        )
        ? process.env.CATEGORIES.toLowerCase().split(',').map(v => v.trim())
        : ['defi','nft','privacy','politics','tech'],

      ifAllowGuestLogin: process.env.IF_ALLOW_GUEST_LOGIN,

      // Authors:
      enableAutoGeneratedNames: process.env.ENABLE_AUTO_GENERATED_NAMES,
      enableAutoGeneratedNamesDictionaryTech: process.env.ENABLE_AUTO_GENERATED_NAMES_DICTIONARY_TECH,

      // Feed filters
      feedFiltersActivityHot: process.env.FEED_FILTERS_ACTIVITY_HOT,
      feedFiltersActivityRising: process.env.FEED_FILTERS_ACTIVITY_RISING,
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

  compatibilityDate: '2024-08-08',
})
