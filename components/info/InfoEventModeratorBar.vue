<template>
  <div v-if="enableModeration
    && connectedAddress
    && typeof(connectedAddress) === 'string'
    && moderators.includes(connectedAddress.toLowerCase())
    && String(event?.ids?.[0]?.value)"
    class="my-2"
  >
    <div>
      Moderation:
    </div>
    <button
      @click="buttonClicked('delete')"
      class="px-3 py-1 min-w-[58px] mr-1 bg-bgSecondary-light dark:bg-bgSecondary-dark hover:text-colorPrimary-light hover:dark:text-colorPrimary-dark hover:bg-bgHover-light dark:hover:bg-bgHover-dark"
    >
      DELETE event from local db and prevent it from being added again
    </button>
    <div v-if="moderationResponse">
      Moderation response: {{ moderationResponse }}
    </div>
  </div>
</template>

<script setup lang="ts">
import {SpasmEventV2} from '@/helpers/interfaces'
const {connectedAddress} = useWeb3()
const {submitAction} = useWeb3()
const moderationResponse = ref<string>("")

// Environment variables
const env = useRuntimeConfig()?.public
const enableModeration: boolean = env?.enableModeration === 'false'? false : true
const moderators: string[] =
  typeof(env?.moderators) === "string"
  ? env?.moderators.toLowerCase().split(',')
  : []

const props = defineProps<{
  event?: SpasmEventV2
}>()

const buttonClicked = async (text: string) => {
  const target: string = String(props?.event?.ids?.[0]?.value) || ""
  const result = await submitAction('moderate', text, target, '')
  if (result) {
    const { res } = result
    if (res === 'Success. Action saved and target deleted') {
      moderationResponse.value = "The event has been deleted from the local database. Refresh the page to see the change."
    } else if (!res){
      moderationResponse.value = "ERROR: Something went wrong."
    } else if (res === true){
      moderationResponse.value = "Success."
    } else if (res){
      moderationResponse.value = res
      /* alert("You've already submitted this reaction to this post") */
    }
  }
}
</script>

<style scoped></style>

