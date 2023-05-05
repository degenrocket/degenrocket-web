<template>
  <div v-if="post">
    <InfoPostReactionsBarButton
      :target="post?.signature || post?.url"
      :count="post.bullish"
      :reaction="reactions[0]"
      :text="false"
      :icon-bullish="true"
    />
    <InfoPostReactionsBarButton
      :target="post?.signature || post?.url"
      :count="post.bearish"
      :reaction="reactions[1]"
      :text="false"
      :icon-bearish="true"
    />
    <InfoPostReactionsBarButton
      :target="post?.signature || post?.url"
      :count="post.important"
      :reaction="reactions[2]"
      :text="false"
      :icon-important="true"
    />
    <InfoPostReactionsBarButton
      :target="post?.signature || post?.url"
      :count="post.scam"
      :reaction="reactions[3]"
      :text="false"
      :icon-scam="true"
    />
    <InfoPostReactionsBarButton
      :target="post?.signature || post?.url"
      :count="post.upvote"
      :reaction="reactions[4]"
      :text="false"
      :icon-upvote="true"
    />
    <InfoPostReactionsBarButton
      :target="post?.signature || post?.url"
      :count="post.downvote"
      :reaction="reactions[5]"
      :text="false"
      :icon-downvote="true"
    />
  </div>
</template>

<script setup lang="ts">
import {Post} from '@/helpers/interfaces'

const props = defineProps<{
  post?: Post
}>()

const reactions = ['Bullish', 'Bearish', 'Important', 'Scam', 'Upvote', 'Downvote']

</script>

<style scoped></style>

