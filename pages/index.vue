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

    <div v-if="ifShowHomeLatestComments" class="mt-2">
      <client-only fallback-tag="span">
        <div v-if="isError">
          <p class="text-colorNotImportant dark:text-colorNotImportant-dark">
            Failed to download the latest comments. Try again later.
          </p>
        </div>

        <div v-if="areValidSpasmEventsV2(comments)">
          <div v-if="comments[0]">
            <div class="mt-4 mb-32 border-t border-borderColor-light dark:border-borderColor-dark p-2">
              Latest comments:
              
              <div class="cursor-pointer text-colorNotImportant-light dark:text-colorNotImportant-dark mb-4 hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark"
                @click="toggleShowActionDetails()">
                {{showActionDetailsText}} details
              </div>

              <InfoEventCommentsCard
                v-for="comment in comments"
                :key="comment.ids?.[0]?.value"
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
        <template #fallback>
          <!-- this will be rendered on server side -->
          <p class="animate-pulse text-colorNotImportant dark:text-colorNotImportant-dark">
            Loading...
          </p>
        </template>
      </client-only>
    </div>
  </div>
  <!--
  </client-only>
  -->
</template>

<script setup lang="ts">
import {SpasmEventV2} from '@/helpers/interfaces';
import { spasm } from 'spasm.js'

// Nostr usernames
import {useProfilesStore} from '@/stores/useProfilesStore'
const profilesStore = useProfilesStore()

const {showFeed} = useFeed()
const {areValidSpasmEventsV2} = useUtils()
const {getMockSpasmEventComments} = useMocks()
const apiURL = useRuntimeConfig()?.public?.apiURL
const useMockedDataIfBackendIsDown = useRuntimeConfig()?.public
  ?.useMockedDataIfBackendIsDown === "true" ? true : false

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

let comments = reactive<SpasmEventV2[]>([])

let isError = ref<boolean>(false)

const path: string = `${apiURL}/api/events?webType=false&action=reply&category=any&source=false&activity=all&keyword=false&limit=25`

const {data, error} = await useFetch(path)
/* console.log("data:", data) */

if (error.value) {
  // Don't show an error if testing locally without backend API
  if (!useMockedDataIfBackendIsDown) {
    isError.value = true
  }
  console.error(error.value)
}

if (data?.value) {
  const spasmEvents: SpasmEventV2[] | null =
    spasm.convertManyToSpasm(data.value)
  if (spasmEvents && areValidSpasmEventsV2(spasmEvents)) {
    comments = spasmEvents
  }
// Use mock posts for testing locally without backend
// if activated in the .env file.
} else if (
  useMockedDataIfBackendIsDown
) {
  comments = getMockSpasmEventComments()
}

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
    profilesStore.addAddressesFromSpasmEvents(comments)

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

