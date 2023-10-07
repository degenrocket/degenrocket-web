<template>
  <div>
    <div v-if="isValidPost(postsStore?.getPost)" class="mb-36">
      <InfoPostPreview
        :post="postsStore.getPost"
        :key="postsStore?.getPost?.id || postsStore?.getPost?.signature || randomNumber()"
      />

      <InfoPostReactionsBar
        :post="postsStore.getPost"
      />

      <div v-if="enableNewWeb3ActionsAll && enableNewWeb3ActionsReply">
        <InfoPostCommentInputField
          v-if="postsStore?.getPost.signature || postsStore?.getPost.url || postsStore?.getPost.guid || postsStore?.getPost.ipfs"
          :target="postsStore?.getPost.signature || postsStore?.getPost.url || postsStore?.getPost.guid || postsStore?.getPost.ipfs"
          @reply-submitted="replySubmitted"
        />
      </div>

      <!--
        Since comments are fetched inside <InfoPostComments />,
        we can choose a key that will determine when comments
        should be rerendered.

        :key="postsStore.getPost?.comments_count || randomNumber()"
        comments_count can be used as a key to force the comments
        to rerender only if new comments were added.
        The component won't rerender if the key didn't change.
        After rerender is done, the screen is automatically
        scrolled up to the top, which is a poor UX.
        However, using comments_count as a key has buggy
        edge cases when comments are not properly rerendered.
        For example, if a user moves up the comments tree by
        clicking 'in reply to', which uses '/news/?p=123' format.
        If all comments in the tree only have 1 comment/reply,
        then the whole comments section won't be rerendered until
        there will be a comment with comments_count != 1.

        :key="postsStore.getPost?.id || randomNumber()"
        ID can be used as a key to force the comments to
        rerender only when a post is changed, but that will
        not update the comments section when a user wrote
        a new comment, leaving him wondering whether his
        comment has been added.

        :key="randomNumber()"
        randomNumber() can be used as a key to force the
        comments to rerender when feed posts are automatically
        refetched. However, that creates a nasty effect since
        the screen is always scrolled up after each refetch.
        A random number is used as a fallback in case if an ID
        or comments_count are undefined.

        Ideal UX:
        + Comments refetch if a post ID changes. (use ID as a key)
        + Comments refetch if a user submits a new comment.
          (manually call updatePostComments() after submit)
        - TODO: 'Show new' button when comments_count increases.
      -->
      <InfoPostComments
        :post="postsStore.getPost"
        :key="postsStore.getPost?.id"
        @reply-submitted="replySubmitted"
      />
    </div>
    <div v-else class="animate-pulse">
      <ExtraSpinner />
    </div>
  </div>
</template>

<script setup lang="ts">
import {usePostsStore} from '@/stores/usePostsStore'
/* import {Post} from '@/helpers/interfaces'; */
// New web3 actions are enabled by default if not disabled in .env
const env = useRuntimeConfig()?.public
const enableNewWeb3ActionsAll: boolean = env?.enableNewWeb3ActionsAll === 'false'? false : true
const enableNewWeb3ActionsReply: boolean = env?.enableNewWeb3ActionsReply === 'false'? false : true
const postsStore = usePostsStore()
const params = useRoute().params
const query = useRoute().query
const {randomNumber} = useWeb3()
const {isValidPost} = useUtils()

/* console.log("InfoPost is created") */

const replySubmitted = async (target?: string | number | null) => {
  /* console.log('reply was submitted for target:', target) */
  const post = postsStore.getPost

  // Refetch all the comments if a user submitted a new reply
  // so a user can see his reply.
  // Next step is to scroll screen down to his new reply.

  if (!isValidPost(post)) {
    console.error("ERROR. props.post is not a valid post")
    await nextTick()
    return
  }

  if (typeof(post?.signature) === 'string'
  || typeof(post?.url) === 'string'
  || typeof(post?.ipfs) === 'string') {
    /* console.log("updateComments if statement") */
    const id: string = post?.signature as string || post?.url as string || post?.ipfs as string

    if (target && typeof(target) === 'string') {
      await postsStore.updatePostComments(id)
    }
  }
}

const updatePost = async (idSigUrl: string): Promise<void> => {
  // 1. Make sure that the post is in the store,
  //    otherwise fetch from server and save to store.
  await postsStore.getOrFetchPostsByIds(idSigUrl)
  // 2. Set current post id, so the post can be displayed
  //    in the info section.
  postsStore.setCurrentPostId(idSigUrl)
}

// Construct a search query to find a post in the database.
// Posts can be fetched using id, signature, or url.
let searchBy: string = ""

// Examples:
// params.id: domain.com/news/123 (id)
// params.id: domain.com/news/0x123 (sig)
if (params.id && typeof (params.id) === 'string') {
  searchBy = params.id

// Examples:
// query.p:   domain.com/news/?p=123 (id)
// query.p:   domain.com/news/?p=0x123 (sig)
// query.p:   domain.com/news/?p=https://abc.com/xyz (url)
} else if (query.p && typeof (query.p) === 'string') {
  searchBy = query.p
}

await updatePost(searchBy)

// Meta
const {
  defaultMetaAppName,
  defaultMetaTitle,
  defaultMetaDescription
} = useRuntimeConfig()?.public

let title = postsStore.getPost?.title
let description = postsStore.getPost?.description || postsStore.getPost?.text

// Page Title - App Title
if (title && typeof (title) === 'string') {
  title = title.slice(0, 100) + ' - ' + defaultMetaAppName
}

if (description && typeof (description) === 'string') {
  description = description.slice(0, 255)
  if (description.length == 255) {
    description = description + '...'
  }
}

// If no values, assign default values from nuxt.config.ts
title = title || defaultMetaTitle
description = description || defaultMetaDescription

useHead({
  title: title || 'Feed',
  meta: [
    { name: 'description', content: description || ''},
    { name: 'apple-mobile-web-app-title', content: title || 'Feed' },
    { name: 'og:title', property: 'og:title', content: title || 'Feed' },
    { name: 'og:site_name', property: 'og:site_name', content: title || 'Feed' },
    { name: 'og:description', content: description || ''}
  ]
})

// Code inside <script setup> (composition API) is executed
// when an instance of the component is created. Thus, the
// watch() is needed to manually update a post and comments
// in the scenarios when nuxt-link won't update the page and
// so a new instance of the component won't be created,
// leading to the old post and comments being displayed,
// despite a browser showing a new URL.
// For example, a user clicks 'in reply to' multiple times to
// go up the comments tree. Such nuxt-links will have the
// following format: '/?p=0x123' or '/?p=456'.
// Since [id] doesn't change, clicking '/?p=456' won't
// create a new instance and won't fetch post 456.
// Thus, we use watch() to update the post when route changes.
// Comments will be refetched automatically because we provide
// a post ID as a :key to the <InfoPostComments /> component,
// meaning that the component is destroyed and created again
// when the key changes.
watch(() => useRoute().query.p, async (newQueryP) => {
  if (newQueryP && typeof (newQueryP) === 'string') {
    await updatePost(newQueryP)
  }
})
</script>

<style scoped>

</style>

