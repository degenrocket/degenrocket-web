<template>
  <div class="">
    <!--
      <client-only> prevent hydration mismatches,
      especially with PWA module vite-pwa/nuxt.
    -->
    <client-only>
      <ExtraSpinner v-show="showSpinner" />
      <div v-show="eventsStore.getPosts && eventsStore.getPosts[0]">
        <div v-show="areValidSpasmEventsV2(eventsStore.getPosts)">
          <FeedEventsCard
            v-for="post in eventsStore.getPosts"
            :key="post?.ids?.[0]?.value || randomNumber()"
            :post="post"
          />
        </div>
      </div>
      <div v-show="!eventsStore.getPosts || !eventsStore.getPosts[0]">
          <p class="animate-pulse text-colorNotImportant dark:text-colorNotImportant-dark">
            Loading...
          </p>
        <ExtraSpinner />
      </div>
      <ExtraLoadMoreButton :what-to-load="'feed-posts'" class="mb-16"/>
    </client-only>
  </div>
</template>

<script setup lang="ts">

import {useEventsStore} from '@/stores/useEventsStore'
const {randomNumber} = useWeb3()
const {areValidSpasmEventsV2} = useUtils()
const eventsStore = useEventsStore()
const {feedFilters} = useFeedEventsFilters()

const showSpinner = ref(false)

// Moved fetchPostsByFilters() from onMounted() otherwise
// there is a 'Hydration node mismatch' warning.
// Update: moved back to onMounted, and use <client-only>
// in the template to avoid hydration mismatch issues.
/* await eventsStore.fetchPostsByFilters() */

onMounted(async () => {
  /* console.log('mounted') */

  // By some reason fetching does not work from onMounted.
  // However, it works properly when used after nextTick().
  // Currently moved out of onMounted() due to
  // 'Hydration node mismatch'.
  await nextTick()
  await eventsStore.fetchPostsByFilters()

  // To avoid DDoSing server, setInterval() to fetch posts
  // should be called in onMounted() or onBeforeMount()
  // which are only called on the client side
  // and get destroyed when the page is closed.
  // Update feed posts every 120 seconds.
  setInterval(eventsStore.fetchPostsByFilters, 120000)
})

watch(
  /* () => [feedFilters.category, feedFilters.activity], async (newValue, oldValue) => { */
  /* feedFilters, async (newFilters, oldFilters) => { */
  feedFilters, async () => {
    showSpinner.value = true
    await eventsStore.fetchPostsByFilters()
    showSpinner.value = false
  }
)
</script>

<style scoped>

</style>
