<template>
  <div v-if="isValidSpasmEventV2(event)">
    <div v-if="isError">
      Failed to download the comments. Try again later.
    </div>
    <div v-if="event?.children && Array.isArray(event.children)">
      <div v-if="event?.children[0]" class="mb-32">
        <div class="cursor-pointer text-colorNotImportant-light dark:text-colorNotImportant-dark hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark"
          @click="toggleShowActionDetails()">
          {{showActionDetailsText}} details
        </div>
        <InfoEventCommentsCard
          v-for="child in event.children"
          :key="child?.ids?.[0]?.value || randomNumber()"
          :comment="child.event"
          :show-action-details="showActionDetails"
          :show-comments-count=false
          @reply-submitted="replySubmitted"
        />
        <!--
        <ExtraLoadMoreButton :what-to-load="'post-comments'" />
        -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {SpasmEventV2} from '@/helpers/interfaces';
const {
  isValidSpasmEventV2,
  randomNumber
} = useUtils()

defineProps<{
  event?: SpasmEventV2;
  key?: string | number | null
}>()

const emit = defineEmits<{
  (e: 'reply-submitted', targets?: (string | number)[] | null): void
}>()

const replySubmitted = (targets?: (string | number)[] | null) => {
  emit('reply-submitted', targets)
}

const showActionDetails = ref(false)
const showActionDetailsText = ref('show')

let isError = ref<boolean>(false)

// nextTick() added just in case, because there were some bugs
// before that were solved with await nextTick()
/* onMounted(async() => { */
/*   await nextTick()     */
/* })                     */

const toggleShowActionDetails = () => {
  showActionDetails.value = !showActionDetails.value
  showActionDetailsText.value = showActionDetailsText.value === 'show'
    ? 'hide'
    : 'show'
}
</script>

<style scoped>

</style>

