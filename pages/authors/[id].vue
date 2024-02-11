<template>
  <div class="p-2">
    <client-only>
      <div
        v-if="getMetadataByAddressNostr(author, 'picture') && getMetadataByAddressNostr(author, 'picture') !== 'none'"
        class="h-20 overflow-hidden"
      >
        <img
          :src="getMetadataByAddressNostr(author, 'picture') as string"
          alt="Nostr profile picture"
          class="h-20 object-cover"
        />
      </div>

      <div
        v-else
        class="h-20 overflow-hidden"
      >
        <ExtraBlockies v-if="author" :seed="author" :scale="10" />
      </div>
    </client-only>

    <div class="mt-2">
      <div class="text-colorNotImportant-light dark:text-colorNotImportant-dark">
        Address:
      </div>
      <span class="overflow-auto overflow-wrap break-words">
        {{ author }}
      </span>
      <ExtraAddressIcons
        v-if="author"
        :key="author"
        :value="author"
        :showCopyToClipboard="true"
        :showQrCode="true"
        :showExternalWebsite="true"
      />
    </div>

    <!-- client-only tags solve hydration mismatch warning -->
    <client-only>
      <div v-if="getMetadataByAddressNostr(author, 'username') && getMetadataByAddressNostr(author, 'username') !== 'none'">
        <div class="text-colorNotImportant-light dark:text-colorNotImportant-dark">
          Name:
        </div>
        <span class="text-xl font-bold">
          {{ getMetadataByAddressNostr(author, 'username') }}
        </span>
        <span class="text-colorNotImportant-light dark:text-colorNotImportant-dark">
          (non-unique Nostr name)
        </span>
      </div>

      <div v-if="getMetadataByAddressNostr(author, 'about') && getMetadataByAddressNostr(author, 'about') !== 'none'">
        <div class="text-colorNotImportant-light dark:text-colorNotImportant-dark">
          About:
        </div>
        <span class="">
          {{ getMetadataByAddressNostr(author, 'about') }}
        </span>
      </div>

      <div v-if="getMetadataByAddressNostr(author, 'website') && getMetadataByAddressNostr(author, 'website') !== 'none'">
        <div class="text-colorNotImportant-light dark:text-colorNotImportant-dark">
          Website:
        </div>
        <span class="">
          {{ getMetadataByAddressNostr(author, 'website') }}
        </span>
      </div>

      <!-- TODO: messages
      <div v-if="getMessagesByAddressNostr(author) && hasValue(getMessagesByAddressNostr(author))">
        <div class="text-colorNotImportant-light dark:text-colorNotImportant-dark">
          Messages:
        </div>
        <span class="">
          {{ getMessagesByAddressNostr(author) }}
        </span>
      </div>
      -->
    </client-only>

    <div class="mt-4 mb-12">
      All actions:
      <div class="cursor-pointer text-colorNotImportant-light dark:text-colorNotImportant-dark mb-4 hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark"
        @click="toggleShowActionDetails()">
        {{showActionDetailsText}} details
      </div>

      <div v-if="areValidPosts(posts)">
        <InfoPostCommentsCard
          v-for="post in posts"
          :key="post.id"
          :comment="post"
          :show-comments-count="false"
          :show-action-details="showActionDetails"
        />
      </div>

    </div>

  </div>
</template>

<script setup lang="ts">
import {Post} from '@/helpers/interfaces';

import { storeToRefs } from 'pinia'
import {useProfilesStore} from '@/stores/useProfilesStore'
const profilesStore = useProfilesStore()
const {
  getMetadataByAddressNostr,
  // getMessagesByAddressNostr
} = storeToRefs(profilesStore)

const { id } = useRoute().params
const author = id

const {
  areValidPosts,
  // hasValue
} = useUtils()

const apiURL = useRuntimeConfig()?.public?.apiURL

const showActionDetails = ref(false)
const showActionDetailsText = ref('show')

let posts = reactive<Post[]>([])

let isError = ref<boolean>(false)

const path: string = `${apiURL}/api/authors/${author}`

const {data, error} = await useFetch(path)

if (error.value) {
  isError.value = true
  console.error(error.value)
}

posts = data

const toggleShowActionDetails = (): void => {
  showActionDetails.value = !showActionDetails.value
  showActionDetailsText.value = showActionDetailsText.value === 'show'
    ? 'hide'
    : 'show'
}

/**
  Nuxt.js uses server-side rendering (SSR) by default,
  so JavaScript code is initially run on the server,
  not in the browser. Since WebSockets are a browser API,
  they're not available on the server.
  To resolve this issue, the process.client property is used
  to conditionally run code only on the client:
*/

// Add a signer address to a list of addresses that should be
// updated once everything else is loaded.
// The update will fetch profiles associated with these addresses.
if (process.client) {
  if (
    author && 
    typeof(author) === "string"
  ) {
    profilesStore.addAddress(author)
    profilesStore.updateAllProfiles()
  }
}

</script>

<style scoped>

</style>
