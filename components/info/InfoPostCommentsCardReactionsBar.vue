<template>
  <span v-if="enableNewWeb3ActionsAll && enableNewWeb3ActionsReact">
    <span class="inline-block">
      <InfoPostReactionsBarButton
        :target="comment?.signature || comment?.url"
        :count="comment?.upvote"
        :reaction="reactions[0]"
        :text="false"
        :icon-upvote="true"
      />
      <InfoPostReactionsBarButton
        :target="comment?.signature || comment?.url"
        :count="comment?.downvote"
        :reaction="reactions[1]"
        :text="false"
        :icon-downvote="true"
      />
    </span>
  </span>
</template>

<script setup lang="ts">
import {Post} from '@/helpers/interfaces';

// New web3 actions are enabled by default if not disabled in .env
const env = useRuntimeConfig()?.public
const enableNewWeb3ActionsAll: boolean = env?.enableNewWeb3ActionsAll === 'false'? false : true
const enableNewWeb3ActionsReact: boolean = env?.enableNewWeb3ActionsReact === 'false'? false : true

const props = defineProps<{
  comment?: Post
}>()

const reactions = ['Upvote', 'Downvote']

</script>

<style scoped>

</style>
