<template>
  <div class="fixed top-0  bottom-0 left-0 right-0 grid justify-center bg-black bg-opacity-60 scrollbar-hide" @click="hideWeb3Modal()">
    <div class="mt-2 lg:mt-5 max-h-[33rem] overflow-scroll bg-bgSecondary-light dark:bg-bgSecondary-dark block w-80 text-center relative scrollbar-hide" @click.stop="">
      <span class="pr-3 pt-2 pl-1 pb-1 absolute right-0 top-0 cursor-pointer text-colorNotImportant-light dark:text-colorNotImportant-dark hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark" @click="hideWeb3Modal()">X</span>
      <!--
      <div class="mt-8 mb-4 text-colorNotImportant-light dark:text-colorNotImportant-dark">
        Choose your web3 extension <br>to sign messages
      </div>
      -->

      <div v-if="ifAllowGuestLogin">
        <div class="mt-5 mx-10 text-sm text-colorNotImportant-light dark:text-colorNotImportant-dark">
          Temporary:
        </div>
        <div class="font-bold">
          <div class="block mb-3 hover:bg-bgHover-light dark:hover:bg-bgHover-dark cursor-pointer" @click="guestClicked">
            <IconsUser class="m-1 w-6 inline-block" />
            Log in as guest
          </div>
        </div>
      </div>

      <!-- Ethereum -->
      <div v-if="enableNewEthereumActionsAll">
        <div class="mx-10 text-sm font-normal border-t border-colorNotImportant-light dark:border-colorNotImportant-dark text-colorNotImportant-light dark:text-colorNotImportant-dark">
          Ethereum browser extensions:
        </div>

        <div class="block mt-2 mb-1 hover:bg-bgHover-light dark:hover:bg-bgHover-dark cursor-pointer" @click="browserExtensionClicked">
          <img
            class="inline-block w-8"
            src="@/assets/images/logos/metamask-logo.svg"
            alt="MetaMask logo"
          >
          MetaMask
        </div>

        <!-- Apparently, Coinbase Wallet is not open source, so hiding it.--> 
        <!--
        <div class="block mb-3 hover:bg-bgHover-light dark:hover:bg-bgHover-dark cursor-pointer" @click="browserExtensionClicked">
          <img
            class="inline-block w-9"
            src="@/assets/images/logos/coinbase-logo.svg"
            alt="CoinbaseWallet logo"
          >
          Coinbase Wallet
        </div>
        --> 

        <!-- Change Math wallet to 'another browser extension' --> 
        <!--
        <div class="block mb-3 hover:bg-bgHover-light dark:hover:bg-bgHover-dark cursor-pointer" @click="browserExtensionClicked">
          <img
            class="inline-block w-9"
            src="@/assets/images/logos/math-logo.png"
            alt="MathWallet logo"
          >
          Math Wallet
        </div>
        --> 

        <div class="block mb-2 hover:bg-bgHover-light dark:hover:bg-bgHover-dark cursor-pointer" @click="browserExtensionClicked">
          <img
            class="inline-block h-11"
            src="@/assets/images/logos/rabby-logo.svg"
            alt="Rabby logo"
          >
        </div>

        <div class="block mb-4 h-8 hover:bg-bgHover-light dark:hover:bg-bgHover-dark cursor-pointer" @click="browserExtensionClicked">
          Another Ethereum extension
        </div>
      </div>

      <!-- Nostr -->
      <div v-if="enableNewNostrActionsAll">
        <div class="mx-10 text-sm font-normal border-t border-colorNotImportant-light dark:border-colorNotImportant-dark text-colorNotImportant-light dark:text-colorNotImportant-dark">
          Nostr browser extensions:
        </div>

        <div class="block mt-3 mb-3 hover:bg-bgHover-light dark:hover:bg-bgHover-dark cursor-pointer" @click="nostrExtensionClicked">
          <img
            class="inline-block w-7"
            src="@/assets/images/logos/nos2x-logo.png"
            alt="Flamingo logo"
          >
          nos2x
        </div>

        <div class="block mt-2 mb-2 hover:bg-bgHover-light dark:hover:bg-bgHover-dark cursor-pointer" @click="nostrExtensionClicked">
          <img
            class="inline-block w-7"
            src="@/assets/images/logos/flamingo-logo.png"
            alt="Flamingo logo"
          >
          Flamingo
        </div>

        <div class="block mb-4 h-8 hover:bg-bgHover-light dark:hover:bg-bgHover-dark cursor-pointer" @click="nostrExtensionClicked">
          Another Nostr extension
        </div>
      </div>

      <div class="mx-10 text-sm border-t border-colorNotImportant-light dark:border-colorNotImportant-dark text-colorNotImportant-light dark:text-colorNotImportant-dark">
      </div>
      <button class="w-48 h-8 my-1 text-colorNotImportant-light dark:text-colorNotImportant-dark" @click="logOut()">
        Log out
      </button>
      <button class="w-48 h-10 my-3 border rounded-lg border-colorBase-light dark:border-colorBase-dark hover:text-colorPrimary-light dark:hover:colorPrimary-dark hover:bg-bgHover-light dark:hover:bg-bgHover-dark hover:border-colorPrimary-light dark:hover:border-colorPrimary-dark" @click="hideWeb3Modal()">
        Close
      </button>
    </div>
    <!--
    -->
  </div>
</template>

<script setup lang="ts">
const {hideWeb3Modal} = useWeb3()
const {connectWeb3Authenticator, connectNostrExtension, setRandomSigner, disconnectAccount} = useWeb3()
const ifAllowGuestLogin = useRuntimeConfig()?.public?.ifAllowGuestLogin === 'true' ? true : false
const enableNewNostrActionsAll = useRuntimeConfig()?.public?.enableNewNostrActionsAll === 'true' ? true : false
const enableNewEthereumActionsAll = useRuntimeConfig()?.public?.enableNewEthereumActionsAll === 'true' ? true : false

const browserExtensionClicked = async () => {
  /* console.log("browserExtensionClicked called") */

  const web3 = window.ethereum
  /* console.log(web3) */

  if (web3) {
    try {
      const res = await connectWeb3Authenticator()
      /* console.log("res:", res) */

      if (res) {
        hideWeb3Modal()
      }
      return
    } catch (err) {
      console.error(err)
    }
  } else {
    alert('Please install MetaMask, Rabby or other web3 browser extensions and reload the page')
  }
}

const nostrExtensionClicked = async () => {
  /* console.log("nostrExtensionClicked called") */

  const nostr = window.nostr

  if (nostr) {
    try {
      const res = await connectNostrExtension()
      /* console.log("res:", res) */

      if (res) {
        hideWeb3Modal()
      }
      return
    } catch (err) {
      console.error(err)
    }
  } else {
    alert('Please install nos2x, flamingo, or other nostr browser extensions and reload the page')
  }
}

const guestClicked = () => {
  /* console.log("guestClicked called") */
  setRandomSigner()
  hideWeb3Modal()
}

const logOut = () => {
  disconnectAccount()
  hideWeb3Modal()
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
