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
import { spasm } from 'spasm.js'
import {useAppConfigStore} from '@/stores/useAppConfigStore'
import {
  useNotificationStore
} from '@/stores/useNotificationStore'
const notificationStore = useNotificationStore()
const appConfig = useAppConfigStore()?.getAppConfig
const enableModeration: boolean = appConfig?.enableModeration
const moderators: string[] = appConfig?.moderators
const {connectedAddress} = useWeb3()
const {submitSingleSignedEventV2} = useWeb3()
const moderationResponse = ref<string>("")

const props = defineProps<{
  event?: SpasmEventV2
}>()

const buttonClicked = async (text: string) => {
  /* const target: string = String(props?.event?.ids?.[0]?.value) || "" */
  /* const targets = props?.event?.ids */
  const targets = spasm.getAllEventIds(props?.event)
  if (!targets || !Array.isArray(targets)) return
  const result = await submitSingleSignedEventV2('moderate', text, targets, '', null, props?.event)
  if (result) {
    const { res } = result
    if (res === 'Success. Action saved and target deleted') {
      moderationResponse.value = "The event has been deleted from the local database. Refresh the page to see the change."
    } else if (!res){
      moderationResponse.value = "ERROR: Something went wrong."
      notificationStore.showNotification(
        "ERROR: Something went wrong.",
        "error", 6000
      )
    } else if (res === true){
      moderationResponse.value = "Success."
      notificationStore.showNotification("Success", "success")
    } else if (res){
      moderationResponse.value = res
      notificationStore.showNotification(res, "", 6000)
    }
  }
}
</script>

<style scoped></style>

