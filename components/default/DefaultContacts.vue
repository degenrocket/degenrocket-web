<template>
  <div>
    <div v-if="anotherWebsiteLink">
      Website:
        <a :href="anotherWebsiteLink" target="_blank" class="text-colorPrimary-light dark:text-colorPrimary-dark">
          {{anotherWebsiteLink}}
        </a>
    </div>
    <div v-if="torLink">
      Tor:
        <a :href="torLink" target="_blank" class="text-colorPrimary-light dark:text-colorPrimary-dark">
          {{torLink}}
        </a>
    </div>
    <div v-if="ipfsLink">
      IPFS (Brave browser):
        <a :href="ipfsLink" target="_blank" class="text-colorPrimary-light dark:text-colorPrimary-dark">
          {{ipfsLink}}
        </a>
    </div>
    <div v-if="ipfsHttpGatewayLink">
      IPFS (any browser):
        <a :href="ipfsHttpGatewayLink" target="_blank" class="text-colorPrimary-light dark:text-colorPrimary-dark">
          {{ipfsHttpGatewayLink}}
        </a>
    </div>

    <div v-if="uniswapLink || sushiswapLink">
      Trade:
      <span v-if="uniswapLink">
        <a :href="uniswapLink" target="_blank" class="text-colorPrimary-light dark:text-colorPrimary-dark">
          Uniswap
        </a>
      </span>
      <span v-if="sushiswapLink">
        <a :href="sushiswapLink" target="_blank" class="text-colorPrimary-light dark:text-colorPrimary-dark">
          Sushi
        </a>
      </span>
    </div>

    <div v-if="etherscanLink || ethvmLink">
      Contract:
      <span v-if="etherscanLink">
        <a :href="etherscanLink" target="_blank" class="text-colorPrimary-light dark:text-colorPrimary-dark">
          Etherscan
        </a>
      </span>
      <span v-if="ethvmLink">
        <a :href="ethvmLink" target="_blank" class="text-colorPrimary-light dark:text-colorPrimary-dark">
          EthVM
        </a>
      </span>
    </div>

    <div v-if="coingeckoLink || coinmarketcapLink || dextoolsLink">
      Charts:
      <span v-if="coingeckoLink">
        <a :href="coingeckoLink" target="_blank" class="text-colorPrimary-light dark:text-colorPrimary-dark">
          Coingecko
        </a>
      </span>
      <span v-if="coinmarketcapLink">
        <a :href="coinmarketcapLink" target="_blank" class="text-colorPrimary-light dark:text-colorPrimary-dark">
          Coinmarketcap
        </a>
      </span>
      <span v-if="dextoolsLink">
        <a :href="dextoolsLink" target="_blank" class="text-colorPrimary-light dark:text-colorPrimary-dark">
          Dextools
        </a>
      </span>
      <span v-if="dexscreenerLink">
        <a :href="dexscreenerLink" target="_blank" class="text-colorPrimary-light dark:text-colorPrimary-dark">
          Dexscreener
        </a>
      </span>
      <span v-if="birdeyeLink">
        <a :href="birdeyeLink" target="_blank" class="text-colorPrimary-light dark:text-colorPrimary-dark">
          Birdeye
        </a>
      </span>
      <span v-if="geckoterminalLink">
        <a :href="geckoterminalLink" target="_blank" class="text-colorPrimary-light dark:text-colorPrimary-dark">
          GeckoTerminal
        </a>
      </span>
    </div>

    <div v-if="nostrNpub">
      Nostr:
      <span v-if="nostrNpub">
        {{nostrNpub}}
      </span>
    </div>

    <div v-if="sessionName">
      Session:
      <span v-if="sessionName">
        <a href="https://getsession.org" target="_blank" class="text-colorPrimary-light dark:text-colorPrimary-dark">
          {{sessionName}}
        </a>
      </span>
    </div>

    <div v-if="matrixName">
      Matrix:
      <span v-if="matrixName">
        {{matrixName}}
      </span>
    </div>

    <div v-if="lensName">
      Lens:
      <span v-if="lensName">
        {{lensName}}
      </span>
    </div>

    <div v-if="hiveName">
      Hive:
      <span v-if="hiveName">
        {{hiveName}}
      </span>
    </div>

    <div v-if="pushName">
      Push:
      <span v-if="pushName">
        {{pushName}}
      </span>
    </div>

    <div v-if="mirrorName">
      Mirror:
      <span v-if="mirrorName">
        {{mirrorName}}
      </span>
    </div>

    <div v-if="telegramName">
      Telegram:
      <span v-if="telegramName && telegramLink">
        <a :href="telegramLink" target="_blank" class="text-colorPrimary-light dark:text-colorPrimary-dark">
          {{telegramName}}
        </a>
      </span>
      <span v-if="telegramName && !telegramLink">
          {{telegramName}}
      </span>
    </div>

    <div v-if="twitterName">
      Twitter:
      <span v-if="twitterName">
        {{twitterName}}
      </span>
    </div>

    <div v-if="redditName">
      Reddit:
      <span v-if="redditName">
        {{redditName}}
      </span>
    </div>

    <div v-if="signalNumber">
      Signal:
      <span v-if="signalNumber">
        {{signalNumber}}
      </span>
    </div>

    <div v-if="whatsappNumber">
      Whatsapp:
      <span v-if="whatsappNumber">
        {{whatsappNumber}}
      </span>
    </div>

    <div v-if="xmppName">
      XMPP:
      <span v-if="xmppName">
        {{xmppName}}
      </span>
    </div>

    <div v-if="nostrLink || sessionLink || simplexLink || statusLink || lensLink || hiveLink || pushLink || mirrorLink || mastodonLink || matrixLink || discordLink || telegramLink || twitterLink || redditLink || youtubeLink || instagramLink || facebookLink || linkedinLink || wikipediaLink || githubLink">
      Follow:
      <span v-if="nostrLink">
        <a :href="nostrLink" target="_blank" class="text-colorPrimary-light dark:text-colorPrimary-dark">
          Nostr
        </a>
      </span>
      <span v-if="sessionLink">
        <a :href="sessionLink" target="_blank" class="text-colorPrimary-light dark:text-colorPrimary-dark">
          Session
        </a>
      </span>
      <span v-if="simplexLink">
        <a :href="simplexLink" target="_blank" class="text-colorPrimary-light dark:text-colorPrimary-dark">
          SimpleX
        </a>
      </span>
      <span v-if="statusLink">
        <a :href="statusLink" target="_blank" class="text-colorPrimary-light dark:text-colorPrimary-dark">
          Status
        </a>
      </span>
      <span v-if="lensLink">
        <a :href="lensLink" target="_blank" class="text-colorPrimary-light dark:text-colorPrimary-dark">
          Lens
        </a>
      </span>
      <span v-if="hiveLink">
        <a :href="hiveLink" target="_blank" class="text-colorPrimary-light dark:text-colorPrimary-dark">
          Hive
        </a>
      </span>
      <span v-if="pushLink">
        <a :href="pushLink" target="_blank" class="text-colorPrimary-light dark:text-colorPrimary-dark">
          Push
        </a>
      </span>
      <span v-if="mirrorLink">
        <a :href="mirrorLink" target="_blank" class="text-colorPrimary-light dark:text-colorPrimary-dark">
          Mirror
        </a>
      </span>
      <span v-if="mastodonLink">
        <a :href="mastodonLink" target="_blank" class="text-colorPrimary-light dark:text-colorPrimary-dark">
          Mastodon
        </a>
      </span>
      <span v-if="matrixLink">
        <a :href="matrixLink" target="_blank" class="text-colorPrimary-light dark:text-colorPrimary-dark">
          Matrix
        </a>
      </span>
      <span v-if="discordLink">
        <a :href="discordLink" target="_blank" class="text-colorPrimary-light dark:text-colorPrimary-dark">
          Discord
        </a>
      </span>
      <span v-if="telegramLink">
        <a :href="telegramLink" target="_blank" class="text-colorPrimary-light dark:text-colorPrimary-dark">
          Telegram
        </a>
      </span>
      <span v-if="twitterLink">
        <a :href="twitterLink" target="_blank" class="text-colorPrimary-light dark:text-colorPrimary-dark">
          Twitter
        </a>
      </span>
      <span v-if="redditLink">
        <a :href="redditLink" target="_blank" class="text-colorPrimary-light dark:text-colorPrimary-dark">
          Reddit
        </a>
      </span>
      <span v-if="youtubeLink">
        <a :href="youtubeLink" target="_blank" class="text-colorPrimary-light dark:text-colorPrimary-dark">
          Youtube
        </a>
      </span>
      <span v-if="instagramLink">
        <a :href="instagramLink" target="_blank" class="text-colorPrimary-light dark:text-colorPrimary-dark">
          Instagram
        </a>
      </span>
      <span v-if="facebookLink">
        <a :href="facebookLink" target="_blank" class="text-colorPrimary-light dark:text-colorPrimary-dark">
          Facebook
        </a>
      </span>
      <span v-if="linkedinLink">
        <a :href="linkedinLink" target="_blank" class="text-colorPrimary-light dark:text-colorPrimary-dark">
          LinkedIn
        </a>
      </span>
      <span v-if="wikipediaLink">
        <a :href="wikipediaLink" target="_blank" class="text-colorPrimary-light dark:text-colorPrimary-dark">
          Wikipedia
        </a>
      </span>
      <span v-if="githubLink">
        <a :href="githubLink" target="_blank" class="text-colorPrimary-light dark:text-colorPrimary-dark">
          Github
        </a>
      </span>
    </div>
    <div v-if="extraContactInfo" class="whitespace-pre-line">
      <div v-dompurify-html="(marked(extraContactInfo, {breaks:true}))" />
    </div>
  </div>
</template>

<script setup lang="ts">
// Marked converts markdown to HTML
import {marked} from 'marked'
import {useAppConfigStore} from '@/stores/useAppConfigStore'
const appConfig = useAppConfigStore()?.getAppConfig

const anotherWebsiteLink = appConfig?.anotherWebsiteLink
const ipfsLink = appConfig?.ipfsLink
const torLink = appConfig?.torLink
const ipfsHttpGatewayLink = appConfig?.ipfsHttpGatewayLink

const nostrLink = appConfig?.nostrLink
const sessionLink = appConfig?.sessionLink
const simplexLink = appConfig?.simplexLink
const statusLink = appConfig?.statusLink
const lensLink = appConfig?.lensLink
const hiveLink = appConfig?.hiveLink
const pushLink = appConfig?.pushLink
const mirrorLink = appConfig?.mirrorLink
const mastodonLink = appConfig?.mastodonLink
const matrixLink = appConfig?.matrixLink
const discordLink = appConfig?.discordLink
const telegramLink = appConfig?.telegramLink
const twitterLink = appConfig?.twitterLink
const redditLink = appConfig?.redditLink
const youtubeLink = appConfig?.youtubeLink
const instagramLink = appConfig?.instagramLink
const facebookLink = appConfig?.facebookLink
const linkedinLink = appConfig?.linkedinLink
const wikipediaLink = appConfig?.wikipediaLink
const githubLink = appConfig?.githubLink

const nostrNpub = appConfig?.nostrNpub
const sessionName = appConfig?.sessionName
const matrixName = appConfig?.matrixName
const lensName = appConfig?.lensName
const hiveName = appConfig?.hiveName
const pushName = appConfig?.pushName
const mirrorName = appConfig?.mirrorName
const telegramName = appConfig?.telegramName
const twitterName = appConfig?.twitterName
const redditName = appConfig?.redditName
const signalNumber = appConfig?.signalNumber
const whatsappNumber = appConfig?.whatsappNumber
const xmppName = appConfig?.xmppName

const uniswapLink = appConfig?.uniswapLink
const sushiswapLink = appConfig?.sushiswapLink
const etherscanLink = appConfig?.etherscanLink
const ethvmLink = appConfig?.ethvmLink
const coingeckoLink = appConfig?.coingeckoLink
const coinmarketcapLink = appConfig?.coinmarketcapLink
const dextoolsLink = appConfig?.dextoolsLink
const dexscreenerLink = appConfig?.dexscreenerLink
const birdeyeLink = appConfig?.birdeyeLink
const geckoterminalLink = appConfig?.geckoterminalLink

const extraContactInfo = appConfig?.extraContactInfo

</script>

<style scoped></style>
