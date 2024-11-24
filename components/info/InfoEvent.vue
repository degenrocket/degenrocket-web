<template>
  <div>
    <client-only>
      <span id="top-anchor"></span>
    </client-only>
    <div v-if="eventsStore.getPost && isValidSpasmEventV2(eventsStore?.getPost)" class="mb-36">
      <!-- TODO hydration node mismatch -->
      <InfoEventPreview
        :event="eventsStore.getPost"
        :key="eventsStore?.getPost.ids?.[0]?.value || randomNumber()"
        class="mb-1"
      />

      <InfoEventReactionsBar
        :event="eventsStore.getPost"
      />

      <InfoEventModeratorBar
        :event="eventsStore.getPost"
      />

      <div v-if="enableNewWeb3ActionsAll && enableNewWeb3ActionsReply">
        <InfoCreateNewMessageForm
          v-if="eventsStore.getPost.ids?.[0]?.value"
          :formAction="'reply'"
          :parentEvent="eventsStore.getPost"
          @reply-submitted="replySubmitted"
        />
      </div>

      <!--
        Since comments are fetched inside <InfoPostComments />,
        we can choose a key that will determine when comments
        should be rerendered.

        :key="eventsStore.getPost?.comments_count || randomNumber()"
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

        :key="eventsStore.getPost?.id || randomNumber()"
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
      <InfoEventComments
        :event="eventsStore.getPost"
        :key="eventsStore?.getPost.ids?.[0].value"
        @reply-submitted="replySubmitted"
      />
    </div>

    <!--
    <div v-else>
    -->
    <div v-if="!eventsStore.getPost || !isValidSpasmEventV2(eventsStore?.getPost)">
      <div v-if="isErrorEventNotFound">
        <div v-if="eventId">
          <div class="text-colorNotImportant-light dark:text-colorNotImportant-dark">
            Event ID:
          </div>
          <div class="overflow-auto overflow-wrap break-words">
            {{eventId}}
            <ExtraAddressIcons
              v-if="eventId"
              :key="eventId"
              :value="eventId"
              :showCopyToClipboard="true"
              :showQrCode="true"
              :showExternalWebsite="true"
            />
          </div>
        </div>

        <div class="text-colorNotImportant-light dark:text-colorNotImportant-dark">
          Spasm network:
        </div>
        <div>
          Event not found on this instance.
        </div>

        <div class="text-colorNotImportant-light dark:text-colorNotImportant-dark">
          Nostr network:
        </div>
        <div v-if="!isNostrEvent">
          <div>Not a valid Nostr ID.</div>
        </div>
        <div v-if="isNostrEvent">
          <div>Event has a valid Nostr ID.</div>
          <button
            @click="searchNostrNetwork()"
            class="px-3 py-2 mx-0 mt-2 mb-2 border-2 rounded-lg border-colorPrimary-light dark:border-colorPrimary-dark text-colorPrimary-light dark:text-colorPrimary-dark hover:bg-bgHover-light dark:hover:bg-bgHover-dark"
          >
            Search on Nostr network
          </button>
          <div v-if="getNostrRelays()">
            Using these Nostr relays:
            <div v-for="relay in getNostrRelays()" class="">
              {{relay}}
            </div>
          </div>
        </div>
      </div>
      <div v-else class="animate-pulse">
        <ExtraSpinner />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useEventsStore} from '@/stores/useEventsStore'
import {SpasmEventV2} from '@/helpers/interfaces';
// New web3 actions are enabled by default if not disabled in .env
const env = useRuntimeConfig()?.public
const enableNewWeb3ActionsAll: boolean = env?.enableNewWeb3ActionsAll === 'false'? false : true
const enableNewWeb3ActionsReply: boolean = env?.enableNewWeb3ActionsReply === 'false'? false : true
const eventsStore = useEventsStore()
const params = useRoute().params
const query = useRoute().query
const {randomNumber} = useWeb3()
const {
  isValidSpasmEventV2,
  isArrayWithValues,
  isStringOrNumber
} = useUtils()
const {
  toBeHex,
  getNostrRelays,
} = useNostr()
let isErrorEventNotFound = ref<boolean>(false)
let isNostrEvent = ref<boolean>(false)

const scrollToTop = () => {
  const element = document.querySelector('#top-anchor');
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'end' });
    /* element.scrollIntoView({ block: 'start' }); */
  }
}

if (process.client) {
  // Scroll to the top when author changes
  // Small delay to allow DOM to update
  setTimeout(scrollToTop, 300)
}

const replySubmitted = async (
  targets?: (string | number)[] | null
): Promise<void> => {
  if (!targets || !isArrayWithValues(targets)) { return }
  const event = eventsStore.getPost

  // Refetch all the comments if a user submitted a new reply
  // so a user can see his reply.
  // Next step is to scroll screen down to his new reply.

  if (!isValidSpasmEventV2(event)) {
    console.error("ERROR: event is not a valid SpasmEventV2")
    await nextTick()
    return
  }

  await updateEventWithComments(searchBy)
}

const updateEventWithComments = async (
  id: string | number,
  ifSetCurrentPostId: boolean = true
): Promise<void> => {
  if (!id) { return }
  // 1. Make sure that the post is in the store,
  //    otherwise fetch from server and save to store.
  const result: SpasmEventV2[] | null =
    await eventsStore.fetchAndSaveEventsWithCommentsByIds([id])

  if (
    result && isArrayWithValues(result) &&
    result[0] && isValidSpasmEventV2(result[0])
  ) {
    isErrorEventNotFound.value = false
  } else {
    isErrorEventNotFound.value = true
  }

  if (ifSetCurrentPostId) { eventsStore.setCurrentPostId(id) }
}

const searchNostrNetwork = async (
): Promise<void> => {
  console.log("searching")
  await eventsStore.fetchFromNostrNetworkByIds([searchBy])
}

// Construct a search query to find a post in the database.
// Posts can be fetched using id, signature, or url.
let eventId: string = ""
let searchBy: string = ""

// Examples:
// params.id: domain.com/news/123 (id)
// params.id: domain.com/news/0x123 (sig)
if (params.id && typeof (params.id) === 'string') {
  eventId = params.id
// Examples:
// query.p:   domain.com/news/?p=123 (id)
// query.p:   domain.com/news/?p=0x123 (sig)
// query.p:   domain.com/news/?p=https://abc.com/xyz (url)
} else if (query.p && typeof (query.p) === 'string') {
  eventId = query.p
}

// Convert Nostr's note ID to hex ID
const setSearchBy = (
  newId: string | number
) => {
  if (!newId || !isStringOrNumber(newId)) return
  const newIdString = String(newId)
  if (
    !newIdString ||
    typeof(newIdString) !== "string"
  ) return
  if (
    newIdString.length === 63 &&
    newIdString.startsWith('note')
  ) {
    const eventIdHex = toBeHex(newIdString)
      // Valid Nostr ID
    if (eventIdHex && typeof(eventIdHex) === "string") {
      searchBy = eventIdHex
      isNostrEvent.value = true
    } else {
      // Invalid Nostr's note ID
      searchBy = newIdString
    }
    // Not Nostr's note ID
  } else { searchBy = newIdString }
}

setSearchBy(eventId)

// Server-side rendering (SSR) is currently disabled because
// default event sanitization with DOMPurify inside
// spasm.convertToSpasm() doesn't work during SSR.
/* await updateEvent(searchBy) */

// setCurrentPostId() is used to immediately show selected
// event if it's already in the store. After that we fetch
// event with the tree (comments) from the server.
eventsStore.setCurrentPostId(searchBy)

onMounted(async () => {
  // By some reason fetching does not work from onMounted.
  // However, it works properly when used after nextTick().
  await nextTick()
  await updateEventWithComments(searchBy)
})

// Meta
const {
  defaultMetaAppName,
  defaultMetaTitle,
  defaultMetaDescription
} = useRuntimeConfig()?.public

let title = eventsStore.getPost?.title
let description = eventsStore.getPost?.content

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
  /* console.log("newQueryP:", newQueryP) */
  if (newQueryP && typeof (newQueryP) === 'string') {
    /* const id = await standardizeId(newQueryP) */
    const newId = newQueryP
    eventId = newId
    setSearchBy(newId)
    console.log("searchBy:", searchBy)
    console.log("eventId:", eventId)
    /* await updateEvent(id) */
    eventsStore.setCurrentPostId(newId)
    await updateEventWithComments(newId, false)
    /* await eventsStore.updateEventComments(id) */
  }
})
</script>

<style scoped>

</style>

