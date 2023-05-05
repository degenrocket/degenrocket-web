<template>
  <!--
    vite-pwa can cause hydration node mismatch,
    which can be solved with <client-only> tags
  <client-only>
  -->
    <div>
      <div class="p-5">
        <p>Welcome onboard, this rocket was built by degens for degens.</p>
        <p>- Please tighten your seatbelts and prepare for the lift off.</p>
        <p>- You can save the app to your device by clicking 'Add to Home screen'.</p>
        <p>- You will need a web3 authenticator to interact with the content.</p>
        <p>- Never sign messages that you don't understand.</p>
        <p>- No passwords, no email addresses, no spam.</p>
        <p>- No 3rd party trackers, no CDNs.</p>
        <p>
          - To the moon!
          <IconsRocket class="custom-icons" />
        </p>
        <button class="block lg:hidden mt-4 border-2 py-2 px-3 text-colorPrimary-light dark:text-colorPrimary-dark rounded-md border-colorPrimary-light dark:border-colorPrimary-dark" @click="showFeed()">
          SHOW FEED
        </button>
      </div>

      <div v-if="isError">
        Failed to download the latest comments. Try again later.
      </div>

      <div v-if="areValidPosts(comments)">
        <div v-if="comments[0]">
          <div class="mt-4 mb-32 border-t border-borderColor-light dark:border-borderColor-dark p-2">
            Latest comments:
            
            <div class="cursor-pointer text-colorNotImportant-light dark:text-colorNotImportant-dark mb-4"
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
  <!--
  </client-only>
  -->
</template>

<script setup lang="ts">
import {Post} from '@/helpers/interfaces';
const {showFeed} = useFeed()
const {areValidPosts} = useUtils()
const apiURL = useRuntimeConfig()?.public?.apiURL

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
</script>

<style scoped>

</style>

