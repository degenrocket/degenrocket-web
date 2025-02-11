<template>
  <div v-if="enableModeration
    && connectedAddress
    && typeof(connectedAddress) === 'string'
    && moderators.includes(connectedAddress.toLowerCase())
    && (post?.signature || post?.url)"
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
import {Post} from '@/helpers/interfaces'
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
  post?: Post
}>()

const buttonClicked = async (text: string) => {
  const target: string = props?.post?.signature || props?.post?.url || ""
  const { res } = await submitAction('moderate', text, target, '')
  /* console.log(res) */
  if (res === 'Success. Action saved and target deleted') {
    moderationResponse.value = "The event has been deleted from the local database. Refresh the page to see the change."
  } else {
    moderationResponse.value = res
  }
}
</script>

<style scoped></style>

