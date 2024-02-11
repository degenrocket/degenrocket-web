<template>
  <!--
    vite-pwa can cause hydration node mismatch,
    which can be solved with <client-only> tags
  <client-only>
  -->
  <div class="p-5">
    <DefaultIntro v-if="enableDefaultIntro" />

    <CustomIntro v-if="enableCustomIntro" />

    <div v-if="ifShowContactsInIntro">
      <DefaultContacts v-if="enableDefaultContacts" />
      <CustomContacts v-if="enableCustomContacts" />
    </div>

    <div v-if="ifShowIntroTutorial" class="mt-4">
      <p>- Connect a browser extension (MetaMask, Rabby, nos2x, Flamingo) or log in as a guest.</p>
      <p>- Sign all comments and reactions with your Ethereum or Nostr private keys.</p>
      <p>- Never sign any messages that you don't understand.</p>
      <div>
        - This forum is a part of the
        <a href="https://github.com/degenrocket" target="_blank" class="text-colorPrimary-light dark:text-colorPrimary-dark">
          Spasm
          <IconsRocket class="custom-icons" />
        </a>
        network.
      </div>
    </div>

    <button class="block lg:hidden mt-4 border-2 py-2 px-3 text-colorPrimary-light dark:text-colorPrimary-dark rounded-md border-colorPrimary-light dark:border-colorPrimary-dark" @click="showFeed()">
      SHOW FEED
    </button>

    <div v-if="ifShowHomeLatestComments">
      <div v-if="isError">
        Failed to download the latest comments. Try again later.
      </div>

      <div v-if="areValidPosts(comments)">
        <div v-if="comments[0]">
          <div class="mt-4 mb-32 border-t border-borderColor-light dark:border-borderColor-dark p-2">
            Latest comments:
            
            <div class="cursor-pointer text-colorNotImportant-light dark:text-colorNotImportant-dark mb-4 hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark"
              @click="toggleShowActionDetails()">
              {{showActionDetailsText}} details
            </div>

            <InfoPostCommentsCard
              v-for="comment in comments"
              :key="comment.id"
              :comment="comment"
              :show-comments-count="true"
              :show-action-details="showActionDetails"
            />

            <!--
            <ExtraLoadMoreButton :what-to-load="'home-comments'" />
            -->
          </div>
        </div>
      </div>
    </div>
  </div>
  <!--
  </client-only>
  -->
</template>

<script setup lang="ts">
import {Post} from '@/helpers/interfaces';

// Nostr usernames
import {useProfilesStore} from '@/stores/useProfilesStore'
const profilesStore = useProfilesStore()

const {showFeed} = useFeed()
const {areValidPosts} = useUtils()
const apiURL = useRuntimeConfig()?.public?.apiURL
// Features are enabled by default if not explicitly disabled in .env
const ifShowHomeLatestComments = useRuntimeConfig()?.public?.ifShowHomeLatestComments === 'false' ? false : true
const enableDefaultIntro = useRuntimeConfig()?.public?.enableDefaultIntro === 'false' ? false : true
const enableCustomIntro = useRuntimeConfig()?.public?.enableCustomIntro === 'false' ? false : true
const ifShowContactsInIntro = useRuntimeConfig()?.public?.ifShowContactsInIntro === 'false' ? false : true
const ifShowIntroTutorial = useRuntimeConfig()?.public?.ifShowIntroTutorial === 'false' ? false : true
const enableDefaultContacts = useRuntimeConfig()?.public?.enableDefaultContacts === 'false' ? false : true
const enableCustomContacts = useRuntimeConfig()?.public?.enableCustomContacts === 'false' ? false : true

const showActionDetails = ref(false)
const showActionDetailsText = ref('show')

let comments = reactive<Post[]>([])

let isError = ref<boolean>(false)

const path: string = `${apiURL}/api/comments`

const {data, error} = await useFetch(path)
/* console.log("data:", data) */

if (error.value) {
  isError.value = true
  console.error(error.value)
}

comments = data

const toggleShowActionDetails = (): void => {
  showActionDetails.value = !showActionDetails.value
  showActionDetailsText.value = showActionDetailsText.value === 'show'
    ? 'hide'
    : 'show'
}

// Add addresses to a list of addresses that should be checked
// for profile info (e.g. usernames) during an update function.
if (process.client) {
  if (
    comments && 
    // comments is ref, so it's an object, not an array
    typeof(comments) === "object"
  ) {
    profilesStore.addAddressesFromPosts(comments)

    // TODO: how to wait until all comments are fetched
    // and only then call an update function?
    // Meanwhile, added a delay with setTimeout.
    setTimeout(() => {
      profilesStore.updateAllProfiles()
    }, 2000)
    // Another approach is to use setInterval to check if
    // comments have been downloaded every 1 sec for 10 secs,
    // add execute the updateAllProfiles() after that.
  }
}
</script>

<style scoped>

</style>

