<template>
  <div class="text-base bg-bgBase-light dark:bg-bgBase-dark text-colorBase-light dark:text-colorBase-dark"
    :key="componentKey"
    >
    <!--
      VitePwaManifest is wrapped with <client-only> tags
      to prevent hydration mismatches.
      Another safeguard is a unique componentKey.
    -->
    <client-only>
      <VitePwaManifest />
    </client-only>

    <div class="Navbar">
      <Navbar class="fixed bottom-0 w-screen" />
    </div>

    <ExtraNotification />

    <div class="grid grid-cols-5">
      <Feed class="lg:border-r border-borderColor-light dark:border-borderColor-dark h-screen overflow-scroll col-span-5 lg:col-span-2"
        :class="[isFeedShown ? 'block' : 'hidden lg:block']" />
      <Info class="w-screen h-screen overflow-scroll col-span-3 lg:w-full"
        :class="[!isFeedShown ? 'block' : 'hidden lg:block']" >
        <slot />
      </Info>
    </div>

    <ExtraWeb3Modal v-if="isWeb3ModalShown"/>
    <ExtraQrCodeModal v-if="isQrCodeModalShown"/>
  </div>
</template>

<script setup lang="ts">
import {useAppConfigStore} from '@/stores/useAppConfigStore'
const {isFeedShown} = useFeed()
const {isWeb3ModalShown, isQrCodeModalShown, setConnectedAddress} = useWeb3()

// Always use the latest app config from database
await useAppConfigStore()?.fetchAndUpdateAppConfig()

// componentKey is added as an extra safeguard against
// hydration mismatches. The idea is that an element
// should be re-generated if the key is different,
// e.g. if different versions have been generated
// on the server and client sides. 
const componentKey = ref(new Date().toISOString())

const onAccountsChanged = async (accounts?: string[]) => {
  /* console.log("onAccountsChanged called") */
  /* console.log("accounts:", accounts) */
  if (Array.isArray(accounts) && typeof(accounts?.[0]) === 'string') {
    setConnectedAddress(accounts[0])
  } else {
    setConnectedAddress('')
  }
}

/* const onDisconnect = async (code, reason) => {                                 */
/*   console.log("onDisconnect called")                                           */
/*   console.log(`Ethereum Provider connection closed: ${reason}. Code: ${code}`) */
/* }                                                                              */

const setListeners = (bool: boolean) => {
  if (window?.ethereum) {
    if (bool) {
      // TODO: use provider instead of window.ethereum
      window.ethereum.on('accountsChanged', onAccountsChanged)
      /* window.ethereum.on('disconnect', onDisconnect) */
      /* console.log('listeners set') */
    } else {
      window.ethereum.removeListener('accountsChanged', onAccountsChanged)
      /* window.ethereum.removeListener('disconnect', onDisconnect) */
      /* console.log('listeners removed') */
    }
  }
}

onMounted(async () => {
  /* console.log("onMounted") */
  setListeners(true)
})

onUnmounted(() => {
  /* console.log("onUnmounted") */
  /* if (isMetamaskInstalled.value) setListeners(false) */
  setListeners(false)
})
</script>

<style scoped>
/* disable scrollbar in Chrome, Safari, Brave */
::-webkit-scrollbar {
  display: none;
}
</style>
