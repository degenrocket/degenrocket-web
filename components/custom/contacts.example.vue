<template>
  <!-- You can customize this section -->
  <div>
    <div v-if="anotherWebsiteLink">
      Website:
        <a :href="anotherWebsiteLink" target="_blank" class="text-colorPrimary-light dark:text-colorPrimary-dark">
          {{anotherWebsiteLink}}
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

    <div v-if="etherscanLink">
      Contract:
      <span v-if="etherscanLink">
        <a :href="etherscanLink" target="_blank" class="text-colorPrimary-light dark:text-colorPrimary-dark">
          Etherscan
        </a>
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

    <div>
      Follow:
      <span v-if="nostrLink">
        <a :href="nostrLink" target="_blank" class="text-colorPrimary-light dark:text-colorPrimary-dark">
          Nostr
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
      <span v-if="mirrorLink">
        <a :href="mirrorLink" target="_blank" class="text-colorPrimary-light dark:text-colorPrimary-dark">
          Mirror
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
      <span v-if="githubLink">
        <a :href="githubLink" target="_blank" class="text-colorPrimary-light dark:text-colorPrimary-dark">
          Github
        </a>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
const anotherWebsiteLink = useRuntimeConfig()?.public?.anotherWebsiteLink
const ipfsLink = useRuntimeConfig()?.public?.ipfsLink
const ipfsHttpGatewayLink = useRuntimeConfig()?.public?.ipfsHttpGatewayLink

const nostrLink = useRuntimeConfig()?.public?.nostrLink
const lensLink = useRuntimeConfig()?.public?.lensLink
const hiveLink = useRuntimeConfig()?.public?.hiveLink
const mirrorLink = useRuntimeConfig()?.public?.mirrorLink
const matrixLink = useRuntimeConfig()?.public?.matrixLink
const discordLink = useRuntimeConfig()?.public?.discordLink
const telegramLink = useRuntimeConfig()?.public?.telegramLink
const twitterLink = useRuntimeConfig()?.public?.twitterLink
const redditLink = useRuntimeConfig()?.public?.redditLink
const youtubeLink = useRuntimeConfig()?.public?.youtubeLink
const githubLink = useRuntimeConfig()?.public?.githubLink

const uniswapLink = useRuntimeConfig()?.public?.uniswapLink
const sushiswapLink = useRuntimeConfig()?.public?.sushiswapLink
const etherscanLink = useRuntimeConfig()?.public?.etherscanLink

const sessionName = useRuntimeConfig()?.public?.sessionName
const telegramName = useRuntimeConfig()?.public?.telegramName

</script>

<style scoped></style>
