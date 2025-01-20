import {defineStore} from 'pinia'
import {
  AppConfig,
  AppConfigKeyBoolean,
  AppConfigKeyArray,
  AppConfigKeyString,
  AppConfigKeyNumber,
} from './../helpers/interfaces'
import {useEventsStore} from './useEventsStore'
const {
  splitIntoArray
} = useUtils()

interface AppConfigState extends AppConfig {}

export const useAppConfigStore = defineStore('appConfigStore', {
  state: (): AppConfigState => ({
    // Environment settings:
    apiUrl: useRuntimeConfig()?.public?.apiURL,
    enableAppConfigChanges: useRuntimeConfig()?.public?.enableAppConfigChanges === "false" ? false : true,
    enableAppConfigChangesByAdmin: useRuntimeConfig()?.public?.enableAppConfigChangesByAdmin === "false" ? false : true,
    enableAdmin: useRuntimeConfig()?.public?.enableAdmin === "false" ? false : true,
    admins: useRuntimeConfig()?.public?.admins,
    // TODO backend env vars
    // Not set in frontend .env file:
    allowNewEventsWithoutSignature: undefined,

    // Set in frontend .env file:
    // Strings
    anotherWebsiteLink: useRuntimeConfig()?.public?.anotherWebsiteLink,
    ipfsLink: useRuntimeConfig()?.public?.ipfsLink,
    torLink: useRuntimeConfig()?.public?.torLink,
    ipfsHttpGatewayLink: useRuntimeConfig()?.public?.ipfsHttpGatewayLink,
    nostrLink: useRuntimeConfig()?.public?.nostrLink,
    sessionLink: useRuntimeConfig()?.public?.sessionLink,
    simplexLink: useRuntimeConfig()?.public?.simplexLink,
    statusLink: useRuntimeConfig()?.public?.statusLink,
    lensLink: useRuntimeConfig()?.public?.lensLink,
    hiveLink: useRuntimeConfig()?.public?.hiveLink,
    pushLink: useRuntimeConfig()?.public?.pushLink,
    mirrorLink: useRuntimeConfig()?.public?.mirrorLink,
    mastodonLink: useRuntimeConfig()?.public?.mastodonLink,
    matrixLink: useRuntimeConfig()?.public?.matrixLink,
    discordLink: useRuntimeConfig()?.public?.discordLink,
    telegramLink: useRuntimeConfig()?.public?.telegramLink,
    twitterLink: useRuntimeConfig()?.public?.twitterLink,
    redditLink: useRuntimeConfig()?.public?.redditLink,
    youtubeLink: useRuntimeConfig()?.public?.youtubeLink,
    instagramLink: useRuntimeConfig()?.public?.instagramLink,
    facebookLink: useRuntimeConfig()?.public?.facebookLink,
    linkedinLink: useRuntimeConfig()?.public?.linkedinLink,
    wikipediaLink: useRuntimeConfig()?.public?.wikipediaLink,
    githubLink: useRuntimeConfig()?.public?.githubLink,
    nostrNpub: useRuntimeConfig()?.public?.nostrNpub,
    sessionName: useRuntimeConfig()?.public?.sessionName,
    matrixName: useRuntimeConfig()?.public?.matrixName,
    lensName: useRuntimeConfig()?.public?.lensName,
    hiveName: useRuntimeConfig()?.public?.hiveName,
    pushName: useRuntimeConfig()?.public?.pushName,
    mirrorName: useRuntimeConfig()?.public?.mirrorName,
    telegramName: useRuntimeConfig()?.public?.telegramName,
    twitterName: useRuntimeConfig()?.public?.twitterName,
    redditName: useRuntimeConfig()?.public?.redditName,
    signalNumber: useRuntimeConfig()?.public?.signalNumber,
    whatsappNumber: useRuntimeConfig()?.public?.whatsappNumber,
    xmppName: useRuntimeConfig()?.public?.xmppName,
    uniswapLink: useRuntimeConfig()?.public?.uniswapLink,
    sushiswapLink: useRuntimeConfig()?.public?.sushiswapLink,
    etherscanLink: useRuntimeConfig()?.public?.etherscanLink,
    ethvmLink: useRuntimeConfig()?.public?.ethvmLink,
    coingeckoLink: useRuntimeConfig()?.public?.coingeckoLink,
    coinmarketcapLink: useRuntimeConfig()?.public?.coinmarketcapLink,
    dextoolsLink: useRuntimeConfig()?.public?.dextoolsLink,
    dexscreenerLink: useRuntimeConfig()?.public?.dexscreenerLink,
    birdeyeLink: useRuntimeConfig()?.public?.birdeyeLink,
    geckoterminalLink: useRuntimeConfig()?.public?.geckoterminalLink,
    extraContactInfo: useRuntimeConfig()?.public?.extraContactInfo,

    // Booleans
    enableNewWeb3ActionsAll: useRuntimeConfig()?.public?.enableNewWeb3ActionsAll === "false" ? false : true,
    enableNewWeb3ActionsPost: useRuntimeConfig()?.public?.enableNewWeb3ActionsPost === "false" ? false : true,
    enableNewWeb3ActionsReply: useRuntimeConfig()?.public?.enableNewWeb3ActionsReply === "false" ? false : true,
    enableNewWeb3ActionsReact: useRuntimeConfig()?.public?.enableNewWeb3ActionsReact === "false" ? false : true,
    enableNewWeb3ActionsModerate: useRuntimeConfig()?.public?.enableNewWeb3ActionsModerate === "false" ? false : true,
    enableNewNostrActionsAll: useRuntimeConfig()?.public?.enableNewNostrActionsAll === 'true' ? true : false,
    enableNewEthereumActionsAll: useRuntimeConfig()?.public?.enableNewEthereumActionsAll === 'true' ? true : false,
    enableModeration: useRuntimeConfig()?.public?.enableModeration === 'false'? false : true,
    enableShortUrlsForWeb3Actions: useRuntimeConfig()?.public?.enableShortUrlsForWeb3Actions === "true" ? true : false,
    enableWhitelistForActionPost: useRuntimeConfig()?.public?.enableWhitelistForActionPost === 'true'? true : false,
    enableWhitelistForActionReply: useRuntimeConfig()?.public?.enableWhitelistForActionReply === 'true'? true : false,
    enableWhitelistForActionReact: useRuntimeConfig()?.public?.enableWhitelistForActionReact === 'true'? true : false,
    // TODO backend env vars
    enableSpasmModule: undefined,
    enableSpasmSourcesUpdates: undefined,
    enableRssModule: undefined,
    enableRssSourcesUpdates: undefined,
    ignoreWhitelistForActionPostInSpasmModule: undefined,
    ignoreWhitelistForActionReplyInSpasmModule: undefined,
    ignoreWhitelistForActionReactInSpasmModule: undefined,

    // Arrays
    moderators: splitIntoArray(useRuntimeConfig()?.public?.moderators),
    whitelistedForActionPost: splitIntoArray(useRuntimeConfig()?.public?.whitelistedForActionPost),
    whitelistedForActionReply: splitIntoArray(useRuntimeConfig()?.public?.whitelistedForActionReply),
    whitelistedForActionReact: splitIntoArray(useRuntimeConfig()?.public?.whitelistedForActionReact),

    // Numbers
    shortUrlsLengthOfWeb3Ids: Number(useRuntimeConfig()?.public?.shortUrlsLengthOfWeb3Ids) || 30,
    feedFiltersActivityHot: Number(useRuntimeConfig()?.public?.feedFiltersActivityHot) || 5,
    feedFiltersActivityRising: Number(useRuntimeConfig()?.public?.feedFiltersActivityRising) || 3,
  }),
  getters: {
    getAppConfig(): AppConfig {
      const appConfig = {
        // Strings
        apiUrl:
          this.apiUrl,
        // Booleans
        enableAppConfigChanges:
          this.enableAppConfigChanges,
        enableAppConfigChangesByAdmin:
          this.enableAppConfigChangesByAdmin,
        enableAdmin:
          this.enableAdmin,
        allowNewEventsWithoutSignature:
          this.allowNewEventsWithoutSignature,
        enableNewWeb3ActionsAll:
          this.enableNewWeb3ActionsAll,
        enableNewWeb3ActionsPost:
          this.enableNewWeb3ActionsPost,
        enableNewWeb3ActionsReact:
          this.enableNewWeb3ActionsReact,
        enableNewWeb3ActionsReply:
          this.enableNewWeb3ActionsReply,
        enableNewWeb3ActionsModerate:
          this.enableNewWeb3ActionsModerate,
        enableNewNostrActionsAll:
          this.enableNewNostrActionsAll,
        enableNewEthereumActionsAll:
          this.enableNewEthereumActionsAll,
        enableModeration:
          this.enableModeration,
        enableShortUrlsForWeb3Actions:
          this.enableShortUrlsForWeb3Actions,
        enableWhitelistForActionPost:
          this.enableWhitelistForActionPost,
        enableWhitelistForActionReply:
          this.enableWhitelistForActionReply,
        enableWhitelistForActionReact:
          this.enableWhitelistForActionReact,
        enableSpasmModule:
          this.enableSpasmModule,
        enableSpasmSourcesUpdates:
          this.enableSpasmSourcesUpdates,
        enableRssModule:
          this.enableRssModule,
        enableRssSourcesUpdates:
          this.enableRssSourcesUpdates,
        ignoreWhitelistForActionPostInSpasmModule:
          this.ignoreWhitelistForActionPostInSpasmModule,
        ignoreWhitelistForActionReplyInSpasmModul:
          this.ignoreWhitelistForActionReplyInSpasmModul,
        ignoreWhitelistForActionReactInSpasmModule:
          this.ignoreWhitelistForActionReactInSpasmModule,
        // Arrays
        admins:
          this.admins,
        moderators:
          this.moderators,
        whitelistedForActionPost:
          this.whitelistedForActionPost,
        whitelistedForActionReply:
          this.whitelistedForActionReply,
        whitelistedForActionReact:
          this.whitelistedForActionReact,
        // Numbers
        shortUrlsLengthOfWeb3Ids:
          this.shortUrlsLengthOfWeb3Ids,
        feedFiltersActivityHot:
          this.feedFiltersActivityHot,
        feedFiltersActivityRising:
          this.feedFiltersActivityRising,
        // Strings
        anotherWebsiteLink: this.anotherWebsiteLink,
        ipfsLink: this.ipfsLink,
        torLink: this.torLink,
        ipfsHttpGatewayLink: this.ipfsHttpGatewayLink,
        nostrLink: this.nostrLink,
        sessionLink: this.sessionLink,
        simplexLink: this.simplexLink,
        statusLink: this.statusLink,
        lensLink: this.lensLink,
        hiveLink: this.hiveLink,
        pushLink: this.pushLink,
        mirrorLink: this.mirrorLink,
        mastodonLink: this.mastodonLink,
        matrixLink: this.matrixLink,
        discordLink: this.discordLink,
        telegramLink: this.telegramLink,
        twitterLink: this.twitterLink,
        redditLink: this.redditLink,
        youtubeLink: this.youtubeLink,
        instagramLink: this.instagramLink,
        facebookLink: this.facebookLink,
        linkedinLink: this.linkedinLink,
        wikipediaLink: this.wikipediaLink,
        githubLink: this.githubLink,
        nostrNpub: this.nostrNpub,
        sessionName: this.sessionName,
        matrixName: this.matrixName,
        lensName: this.lensName,
        hiveName: this.hiveName,
        pushName: this.pushName,
        mirrorName: this.mirrorName,
        telegramName: this.telegramName,
        twitterName: this.twitterName,
        redditName: this.redditName,
        signalNumber: this.signalNumber,
        whatsappNumber: this.whatsappNumber,
        xmppName: this.xmppName,
        uniswapLink: this.uniswapLink,
        sushiswapLink: this.sushiswapLink,
        etherscanLink: this.etherscanLink,
        ethvmLink: this.ethvmLink,
        coingeckoLink: this.coingeckoLink,
        coinmarketcapLink: this.coinmarketcapLink,
        dextoolsLink: this.dextoolsLink,
        dexscreenerLink: this.dexscreenerLink,
        birdeyeLink: this.birdeyeLink,
        geckoterminalLink: this.geckoterminalLink,
        extraContactInfo: this.extraContactInfo,
      }
      return appConfig
    }
  },
  actions: {
    async fetchAndUpdateAppConfig(
    ): Promise<void> {
      try {
        if (!this.apiUrl) { return }
        const path = this.apiUrl + '/api/app-config'
        const appConfig = await $fetch(path)
        if (!appConfig) { return }
        if (typeof(appConfig) !== "object") { return }
        this.updateAppConfig(appConfig)
        // Change states (load app config) in other stores:
        // Currently, calling the update function only on the
        // client-side, because calling it during the server-side
        // rendering (SSR) gives an error.
        if (process.client) {
          const res = useEventsStore().updateStateAppConfig()
        }
      } catch (err) {
        console.error(err);
      }
    },
    updateAppConfig(
      config: AppConfig
    ):void {
      if (!config) { return }
      if (typeof(config) !== "object") { return }

      // Booleans
      const updateBoolean = (key: AppConfigKeyBoolean) => {
        if (
          key in config && typeof(config[key]) === "boolean"
        ) { this[key] = config[key] }
      }
      updateBoolean("allowNewEventsWithoutSignature")
      updateBoolean("enableNewWeb3ActionsAll")
      updateBoolean("enableNewWeb3ActionsPost")
      updateBoolean("enableNewWeb3ActionsReact")
      updateBoolean("enableNewWeb3ActionsReply")
      updateBoolean("enableNewWeb3ActionsModerate")
      updateBoolean("enableNewNostrActionsAll")
      updateBoolean("enableNewEthereumActionsAll")
      updateBoolean("enableModeration")
      updateBoolean("enableShortUrlsForWeb3Actions")
      updateBoolean("enableWhitelistForActionPost")
      updateBoolean("enableWhitelistForActionReply")
      updateBoolean("enableWhitelistForActionReact")
      updateBoolean("enableSpasmModule")
      updateBoolean("enableSpasmSourcesUpdates")
      updateBoolean("enableRssModule")
      updateBoolean("enableRssSourcesUpdates")
      updateBoolean("ignoreWhitelistForActionPostInSpasmModule")
      updateBoolean("ignoreWhitelistForActionReactInSpasmModule")
      updateBoolean("ignoreWhitelistForActionReplyInSpasmModul")

      // Arrays
      const updateArray = (key: AppConfigKeyArray) => {
        if (key in config) {
          if (Array.isArray(config[key])) {
            this[key] = config[key]
          }
        }
      }
      updateArray("moderators")
      updateArray("whitelistedForActionPost")
      updateArray("whitelistedForActionReply")
      updateArray("whitelistedForActionReact")

      // Numbers
      const updateNumber = (key: AppConfigKeyNumber) => {
        if (key in config) {
          if (typeof(config[key]) === "number") {
            this[key] = config[key]
          } else if (Number(config[key])) {
            this[key] = Number(config[key])
          }
        }
      }
      updateNumber("shortUrlsLengthOfWeb3Ids")
      updateNumber("feedFiltersActivityHot")
      updateNumber("feedFiltersActivityRising")

      // Strings
      const updateString = (key: AppConfigKeyString) => {
        if (key in config) {
          if (typeof(config[key]) === "string") {
            this[key] = config[key]
          }
        }
      }
      updateString("anotherWebsiteLink")
      updateString("ipfsLink")
      updateString("torLink")
      updateString("ipfsHttpGatewayLink")
      updateString("nostrLink")
      updateString("sessionLink")
      updateString("simplexLink")
      updateString("statusLink")
      updateString("lensLink")
      updateString("hiveLink")
      updateString("pushLink")
      updateString("mirrorLink")
      updateString("mastodonLink")
      updateString("matrixLink")
      updateString("discordLink")
      updateString("telegramLink")
      updateString("twitterLink")
      updateString("redditLink")
      updateString("youtubeLink")
      updateString("instagramLink")
      updateString("facebookLink")
      updateString("linkedinLink")
      updateString("wikipediaLink")
      updateString("githubLink")
      updateString("nostrNpub")
      updateString("sessionName")
      updateString("matrixName")
      updateString("lensName")
      updateString("hiveName")
      updateString("pushName")
      updateString("mirrorName")
      updateString("telegramName")
      updateString("twitterName")
      updateString("redditName")
      updateString("signalNumber")
      updateString("whatsappNumber")
      updateString("xmppName")
      updateString("uniswapLink")
      updateString("sushiswapLink")
      updateString("etherscanLink")
      updateString("ethvmLink")
      updateString("coingeckoLink")
      updateString("coinmarketcapLink")
      updateString("dextoolsLink")
      updateString("dexscreenerLink")
      updateString("birdeyeLink")
      updateString("geckoterminalLink")
      updateString("extraContactInfo")
    }
  }
})

