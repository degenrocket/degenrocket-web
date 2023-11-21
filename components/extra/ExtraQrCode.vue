<template>
  <div>
    <div ref="qrcode" class="mt-8 grid justify-center">
       <qrcode-vue v-if="value" :value="value" :level="level || 'L'" :size="size || 200" :render-as="renderAs || 'canvas'" />
     </div>
    <button @click="downloadQrCode" class="mt-2 cursor-pointer text-colorNotImportant-light dark:text-colorNotImportant-dark hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark">Download QR code</button>
  </div>
</template>

<script setup lang="ts">
import QrcodeVue, { Level, RenderAs } from 'qrcode.vue'

const props = defineProps<{
  value?: string | number
  // Level is used for error correction
  // starting from low to high: L/M/Q/H
  level?: Level
  size?: number
  ifShowDownloadButton?: boolean
}>()

// Default values:
/* const value = ref('qrcode') */
/* const level = ref<Level>('H') */
/* const size = ref<number>(180) */

// 'svg' has better resolution than 'canvas', but then
// the download button doesn't work
/* const renderAs = ref<RenderAs>('svg') */
const renderAs = ref<RenderAs>('canvas')

const qrcode = ref(null)
const downloadQrCode = () => {
    if (!qrcode.value) return
    let canvasImage = qrcode.value.getElementsByTagName('canvas')[0].toDataURL('image/png');
    let xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = function () {
        let a = document.createElement('a');
        a.href = window.URL.createObjectURL(xhr.response);
        a.download = 'qrcode.png';
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        a.remove();
    };
    xhr.open('GET', canvasImage);
    xhr.send();
}
</script>

<style scoped>
</style>
