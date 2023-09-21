<template>
  <div v-if="post">
    <div v-if="post.title" class="text-2xl my-1">
      {{post.title}}
    </div>

    <!-- web2 -->
    <div class="text-base text-colorNotImportant-light dark:text-colorNotImportant-dark">
      <span v-if="post.pubdate" class="mr-1">
        {{new Date(Date.parse(post.pubdate)).toDateString()}}
      </span>
      <span v-if="post.source" class="mr-1">
        {{post.source}}
      </span>
      <span v-if="post.url" class="text-colorPrimary-light dark:text-colorPrimary-dark hover:underline">
        <a :href="post.url" target="_blank">(read full)</a>
      </span>
    </div>

    <!-- web3 -->
    <div v-if="post.author" class="text-base text-colorNotImportant-light dark:text-colorNotImportant-dark">
      Author: {{post.author}}
    </div>
    <div v-if="post.signer" class="text-base text-colorNotImportant-light dark:text-colorNotImportant-dark">
      <span>Author: </span>
      <ExtraBlockies :seed="post.signer" :scale="2" class="inline-block mr-1" />
      <nuxt-link :to="`/authors/${post.signer}`" class="text-colorPrimary-light dark:text-colorPrimary-dark hover:underline">
        <span class="signer">
          {{post.signer.slice(0, 6)}}...{{post.signer.slice(-4)}}
        </span>
      </nuxt-link>
      <span v-if="post.signed_time">
        ({{new Date(Date.parse(post.signed_time)).toDateString()}})
      </span>
    </div>
    <div v-if="post.target">
      <span class="text-base text-colorNotImportant-light dark:text-colorNotImportant-dark">In reply to: </span>
      <nuxt-link class="text-colorPrimary-light dark:text-colorPrimary-dark hover:underline" :to="`/news/?p=${post.target}`">
        <!--
        Currently, we fetch a post in created() function in _id.vue.
        targetClicked() is needed if nuxt-link won't update the page.
        For example, if the current page url already has '/?p=123'
        then clicking '/?p=456' won't update the page and won't fetch post 456
        Thus, we emit a 'target-clicked' event up and manually fetch post 456.
        -->
        <span>
          {{sliceAddress(post.target, 22, 16)}}
        </span>
      </nuxt-link>
    </div>
    <div v-if="post.description" class="whitespace-pre-line my-1">
      {{post.description}}
    </div>
    <!--
    1. white-space: pre-line; is needed to properly display
    multiple lines of text with \n line breakers.
    2. white-space: pre-wrap also displays multiple spaces/tabs,
    but it adds an unnecessary tab to the first line (how to fix?).
    3. Eventually, decided to use marked library with {breaks:true},
    which replaces single \n with <br> to properly display a new line
    4. Markdown (marked library) can be disabled in .env, e.g. due to
    security concerns, so 'white-space: pre-line' is used.
    -->
    <div v-if="post.text" class="whitespace-pre-line my-1">
      <!-- Plain text -->
      <div v-if="!enableMarkdownInPosts && !isSignerAllowedIframe">
        {{post.text}}
      </div>
      <!-- Markdown -->
      <!-- Markdown can be enabled/disabled in the .env file. -->
      <!-- breaks:true changes single \n with <br> -->
      <div
        v-if="enableMarkdownInPosts && !isSignerAllowedIframe"
        v-dompurify-html="(marked(post.text, {breaks:true}))"
      />
      <!--
        Disable dompurify if a signer is whitelisted so links with
        videos can be properly embedded e.g. with <iframe> tags
      -->
      <!-- Markdown and iframe tags -->
      <div
        v-if="enableMarkdownInPosts && isSignerAllowedIframe"
        v-html="(marked(textWithIframeTags, {breaks:true}))"
      />
      <!-- Iframe tags without markdown -->
      <div
        v-if="!enableMarkdownInPosts && isSignerAllowedIframe"
        v-html="textWithIframeTags"
      />
    </div>

  </div>
</template>

<script setup lang="ts">
import {marked} from 'marked'
import {Post} from '@/helpers/interfaces'
const {sliceAddress} = useWeb3()
const env = useRuntimeConfig()?.public
const enableMarkdownInPosts = env?.enableMarkdownInPosts === 'true'? true : false
const enableEmbedIframeTagsInPosts = env?.enableEmbedIframeTagsInPosts === 'true'? true : false
const {addIframeTags, checkIfSignerAllowedIframe} = useHtmlTags()

const props = defineProps<{
  post?: Post
}>()

// Iframe tags
let isSignerAllowedIframe: boolean = false
let textWithIframeTags: string = ''

if (enableEmbedIframeTagsInPosts) {
  // Check if a signer is allowed to embed iframe tags
  if (typeof(props?.post?.signer) === 'string') {
    isSignerAllowedIframe = checkIfSignerAllowedIframe(props?.post?.signer)
  }

  // Add iframe tags if text has any iframe URLs
  // WARNING: it's very important to check whether the
  // signer is allowed to add iframe tags because that's
  // a potential attack vector.
  if (typeof(props?.post?.text) === 'string' && isSignerAllowedIframe) {
    textWithIframeTags = addIframeTags(props?.post)
  }
}

</script>

<style scoped>

</style>
