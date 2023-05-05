<template>
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
</template>

<script setup lang="ts">
import {Post} from '@/helpers/interfaces';
const props = defineProps<{
  comment?: Post
}>()

const reactions = ['Upvote', 'Downvote']

</script>

<style scoped>

</style>
