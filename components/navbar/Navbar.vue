<template>
  <div class="py-1 text-base lg:text-lg bg-bgSecondary-light dark:bg-bgSecondary-dark">
    <NavbarThemeSwitch />
    <div
      class="inline-block pl-1 lg:pl-2 cursor-pointer lg:hidden"
      @click="isFeedShown? hideFeed() : showFeed()"
    >
      Feed
    </div>
    <div class="inline-block pl-1 lg:pl-2" @click="hideFeed()">
      <nuxt-link :to="`/`" class="nuxt-link">Home</nuxt-link>
    </div>
    <div v-if=" enableNewWeb3ActionsAll && enableNewWeb3ActionsPost" class="inline-block">
      <div class="inline-block pl-1 lg:pl-2" @click="hideFeed()">
        <nuxt-link :to="`/newpost`" class="nuxt-link">Publish</nuxt-link>
      </div>
    </div>
    <div class="inline-block pl-1 lg:pl-2" @click="hideFeed()">
      <nuxt-link :to="`/contacts`" class="nuxt-link">Contacts</nuxt-link>
    </div>
    <div
      class="ml-2 mr-1 inline-block text-center float-right"
      @click="showWeb3Modal">
      <span v-if="connectedAddress" class="text-sm lg:text-lg inline-block min-w-[100px] lg:min-w-[120px] border-2 rounded-lg border-bgSecondary-light dark:border-bgSecondary-dark cursor-pointer text-colorGreen-light dark:text-colorGreen-dark hover:bg-bgHover-light dark:hover:bg-bgHover-dark">
        <!-- :key rerenders the component when account changes -->
        <ExtraBlockies :seed="connectedAddress" :key="connectedAddress" :scale="2" class="inline-block" />
        {{sliceAddress(connectedAddress, 4, 3)}}
      </span>
      <span v-if="!connectedAddress" class="inline-block min-w-[100px] lg:min-w-[120px] border-2 rounded-lg border-colorRed-light dark:border-colorRed-dark cursor-pointer text-colorRed-light dark:text-colorRed-dark hover:bg-bgHover-light dark:hover:bg-bgHover-dark">
        <span v-if="pendingAuthentication" class="animate-pulse">Pending...</span>
        <span v-if="!pendingAuthentication">Connect</span>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
const {showFeed, hideFeed, isFeedShown} = useFeed()
const {showWeb3Modal, pendingAuthentication, connectedAddress, sliceAddress} = useWeb3()
// New web3 actions are enabled by default if not disabled in .env
const env = useRuntimeConfig()?.public
const enableNewWeb3ActionsAll: boolean = env?.enableNewWeb3ActionsAll === 'false'? false : true
const enableNewWeb3ActionsPost: boolean = env?.enableNewWeb3ActionsPost === 'false'? false : true
</script>

<style scoped>

</style>
