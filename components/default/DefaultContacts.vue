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

    <div>
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

const env = useRuntimeConfig()?.public
const anotherWebsiteLink = env?.anotherWebsiteLink
const ipfsLink = env?.ipfsLink
const torLink = env?.torLink
const ipfsHttpGatewayLink = env?.ipfsHttpGatewayLink

const nostrLink = env?.nostrLink
const sessionLink = env?.sessionLink
const simplexLink = env?.simplexLink
const statusLink = env?.statusLink
const lensLink = env?.lensLink
const hiveLink = env?.hiveLink
const pushLink = env?.pushLink
const mirrorLink = env?.mirrorLink
const mastodonLink = env?.mastodonLink
const matrixLink = env?.matrixLink
const discordLink = env?.discordLink
const telegramLink = env?.telegramLink
const twitterLink = env?.twitterLink
const redditLink = env?.redditLink
const youtubeLink = env?.youtubeLink
const instagramLink = env?.instagramLink
const facebookLink = env?.facebookLink
const linkedinLink = env?.linkedinLink
const wikipediaLink = env?.wikipediaLink
const githubLink = env?.githubLink

const nostrNpub = env?.nostrNpub
const sessionName = env?.sessionName
const matrixName = env?.matrixName
const lensName = env?.lensName
const hiveName = env?.hiveName
const pushName = env?.pushName
const mirrorName = env?.mirrorName
const telegramName = env?.telegramName
const twitterName = env?.twitterName
const redditName = env?.redditName
const signalNumber = env?.signalNumber
const whatsappNumber = env?.whatsappNumber
const xmppName = env?.xmppName

const uniswapLink = env?.uniswapLink
const sushiswapLink = env?.sushiswapLink
const etherscanLink = env?.etherscanLink
const ethvmLink = env?.ethvmLink
const coingeckoLink = env?.coingeckoLink
const coinmarketcapLink = env?.coinmarketcapLink
const dextoolsLink = env?.dextoolsLink

const extraContactInfo = env?.extraContactInfo

</script>

<style scoped></style>
