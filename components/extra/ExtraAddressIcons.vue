<script lang="ts" setup>
const env = useRuntimeConfig()?.public
const defaultExplorerEthereumAddress = env?.defaultExplorerEthereumAddress
const defaultExplorerNostrAddress = env?.defaultExplorerNostrAddress
const {copyToClipboard} = useUtils()
const {
  showQrCodeModal, setQrCodeValue,
  showFollowModal, setFollowValue
} = useWeb3()

const explorerEthereumAddress = defaultExplorerEthereumAddress || 'https://etherscan.io/address/'
const explorerNostrAddress = defaultExplorerNostrAddress || 'https://primal.net/p/'

const props = defineProps<{
  value?: string | number | undefined
  showFollow?: boolean
  showCopyToClipboard?: boolean
  showQrCode?: boolean
  showExternalWebsite?: boolean
}>()

// micro compiler
/* const emit = defineEmits(['onClose']) */

// state
const copyToClipboardTitle = ref("Click to copy")
const showCopyToClipboardSuccess = ref(false)
const protocol = ref("")
const externalWebsiteTitle = ref("Open on another website")
const externalWebsiteUrl = ref("")

if (props.value && typeof(props.value) === "string") {
  if (
    props.value.startsWith('0x') &&
    props.value.length === 42
  ) {
    protocol.value = "ethereum"
  } else if (
    (
      props.value.startsWith('npub') &&
      props.value.length === 63
    ) || (
      props.value.startsWith('note') &&
      props.value.length === 63
    )
  ) {
    protocol.value = "nostr"
  }
}

if (protocol.value === "ethereum") {
  externalWebsiteTitle.value = "Open on external website"
  externalWebsiteUrl.value = explorerEthereumAddress + props.value
} else if (protocol.value === "nostr") {
  externalWebsiteTitle.value = "Open on external website"
  externalWebsiteUrl.value = explorerNostrAddress + props.value
}

// methods
const copyToClipboardClicked = (value: string | number | undefined): void => {
  copyToClipboard(value)
  copyToClipboardTitle.value = "Copied"
  showCopyToClipboardSuccess.value = true
  setTimeout(() => (
    copyToClipboardTitle.value = "Click to copy",
    showCopyToClipboardSuccess.value = false
  ), 2000)
}

const qrCodeClicked = (): void => {
  showQrCodeModal()
  setQrCodeValue(props.value)
}

const followClicked = (): void => {
  showFollowModal()
  setFollowValue(props.value)
}


/* const close = () => {                    */
/*   show.value = false                     */
/*   setTimeout(() => emit('onClose'), 100) */
/* }                                        */

// lifecycle
/* onMounted(() => {                            */
/*   setTimeout(() => (show.value = true), 100) */
/* })                                           */
</script>


<template>
  <span>
      <button @click="followClicked()" title="Show follow options" class="ml-1 text-colorNotImportant-light dark:text-colorNotImportant-dark hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark">
        <span v-if="showFollow" >
          Follow
        </span>
      </button>

      <button @click="copyToClipboardClicked(value)" :title="copyToClipboardTitle" class="ml-1 text-colorNotImportant-light dark:text-colorNotImportant-dark hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark">
        <IconsCopyToClipboard
          v-if="showCopyToClipboard && !showCopyToClipboardSuccess"
          class="custom-icons-large lg:custom-icons pb-1"
        />
        <IconsCheck
          v-if="showCopyToClipboard && showCopyToClipboardSuccess"
          class="custom-icons-large lg:custom-icons pb-1 text-colorGreen-light dark:text-colorGreen-dark"
        />
      </button>

      <button @click="qrCodeClicked()" title="Show QR code" class="ml-1 text-colorNotImportant-light dark:text-colorNotImportant-dark hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark">
        <IconsQrCode
          v-if="showQrCode"
          class="custom-icons-large lg:custom-icons pb-1"
        />
      </button>

      <a :href="externalWebsiteUrl" :title="externalWebsiteTitle" target="_blank" class="ml-1 text-colorNotImportant-light dark:text-colorNotImportant-dark hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark">
        <IconsExternalWebsite
          v-if="showExternalWebsite && protocol"
          class="custom-icons-large lg:custom-icons pb-1"
        />
      </a>
  </span>
</template>
