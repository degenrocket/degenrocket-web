<template>
  <div v-if="event" class="overflow-auto overflow-wrap break-words">
    <div v-if="event.title" class="text-2xl my-1">
      {{event.title}}
    </div>

    <!-- category -->
    <div class="text-base text-colorNotImportant-light dark:text-colorNotImportant-dark">
      <span v-if="event.categories?.[0]?.name" class="mr-1">
        Category: 
        <span v-for="category in event.categories">
          <span v-if="category.name">{{ category.name }}</span>
        </span>
      </span>
    </div>

    <!-- database timestamp -->
    <div class="text-base text-colorNotImportant-light dark:text-colorNotImportant-dark">
      <span v-if="event.db?.addedTimestamp" class="mr-1">
        Added time: {{toBeDate(event.db?.addedTimestamp)}}
      </span>
    </div>

    <!-- signed timestamp -->
    <div>
      <span v-if="event.timestamp" class="text-base text-colorNotImportant-light dark:text-colorNotImportant-dark">
        Signed time: {{toBeDate(event.timestamp)}}
      </span>
      <div v-if="enableShortUrlsForWeb3Actions && event.ids?.[0].value" class="text-base text-colorNotImportant-light dark:text-colorNotImportant-dark">
        Link:
        <span>
          <nuxt-link
            class="cursor-pointer text-colorNotImportant-light dark:text-colorNotImportant-dark hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark"
            :to="`/news/${event.ids?.[0]?.value?.toString()}`"
          >
            long
          </nuxt-link>
        </span>
        /
        <span>
          <nuxt-link
            class="cursor-pointer text-colorNotImportant-light dark:text-colorNotImportant-dark hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark"
            :to="`/news/${event.ids?.[0]?.value?.toString()?.slice(0,shortUrlsLengthOfWeb3Ids)}`"
          >
            short
          </nuxt-link>
        </span>
      </div>
    </div>

    <!-- source -->
    <div class="text-base text-colorNotImportant-light dark:text-colorNotImportant-dark">
      <span v-if="event.source?.name" class="mr-1">
        Source: {{event.source.name}}
      </span>
      <span v-if="event.links?.[0]?.value" class="text-colorPrimary-light dark:text-colorPrimary-dark hover:underline">
        <a :href="event.links?.[0]?.value" target="_blank">
          (read full)
          <IconsExternalWebsite class="custom-icons w-4 pb-1" />
        </a>
      </span>
    </div>

    <!-- TODO: handle multiple authors -->
    <!-- author addresses -->
    <div v-if="event.authors?.[0]?.addresses?.[0]">
      <InfoEventAuthorAddress
        v-for="(address, index) in event.authors[0].addresses"
        :address="address"
        :key="address?.value || randomNumber()"
      />
    </div>

    <div v-if="event.authors?.[0]?.usernames?.[0]?.value" class="text-base text-colorNotImportant-light dark:text-colorNotImportant-dark">
      Author: {{event.authors?.[0]?.usernames?.[0]?.value}}
    </div>

    <div v-if="event.parent?.ids?.[0]?.value.toString()">
      <span class="text-base text-colorNotImportant-light dark:text-colorNotImportant-dark">In reply to: </span>
      <!--
      Currently, we fetch a post in created() function in _id.vue.
      targetClicked() is needed if nuxt-link won't update the page.
      For example, if the current page url already has '/?p=123'
      then clicking '/?p=456' won't update the page and won't fetch post 456
      Thus, we emit a 'target-clicked' event up and manually fetch post 456.
      -->
      <!-- short URL enable, ID is not a valid URL -->
      <!--
      <nuxt-link
        v-if="enableShortUrlsForWeb3Actions && !isValidUrl(event.parent?.ids?.[0]?.value.toString())"
        class="text-colorPrimary-light dark:text-colorPrimary-dark hover:underline"
        :to="`/news/?p=${event.parent?.ids?.[0]?.value.toString().slice(0,shortUrlsLengthOfWeb3Ids)}`"
      >
        <span>
          {{sliceId(event.parent?.ids?.[0]?.value.toString(), 13, 8)}}
        </span>
      </nuxt-link>
      -->
      <!-- full URL, ID is not a valid URL -->
      <!--
      <nuxt-link
        v-if="!enableShortUrlsForWeb3Actions && !isValidUrl(event.parent?.ids?.[0]?.value.toString())"
        class="text-colorPrimary-light dark:text-colorPrimary-dark hover:underline"
        :to="`/news/?p=${event.parent?.ids?.[0]?.value.toString()}`"
      >
        <span>
          {{sliceId(event.parent?.ids?.[0]?.value.toString(), 8, 8)}}
        </span>
      </nuxt-link>
      -->
      <!-- ID is a valid URL -->
      <!--
      <nuxt-link
        v-if="isValidUrl(event.parent?.ids?.[0]?.value.toString())"
        class="text-colorPrimary-light dark:text-colorPrimary-dark hover:underline"
        :to="`/news/?p=${event.parent?.ids?.[0]?.value.toString()}`"
      >
        <span>
          {{event.parent?.ids?.[0]?.value.toString().slice(0,100)+'...'}}
        </span>
      </nuxt-link>
      -->
      <nuxt-link
        v-if="extractParentIdForLink(event)"
        class="text-colorPrimary-light dark:text-colorPrimary-dark hover:underline"
        :to="`/news/?p=${extractParentIdForLink(event)}`"
      >
        <span>
          {{sliceId(extractParentIdForDisplay(event), 13, 4, 30)}}
        </span>
      </nuxt-link>
    </div>

    <div
      v-if="spasm.extractSignedNostrEvent(event) && spasm.getVerifiedNostrSigners(event).includes(toBeHex(connectedAddressNostr))"
    >
      <div
        class="cursor-pointer text-base text-colorNotImportant-light dark:text-colorNotImportant-dark"
        @click="toggleBroadcastToOtherNetworks()"
      >
        <span>
          Broadcast to other networks (Nostr)
        </span>
        <svg
          :class="{ 'rotate-180': broadcastToOtherNetworksDropDownShown }"
          class="inline w-5 h-5" viewBox="0 0 20 20" fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
    <div
      class="mb-8"
      v-if="broadcastToOtherNetworksDropDownShown"
    >
      <div
        v-if="getNostrRelays() && isArrayWithValues(getNostrRelays())"
        class="text-colorNotImportant-light dark:text-colorNotImportant-dark"
      >
        <button
          class="inline my-4 px-6 lg:min-w-[200px] min-h-[40px] text-colorPrimary-light dark:text-colorPrimary-dark border-2 border-colorPrimary-light dark:border-colorPrimary-dark rounded-lg hover:bg-bgHover-light dark:hover:bg-bgHover-dark"
          @click="sendEventToNostrNetwork(event) && hideBroadcastToOtherNetworks()"
        >
          Broadcast this event to Nostr
        </button>
        <div>
          Submitting to these Nostr relays:
          <div v-for="relay in getNostrRelays()">
            <div v-if="relay && typeof(relay) === 'string'">
              {{ relay.slice(6) }}
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>

    <!--
    <div v-if="event.content" class="whitespace-pre-line my-1">
      {{event.content}}
    </div>
    -->

    <!--
    1. white-space: pre-line; is needed to properly display
       multiple lines of text with \n line breakers.
    2. white-space: pre-wrap also displays multiple spaces/tabs,
       but it adds an unnecessary tab to the first line.
    3. Eventually, decided to use marked library inside
       standardizeTextForDisplay function with {breaks:true},
       which replaces single \n with <br> to properly display
       a new line.
    4. Markdown (marked library) can be disabled in .env, e.g. due
       to security concerns, so 'white-space: pre-line' is used.
    -->
    <div v-if="event.content" class="whitespace-pre-line my-1">

      <!-- No iframe tags -->
      <div v-if="!isSignerAllowedIframe">
        <!-- Plain text -->
        <div v-if="!enableMarkdownInPosts">
          {{extractTextForDisplay(event)}}
        </div>
        <!-- Markdown if enabled -->
        <div
          v-if="enableMarkdownInPosts"
          v-dompurify-html="(extractTextForDisplay(event))"
        />
      </div>

      <!-- Iframe tags -->
      <div v-if="isSignerAllowedIframe">
        <div
          v-for="(textChunk, index) in arrayOfTextChunks"
          :key="event?.ids?.[0]?.value.toString() || event?.signatures?.[0]?.value.toString() || randomNumber()"
        >
          <!-- Markdown if enabled -->
          <div
            v-if="enableMarkdownInPosts && textChunk"
            v-dompurify-html="(standardizeTextForDisplay(textChunk, 'post'))"
          />
          <!-- Plain text if markdown is disabled -->
          <div v-if="!enableMarkdownInPosts && textChunk">
            {{standardizeTextForDisplay(textChunk, 'post')}}
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
import {SpasmEventV2} from '@/helpers/interfaces'
import { spasm } from 'spasm.js'
import {useProfilesStore} from '@/stores/useProfilesStore'
import {useAppConfigStore} from '@/stores/useAppConfigStore'
const appConfig = useAppConfigStore()?.getAppConfig
const profilesStore = useProfilesStore()
const {
  connectedAddressNostr,
  extractParentIdForDisplay,
  extractParentIdForLink
} = useWeb3()
const {
  toBeHex,
} = useNostr()
const {
  getNostrRelays,
  sendEventToNostrNetwork
} = useNostr()
const env = useRuntimeConfig()?.public
const enableMarkdownInPosts: boolean = env?.enableMarkdownInPosts === 'true'? true : false
const enableEmbedIframeTagsInPosts: boolean = env?.enableEmbedIframeTagsInPosts === 'true'? true : false
// Short URLs for web3 actions are enabled by default if not disabled in .env
const enableShortUrlsForWeb3Actions: boolean = appConfig?.enableShortUrlsForWeb3Actions
const shortUrlsLengthOfWeb3Ids: number = appConfig?.shortUrlsLengthOfWeb3Ids
const {checkIfSignerAllowedIframe, getArrayOfArraysOfTextAndTagsV2} = useHtmlTags()
const {
  sliceId,
  randomNumber,
  toBeDate,
  isArrayWithValues,
  extractTextForDisplay,
  standardizeTextForDisplay
} = useUtils()

const props = defineProps<{
  event?: SpasmEventV2
}>()

// Iframe tags
let isSignerAllowedIframe: boolean = false
let arrayOfTextChunks: string[] = ['']
let arrayOfHtmlTags: string[] = ['']

if (enableEmbedIframeTagsInPosts) {
  // Check if a signer is allowed to embed iframe tags
  const signer: string | undefined | null =
    props?.event?.authors?.[0]?.addresses?.[0]?.value?.toString()
  if (signer && typeof(signer) === "string") {
    isSignerAllowedIframe = checkIfSignerAllowedIframe(signer)
  }

  // Add iframe tags if text has any iframe URLs
  // WARNING: it's very important to check whether the
  // signer is allowed to add iframe tags because that's
  // a potential attack vector.
  if (typeof(props?.event?.content) === 'string' && isSignerAllowedIframe) {
    const arrayOfArraysOfTextAndTags: string[][] | null =
      getArrayOfArraysOfTextAndTagsV2(props?.event)
    if (
      arrayOfArraysOfTextAndTags &&
      isArrayWithValues(arrayOfArraysOfTextAndTags)
    ) {
      arrayOfTextChunks = arrayOfArraysOfTextAndTags[0]
      arrayOfHtmlTags = arrayOfArraysOfTextAndTags[1]
    }
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

const broadcastToOtherNetworksDropDownShown = ref(false)
const toggleBroadcastToOtherNetworks = () => {
  broadcastToOtherNetworksDropDownShown.value =
    !broadcastToOtherNetworksDropDownShown.value
}
const hideBroadcastToOtherNetworks = () => {
  broadcastToOtherNetworksDropDownShown.value = false
}
</script>

<style scoped>

</style>
