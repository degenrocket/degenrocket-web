<template>
  <div v-if="post" class="overflow-auto overflow-wrap break-words">
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
        <a :href="post.url" target="_blank">
          (read full)
          <IconsExternalWebsite class="custom-icons w-4 pb-1" />
        </a>
      </span>
    </div>

    <!-- web3 -->
    <span v-if="post.signed_time" class="text-base text-colorNotImportant-light dark:text-colorNotImportant-dark">
      {{new Date(Date.parse(post.signed_time)).toDateString()}}
    </span>

    <span v-if="enableShortUrlsForWeb3Actions && post.signature" class="text-base text-colorNotImportant-light dark:text-colorNotImportant-dark">
      -
      <span>
        <nuxt-link
          class="cursor-pointer text-colorNotImportant-light dark:text-colorNotImportant-dark hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark"
          :to="`/news/${post.signature}`"
        >
          long
        </nuxt-link>
      </span>
      /
      <span>
        <nuxt-link
          class="cursor-pointer text-colorNotImportant-light dark:text-colorNotImportant-dark hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark"
          :to="`/news/${post.signature.slice(0,shortUrlsLengthOfWeb3Ids)}`"
        >
          short
        </nuxt-link>
      </span>
      link
    </span>

    <div v-if="post.author" class="text-base text-colorNotImportant-light dark:text-colorNotImportant-dark">
      Author: {{post.author}}
    </div>
    <div v-if="post.signer" class="text-base text-colorNotImportant-light dark:text-colorNotImportant-dark">
      <span>Author: </span>
      <ExtraBlockies :seed="post.signer" :scale="2" class="inline-block mr-1" />
      <nuxt-link :to="`/authors/${post.signer}`"
        class="text-colorPrimary-light dark:text-colorPrimary-dark hover:underline">

        <!-- client-only tags solve hydration mismatch warning -->
        <client-only>
            <span
              v-if="getMetadataByAddressNostr(post.signer, 'username') && getMetadataByAddressNostr(post.signer, 'username') !== 'none'"
              class="ml-1"
            >
              <span class="">
                {{ getMetadataByAddressNostr(post.signer, 'username').slice(0,40) }}
              </span>
              <span class="text-sm">
                (Nostr)
              </span>
            </span>

          <span v-else class="">
            {{post.signer.slice(0, 6)}}...{{post.signer.slice(-4)}}
          </span>
        </client-only>
      </nuxt-link>

      <ExtraAddressIcons
        v-if="post.signer"
        :key="post.signer"
        :value="post.signer"
        :showCopyToClipboard="true"
        :showQrCode="true"
        :showExternalWebsite="true"
      />
    </div>

    <div v-if="post.target">
      <span class="text-base text-colorNotImportant-light dark:text-colorNotImportant-dark">In reply to: </span>
      <!--
      Currently, we fetch a post in created() function in _id.vue.
      targetClicked() is needed if nuxt-link won't update the page.
      For example, if the current page url already has '/?p=123'
      then clicking '/?p=456' won't update the page and won't fetch post 456
      Thus, we emit a 'target-clicked' event up and manually fetch post 456.
      -->
      <!-- short URL enable, ID is not a valid URL -->
      <nuxt-link
        v-if="enableShortUrlsForWeb3Actions && !isValidUrl(post.target)"
        class="text-colorPrimary-light dark:text-colorPrimary-dark hover:underline"
        :to="`/news/?p=${post.target.slice(0,shortUrlsLengthOfWeb3Ids)}`"
      >
        <span>
          {{sliceAddress(post.target, 8, 8)}}
        </span>
      </nuxt-link>
      <!-- full URL, ID is not a valid URL -->
      <nuxt-link
        v-if="!enableShortUrlsForWeb3Actions && !isValidUrl(post.target)"
        class="text-colorPrimary-light dark:text-colorPrimary-dark hover:underline"
        :to="`/news/?p=${post.target}`"
      >
        <span>
          {{sliceAddress(post.target, 8, 8)}}
        </span>
      </nuxt-link>
      <!-- ID is a valid URL -->
      <nuxt-link
        v-if="isValidUrl(post.target)"
        class="text-colorPrimary-light dark:text-colorPrimary-dark hover:underline"
        :to="`/news/?p=${post.target}`"
      >
        <span>
          {{post.target.slice(0,100)+'...'}}
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

      <!-- No iframe tags -->
      <div v-if="!isSignerAllowedIframe">
        <!-- Plain text -->
        <div v-if="!enableMarkdownInPosts">
          {{post.text}}
        </div>
        <!-- Markdown if enabled -->
        <div
          v-if="enableMarkdownInPosts"
          v-dompurify-html="(marked(post.text, {breaks:true}))"
        />
      </div>

      <!-- Iframe tags -->
      <div v-if="isSignerAllowedIframe">
        <div
          v-for="(textChunk, index) in arrayOfTextChunks"
          :key="post?.id || post?.signature || randomNumber()"
        >
          <!-- Markdown if enabled -->
          <div
            v-if="enableMarkdownInPosts && textChunk"
            v-dompurify-html="(marked(textChunk, {breaks:true}))"
          />
          <!-- Plain text if markdown is disabled -->
          <div v-if="!enableMarkdownInPosts && textChunk">
            {{textChunk}}
          </div>
          <!-- HTML tags (e.g. iframe) -->
          <!--
            DOMPurify is not used so tags can be embedded.
            HTML tags in arrayOfHtmlTags are generated by the
            script and only for whitelisted users.
          -->
          <div
            v-if="arrayOfHtmlTags && arrayOfHtmlTags[index]"
            v-html="arrayOfHtmlTags[index]"
          />
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import {marked} from 'marked'
import {Post} from '@/helpers/interfaces'
import { storeToRefs } from 'pinia'
import {useProfilesStore} from '@/stores/useProfilesStore'
const profilesStore = useProfilesStore()
const {getMetadataByAddressNostr} = storeToRefs(profilesStore)
const {sliceAddress, randomNumber} = useWeb3()
const env = useRuntimeConfig()?.public
const enableMarkdownInPosts: boolean = env?.enableMarkdownInPosts === 'true'? true : false
const enableEmbedIframeTagsInPosts: boolean = env?.enableEmbedIframeTagsInPosts === 'true'? true : false
// Short URLs for web3 actions are enabled by default if not disabled in .env
const enableShortUrlsForWeb3Actions: boolean = env?.enableShortUrlsForWeb3Actions === 'false'? false : true
const shortUrlsLengthOfWeb3Ids: number = env?.shortUrlsLengthOfWeb3Ids ? Number(env?.shortUrlsLengthOfWeb3Ids) : 20
const {checkIfSignerAllowedIframe, getArrayOfArraysOfTextAndTags} = useHtmlTags()
const {isValidUrl} = useUtils()

const props = defineProps<{
  post?: Post
}>()

// Iframe tags
let isSignerAllowedIframe: boolean = false
let arrayOfTextChunks: string[] = ['']
let arrayOfHtmlTags: string[] = ['']

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
    const arrayOfArraysOfTextAndTags: string[][] = getArrayOfArraysOfTextAndTags(props?.post)
    arrayOfTextChunks = arrayOfArraysOfTextAndTags[0]
    arrayOfHtmlTags = arrayOfArraysOfTextAndTags[1]
  }
}

// TODO: how to wait until all feed posts are fetched
// and only then call an update function?
// Meanwhile, added a delay with setTimeout.
if (process.client) {
  setTimeout(() => {
    profilesStore.updateAllProfiles()
  }, 2000)
  // Another approach is to use setInterval to check if
  // comments have been downloaded every 1 sec for 10 secs,
  // add execute the updateAllProfiles() after that.
}
</script>

<style scoped>

</style>
