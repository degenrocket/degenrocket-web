<!--
  Even though Title, Extra, and About are specified by the server
  admin in the .env file, it's still recommended to use DOMPurify
  in case if the admin has accidentally copied some malicious code
  into his .env file.
-->

<template>
  <div class="whitespace-pre-wrap">
    <div v-if="introTitle">
      <p class="text-2xl mb-4">
        <span
          v-if="introTitle"
          v-dompurify-html="introTitle"
          class="font-bold text-4xl text-colorPrimary-light dark:text-colorPrimary-dark"
        />
        <!-- &nbsp; is one space -->
        <span>&nbsp;</span>
        <span
          v-if="introTitleExtra"
          v-dompurify-html="introTitleExtra"
        />
      </p>
    </div>
    <div v-if="introAbout">
    </div>
    <div v-dompurify-html="(marked(introAbout, {breaks:true}))" />
  </div>
</template>

<script setup lang="ts">
import {marked} from 'marked'
const env = useRuntimeConfig()?.public
const introTitle = env?.introTitle
const introTitleExtra = env?.introTitleExtra
const introAbout = env?.introAbout
</script>

<style scoped></style>
