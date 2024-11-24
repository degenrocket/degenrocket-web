import {ref, readonly} from "vue";

const isFeedShown = ref(false)

export const useFeed = () => {
  const showFeed = () => {
    isFeedShown.value = true
    // console.log("showFeed in useFeed triggered")
    // console.log("isFeedShown.value:", isFeedShown.value)
  }

  const hideFeed = () => {
    setTimeout(() => {
      isFeedShown.value = false
    }, 250)
  }

  return {
    isFeedShown: readonly(isFeedShown),
    showFeed,
    hideFeed,
  }
}
