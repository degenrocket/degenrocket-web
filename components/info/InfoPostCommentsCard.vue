<template>
  <div v-if="comment" class="ml-4 mt-2 mb-4 border-l-2 border-bgSecondary-light dark:border-bgSecondary-dark">
    <div>
      <div class="text-colorNotImportant-light dark:text-colorNotImportant-dark">
        <span v-if="comment.signer">
          <span v-if="showActionDetails">Author: </span>
          <ExtraBlockies :seed="comment.signer" :scale="2" class="inline-block mr-1" />
          <nuxt-link :to="`/authors/${comment.signer}`"
            class="text-colorPrimary-light dark:text-colorPrimary-dark hover:underline">
            {{sliceAddress(comment.signer, 4)}}
          </nuxt-link>
        </span>
        <span v-if="showActionDetails">
          <span class="ml-1">
            <span class="signatureLabel">Signature: </span>
            <nuxt-link class="text-colorPrimary-light dark:text-colorPrimary-dark hover:underline"
              :to="`/news/${comment.signature}`">
            {{sliceAddress(comment.signature)}}
            </nuxt-link>
          </span>
          <span v-if="comment.target">
            <span class="ml-1">Target: </span>
            <nuxt-link class="text-colorPrimary-light dark:text-colorPrimary-dark hover:underline"
              :to="`/news/?p=${comment.target}`">
              <span>
                {{sliceAddress(comment.target)}}
              </span>
            </nuxt-link>
          </span>
        </span>
        <nuxt-link :to="`/news/${comment.signature}`" class="nuxt-link text-colorNotImportant-light dark:text-colorNotImportant-dark">
          <span v-if="comment.signed_time">
            ({{new Date(Date.parse(comment.signed_time)).toDateString()}})
          </span>
        </nuxt-link>
      </div>

      <div>
        <h4 v-if="comment.title" class="font-bold ml-1">
          {{comment.title}}
        </h4>
      </div>

      <div v-if="comment.text" class="whitespace-pre-line my-1">
        <!-- Plain text -->
        <div v-if="!enableMarkdownInComments && !isSignerAllowedIframe">
          {{comment.text}}
        </div>
        <!-- Markdown -->
        <!-- Markdown can be enabled/disabled in the .env file. -->
        <!-- breaks:true changes single \n with <br> -->
        <div
          v-if="enableMarkdownInComments && !isSignerAllowedIframe"
          v-dompurify-html="(marked(comment.text, {breaks:true}))"
        />
        <!--
          Disable dompurify if a signer is whitelisted so links with
          videos can be properly embedded e.g. with <iframe> tags
        -->
        <!-- Markdown and iframe tags -->
        <div
          v-if="enableMarkdownInComments && isSignerAllowedIframe"
          v-html="(marked(textWithIframeTags, {breaks:true}))"
        />
        <!-- Iframe tags without markdown -->
        <div
          v-if="!enableMarkdownInComments && isSignerAllowedIframe"
          v-html="textWithIframeTags"
        />
      </div>

    </div>

    <div>
      <InfoPostCommentsCardReactionsBar :comment="comment" class="mr-1"/>

      <span v-if="showCommentsCount">
        <nuxt-link :to="`/news/?p=${comment.signature}`">
          <button v-if="comment.comments_count" class="inline-block mr-2 text-colorBlue-light dark:text-colorBlue-dark">
            <IconsComments class="w-4 inline-block "/>
            {{comment.comments_count}}
          </button>
        </nuxt-link>
      </span>

      <div class="inline-block text-lg lg:text-base text-colorNotImportant-light dark:text-colorNotImportant-dark cursor-pointer" @click="toggleReplyForm">
        {{showReplyFormText}}
      </div>

      <InfoPostCommentInputField v-if="showReplyForm" :target="comment.signature" @reply-submitted="replySubmitted" />
    </div>

    <!--
      Actions like replies and reactions can come from child
      comments, so we have to emit them up to InfoPostComments.
    -->
    <div v-if="comment.children" class="children">
      <InfoPostCommentsCard
        v-for="child in comment.children"
        :id="child.id"
        :key="child.id"
        :comment="child"
        :show-action-details="showActionDetails"
        @reply-submitted="replySubmitted"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import {marked} from 'marked'
import {Post, PostId} from '@/helpers/interfaces'
const {sliceAddress} = useWeb3()
const env = useRuntimeConfig()?.public
const enableMarkdownInComments = env?.enableMarkdownInComments === 'true'? true : false
const enableEmbedIframeTagsInComments = env?.enableEmbedIframeTagsInComments === 'true'? true : false
const {addIframeTags, checkIfSignerAllowedIframe} = useHtmlTags()

const props = defineProps<{
  comment?: Post
  key?: PostId
  showActionDetails?: boolean
  showCommentsCount?: boolean
}>()

const emit = defineEmits<{
  (e: 'reply-submitted', target?: string | number | null): void
}>()

const replySubmitted = (target?: string | number | null) => {
  /* console.log('reply was submitted for target:', target) */
  showReplyForm.value = false
  showReplyFormText.value = 'reply'
  emit('reply-submitted', target)
}

const showReplyForm = ref(false)
const showReplyFormText = ref('reply')

const toggleReplyForm = () => {
      showReplyForm.value = !showReplyForm.value
      showReplyFormText.value = showReplyFormText.value === 'reply'
        ? 'hide'
        : 'reply'
    }

// Iframe tags
let isSignerAllowedIframe: boolean = false
let textWithIframeTags: string = ''

if (enableEmbedIframeTagsInComments) {
  // Check if a signer is allowed to embed iframe tags
  if (typeof(props?.comment?.signer) === 'string') {
    isSignerAllowedIframe = checkIfSignerAllowedIframe(props?.comment?.signer)
  }

  // Add iframe tags if text has any iframe URLs
  // WARNING: it's very important to check whether the
  // signer is allowed to add iframe tags because that's
  // a potential attack vector.
  if (typeof(props?.comment?.text) === 'string' && isSignerAllowedIframe) {
    textWithIframeTags = addIframeTags(props?.comment)
  }
}
</script>

<style scoped>

</style>
