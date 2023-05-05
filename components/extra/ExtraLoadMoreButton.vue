<template>
  <div>
    <button v-show="showLoadMoreButton"
      class="w-32 px-2 py-1 mx-1 mt-6 mb-12 border-2 rounded-lg border-colorPrimary-light dark:border-colorPrimary-dark text-colorPrimary-light dark:text-colorPrimary-dark hover:bg-bgHover-light dark:hover:bg-bgHover-dark"
      @click="loadMore()">
      <span v-show="loading" class="animate-pulse">Loading... </span>
      <span v-show="!loading">Load more</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import {usePostsStore} from '@/stores/usePostsStore'
const postsStore = usePostsStore()
const {increaseFeedFiltersLimits} = useFeedFilters()

type WhatToLoad = "feed-posts" | "post-comments" | "home-comments"

const props = withDefaults(
  defineProps<{
    whatToLoad?: WhatToLoad
  }>(),
  {
    whatToLoad: "feed-posts"
  }
);

const loading = computed(():boolean => {
  if (!props) { return false}
  if (props.whatToLoad === "feed-posts") {
    return postsStore.fetchingPostsByFilters
  } else if (props.whatToLoad === "post-comments") {
    // TODO
    /* return postsStore.fetchingPostComments */
    console.log("fetchingPostCommentsLimits")
  } else if (props.whatToLoad === "home-comments") {
    // TODO
    /* return postsStore.fetchingHomeComments */
    console.log("fetchingHomeCommentsLimits")
  }
    return false
})

const loadMore = () => {
  setTimeout(() => {
    if (props.whatToLoad === "feed-posts") {
      increaseFeedFiltersLimits()
    } else if (props.whatToLoad === "post-comments") {
      // TODO
      /* increasePostCommentsLimits() */
      console.log("increasePostCommentsLimits")
    } else if (props.whatToLoad === "home-comments") {
      // TODO
      /* increaseHomeCommentsLimits() */
      console.log("increaseHomeCommentsLimits")
    }
  }, 200)
}

// Load More button is not shown by default
// because posts are not loaded into the feed yet,
// so it can cause unnecessary blinking effect.
let showLoadMoreButton = ref(false)
setTimeout(() => {showLoadMoreButton.value = true}, 3000)

</script>

<style scoped>

</style>
