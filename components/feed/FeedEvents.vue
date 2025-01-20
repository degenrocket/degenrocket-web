<template>
  <div class="">
    <!--
      <client-only> prevent hydration mismatches,
      especially with PWA module vite-pwa/nuxt.
    -->
    <client-only>
      <ExtraSpinner v-show="showSpinner" />
      <span id="feed-top-anchor"></span>
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
const {areValidSpasmEventsV2, randomNumber} = useUtils()
const eventsStore = useEventsStore()
const {feedFilters} = useFeedEventsFilters()

const showSpinner = ref(false)

const scrollToTop = () => {
  const element = document.querySelector('#feed-top-anchor');
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'end' });
    /* element.scrollIntoView({ block: 'start' }); */
  }
}

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
  /* feedFilters, async () => { */
  /* feedFilters, async () => {                */
  /*   showSpinner.value = true                */
  /*   await eventsStore.fetchPostsByFilters() */
  /*   showSpinner.value = false               */
  /* },                                        */
  () => [
    feedFilters.limit, feedFilters.category, feedFilters.activity
  ], async (
    newFilters: (string | number)[],
    oldFilters: (string | number)[]
  ) => {
    showSpinner.value = true
    await eventsStore.fetchPostsByFilters()
    showSpinner.value = false

    // Scroll feed to the top only if category or activity
    // filters have changed, i.e., don't scroll if limit has
    // changed, e.g., after pressing the 'load more' button.
    if (
      newFilters[1] !== oldFilters[1] ||
      newFilters[2] !== oldFilters[2]
    ) { scrollToTop() }
  }
)
</script>

<style scoped>

</style>
