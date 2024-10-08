<template>
  <span v-if="enableNewWeb3ActionsAll && enableNewWeb3ActionsReact">
    <span class="inline-block">
      <InfoEventReactionsBarButton
        :target="comment?.ids?.[0]?.value?.toString()"
        :count="spasm.getTotalOfReaction(comment, 'upvote')"
        :reaction="reactions[0]"
        :text="false"
        :icon-upvote="true"
      />
      <InfoEventReactionsBarButton
        :target="comment?.ids?.[0]?.value?.toString()"
        :count="spasm.getTotalOfReaction(comment, 'downvote')"
        :reaction="reactions[1]"
        :text="false"
        :icon-downvote="true"
      />
    </span>
  </span>
</template>

<script setup lang="ts">
import {SpasmEventV2} from '@/helpers/interfaces';
import { spasm } from 'spasm.js'

// New web3 actions are enabled by default if not disabled in .env
const env = useRuntimeConfig()?.public
const enableNewWeb3ActionsAll: boolean = env?.enableNewWeb3ActionsAll === 'false'? false : true
const enableNewWeb3ActionsReact: boolean = env?.enableNewWeb3ActionsReact === 'false'? false : true

defineProps<{
  comment?: SpasmEventV2
}>()

const reactions = ['Upvote', 'Downvote']

</script>

<style scoped>

</style>
