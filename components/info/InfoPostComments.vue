<template>
  <div v-if="isValidPost(post)">
    <div v-if="isError">
      Failed to download the comments. Try again later.
    </div>
    <div v-if="areValidPosts(postsStore.getPostComments)">
      <div v-if="postsStore.getPostComments[0]" class="mb-32">
        <div class="cursor-pointer text-colorNotImportant-light dark:text-colorNotImportant-dark"
          @click="toggleShowActionDetails()">
          {{showActionDetailsText}} details
        </div>
        <InfoPostCommentsCard
          v-for="comment in postsStore.getPostComments"
          :key="comment.id"
          :comment="comment"
          :show-action-details="showActionDetails"
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
import {Post} from '@/helpers/interfaces';
import {usePostsStore} from '@/stores/usePostsStore'
const postsStore = usePostsStore()
const {isValidPost, areValidPosts} = useUtils()

const props = defineProps<{
  post?: Post;
  key?: string | number | null
}>()

const emit = defineEmits<{
  (e: 'reply-submitted', target?: string | number | null): void
}>()

const replySubmitted = (target?: string | number | null) => {
  /* console.log('reply was submitted for target:', target) */
  emit('reply-submitted', target)
}

const showActionDetails = ref(false)
const showActionDetailsText = ref('show')

let comments = reactive<Post[]>([])

let isError = ref<boolean>(false)

// Posts can be fetched from a server by id, signature, url, ipfs.
// However, comments can only be fetched by signature, url, ipfs.
// The same posts can have different ids on different servers.
// Examples
// .../api/targets/comments/search?target=0x12345 (sig)
// .../api/targets/comments/search?target=https://abc.com/xyz (url)

const updateComments = async (): Promise<void> => {
  /* console.log("updateComments called") */
  if (!isValidPost(props.post)) {
    console.error("ERROR. props.post is not a valid post")
    await nextTick()
    return
  }

  if (typeof(props.post?.signature) === 'string'
  || typeof(props.post?.url) === 'string'
  || typeof(props.post?.ipfs) === 'string') {
    const id: string = props.post?.signature as string || props.post?.url as string || props.post?.ipfs as string

    await postsStore.updatePostComments(id)

    /* console.log("comments in updateComments:", comments) */
  } else {
    // await nextTick() is added to abort the async function
    // if no other functions were called with 'await' syntax.
    // Otherwise the function freezes further execution of code.
    await nextTick()
  }

  /* console.log("updateComments end") */
}

onMounted(async() => {
  // nextTick() added just in case, because there were some bugs
  // before that were solved with await nextTick()
  await nextTick()

  // updateComments should be inside onMounted,
  // otherwise there is an error 'nuxt instance unavailable'
  await updateComments()
})

const toggleShowActionDetails = () => {
  showActionDetails.value = !showActionDetails.value
  showActionDetailsText.value = showActionDetailsText.value === 'show'
    ? 'hide'
    : 'show'
}
</script>

<style scoped>

</style>

