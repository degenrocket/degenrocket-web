<template>
  <span>
    <button @click="buttonClicked()"
      class="px-2 lg:px-3 py-1 min-w-[52px] lg:min-w-[58px] mr-1 bg-bgSecondary-light dark:bg-bgSecondary-dark hover:text-colorPrimary-light hover:dark:text-colorPrimary-dark hover:bg-bgHover-light dark:hover:bg-bgHover-dark">
      <span>
        <IconsUpvote v-if="iconUpvote" class="custom-icons"
          :class="alreadySubmitted ? 'text-colorNotImportant-light dark:text-colorNotImportant-dark' : ''" />
        <IconsDownvote v-if="iconDownvote" class="custom-icons"
          :class="alreadySubmitted ? 'text-colorNotImportant-light dark:text-colorNotImportant-dark' : ''" />
        <IconsBullish v-if="iconBullish" class="custom-icons"
          :class="alreadySubmitted ? 'text-colorGreen-light dark:text-colorGreen-dark' : ''" />
        <IconsBearish v-if="iconBearish" class="custom-icons"
          :class="alreadySubmitted ? 'text-colorRed-light dark:text-colorRed-dark' : ''" />
        <IconsImportant v-if="iconImportant" class="custom-icons"
          :class="alreadySubmitted ? 'text-colorOrange-light dark:text-colorOrange-dark' : ''" />
        <IconsScam v-if="iconScam" class="custom-icons"
          :class="alreadySubmitted ? 'text-colorRed-light dark:text-colorRed-dark' : ''" />
        <IconsComments v-if="iconComments" class="custom-icons" />
      </span>
      <span v-if="text">
        {{reaction}}
        <span v-if="count">:</span>
      </span>
      <span v-if="count" class="ml-1">{{count}}</span>
    </button>
  </span>
</template>

<script setup lang="ts">
import {useEventsStore} from '@/stores/useEventsStore'
const eventsStore = useEventsStore()
const {submitSingleSignedEventV2} = useWeb3()

const props = defineProps<{
  target?: string | null
  reaction?: string | null
  count?: number | null
  text?: boolean | null
  iconUpvote?: boolean | null
  iconDownvote?: boolean | null
  iconBullish?: boolean | null
  iconBearish?: boolean | null
  iconImportant?: boolean | null
  iconScam?: boolean | null
  iconComments?: boolean | null
}>()

const alreadySubmitted = ref<boolean>(false)

const buttonClicked = async () => {
  /* console.log("buttonClicked") */
  if (!props.reaction || !props.target) { return }
  const result =
    await submitSingleSignedEventV2('react', props.reaction, props.target, '')
  if (result) {
    const { res } = result
    if (
      res === 'Success. Action has been saved and incremented'
    ) {
      // Fetch the currently displayed post from a server
      // in order to show the updated amount of reactions.
      await eventsStore.updateCurrentPost()
      alreadySubmitted.value = true
    } else if (
      res === 'Sorry, but you\'ve already submitted the same action'
    ) {
      alreadySubmitted.value = true
      alert("You've already submitted this reaction to this post")
    } else if (
      res && typeof(res) === "string" &&
      res.toLowerCase().startsWith("error")
    ) {
      console.log("res:", res)
      alert(res)
    }
  }
}
</script>

<style scoped>

</style>

