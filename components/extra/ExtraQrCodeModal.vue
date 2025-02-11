<template>
  <div class="fixed top-0  bottom-0 left-0 right-0 grid justify-center bg-black bg-opacity-60 scrollbar-hide" @click="hideQrCodeModal()">
    <div class="mt-6 lg:mt-5 max-h-[28rem] overflow-scroll bg-bgSecondary-light dark:bg-bgSecondary-dark block w-80 text-center relative scrollbar-hide" @click.stop="">
      <span class="pr-3 pt-2 pl-1 pb-1 absolute right-0 top-0 cursor-pointer text-colorNotImportant-light dark:text-colorNotImportant-dark hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark" @click="hideQrCodeModal()">X</span>
      <div>
        <ExtraQrCode
          v-if="qrCodeValue"
          :key="qrCodeValue"
          :value="qrCodeValue"
        />
      </div>
      <div class="mt-2 mb-6 mx-9 overflow-auto overflow-wrap break-words text-start">
        {{ qrCodeValue }}
        <ExtraAddressIcons
          v-if="qrCodeValue"
          :key="qrCodeValue"
          :value="qrCodeValue"
          :showCopyToClipboard="true"
          :showExternalWebsite="true"
        />
      </div>

      <button class="w-48 h-10 my-3 border rounded-lg border-colorBase-light dark:border-colorBase-dark hover:text-colorPrimary-light dark:hover:colorPrimary-dark hover:bg-bgHover-light dark:hover:bg-bgHover-dark hover:border-colorPrimary-light dark:hover:border-colorPrimary-dark" @click="hideQrCodeModal()">
        Close
      </button>

    </div>
    <!--
    -->
  </div>
</template>

<script setup lang="ts">
const {
  qrCodeValue,
  hideQrCodeModal
} = useWeb3()
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
