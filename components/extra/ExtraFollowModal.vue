<template>
  <div class="fixed top-0  bottom-0 left-0 right-0 grid justify-center bg-black bg-opacity-60 scrollbar-hide" @click="hideFollowModal()">
    <div class="mt-6 lg:mt-5 max-h-[28rem] overflow-scroll bg-bgSecondary-light dark:bg-bgSecondary-dark block w-80 text-center relative scrollbar-hide" @click.stop="">
      <span class="pr-3 pt-2 pl-1 pb-1 absolute right-0 top-0 cursor-pointer text-colorNotImportant-light dark:text-colorNotImportant-dark hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark" @click="hideFollowModal()">X</span>
      <div class="mt-12 mb-6 mx-9 overflow-auto overflow-wrap break-words text-start">
        {{ followValue }}
        <ExtraAddressIcons
          v-if="followValue"
          :key="followValue"
          :value="followValue"
          :showCopyToClipboard="true"
        />
      </div>

      <div class="mt-2">Follow options:</div>

      <!-- Ethereum -->
      <div v-if="protocol === 'ethereum'">
        <a :href="'https://app.push.org/channels/'+followValue" target="_blank">
          <button class="w-48 h-10 my-3 border rounded-lg text-colorBase-light dark:text-colorBase-dark border-colorBase-light dark:border-colorBase-dark hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark hover:bg-bgHover-light dark:hover:bg-bgHover-dark hover:border-colorPrimary-light dark:hover:border-colorPrimary-dark">
            Push
          </button>
        </a>
      </div>
      <div v-if="protocol === 'ethereum'">
        <a :href="'https://etherscan.io/address/'+followValue" target="_blank">
          <button class="w-48 h-10 my-3 border rounded-lg text-colorBase-light dark:text-colorBase-dark border-colorBase-light dark:border-colorBase-dark hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark hover:bg-bgHover-light dark:hover:bg-bgHover-dark hover:border-colorPrimary-light dark:hover:border-colorPrimary-dark">
            Etherscan
          </button>
        </a>
      </div>
      <div v-if="protocol === 'ethereum'">
        <a :href="'https://opensea.io/'+followValue" target="_blank">
          <button class="w-48 h-10 my-3 border rounded-lg text-colorBase-light dark:text-colorBase-dark border-colorBase-light dark:border-colorBase-dark hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark hover:bg-bgHover-light dark:hover:bg-bgHover-dark hover:border-colorPrimary-light dark:hover:border-colorPrimary-dark">
            Opensea
          </button>
        </a>
      </div>

      <!-- Nostr -->
      <div v-if="protocol === 'nostr'">
        <a :href="'https://njump.me/'+followValue" target="_blank">
          <button class="w-48 h-10 my-3 border rounded-lg text-colorBase-light dark:text-colorBase-dark border-colorBase-light dark:border-colorBase-dark hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark hover:bg-bgHover-light dark:hover:bg-bgHover-dark hover:border-colorPrimary-light dark:hover:border-colorPrimary-dark">
            Njump
          </button>
        </a>
      </div>
      <div v-if="protocol === 'nostr'">
        <a :href="'https://primal.net/p/'+followValue" target="_blank">
          <button class="w-48 h-10 my-3 border rounded-lg text-colorBase-light dark:text-colorBase-dark border-colorBase-light dark:border-colorBase-dark hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark hover:bg-bgHover-light dark:hover:bg-bgHover-dark hover:border-colorPrimary-light dark:hover:border-colorPrimary-dark">
            Primal
          </button>
        </a>
      </div>
      <div v-if="protocol === 'nostr'">
        <a :href="'nostr:'+followValue" target="_blank">
          <button class="w-48 h-10 my-3 border rounded-lg text-colorBase-light dark:text-colorBase-dark border-colorBase-light dark:border-colorBase-dark hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark hover:bg-bgHover-light dark:hover:bg-bgHover-dark hover:border-colorPrimary-light dark:hover:border-colorPrimary-dark">
            Default Nostr app
          </button>
        </a>
      </div>

      <button class="w-48 h-10 my-3 border rounded-lg border-colorBase-light dark:border-colorBase-dark hover:text-colorPrimary-light dark:hover:colorPrimary-dark hover:bg-bgHover-light dark:hover:bg-bgHover-dark hover:border-colorPrimary-light dark:hover:border-colorPrimary-dark" @click="hideFollowModal()">
        Close
      </button>

    </div>
    <!--
    -->
  </div>
</template>

<script setup lang="ts">
const {
  followValue,
  hideFollowModal
} = useWeb3()

const protocol = ref("")
if (followValue.value && typeof(followValue.value) === "string") {
  const val = followValue.value
  if (
    val.startsWith('0x') && val.length === 42
  ) {
    protocol.value = "ethereum"
  } else if (
    (
      val.startsWith('npub') && val.length === 63
    ) || (
      val.startsWith('note') && val.length === 63
    )
  ) { protocol.value = "nostr" }
}
</script>

<style scoped>
/* For Webkit-based browsers (Chrome, Safari and Opera) */
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}

/* For IE, Edge and Firefox */
.scrollbar-hide {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
}
</style>
