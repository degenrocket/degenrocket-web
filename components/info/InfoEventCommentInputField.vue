<template>
  <div v-if="targetIds">
    <div
      v-if="errorMessage"
      class="text-colorRed-light dark:text-colorRed-dark"
    >
      {{ errorMessage }}
    </div>
    <form class="mb-10" @submit="submitReply">
      <textarea
      v-model="userInput"
      :placeholder="bodyPlaceholder"
      class="p-1 bg-bgBase-light dark:bg-bgBase-dark w-[90%] max-w-[700px] h-[220px] lg:h-[180px] rounded-b-lg focus:outline-none border-bgSecondary-light dark:border-bgSecondary-dark border"
        :class="errorBody ? 'border-red-400 dark:border-red-400 placeholder:text-red-400' : ''"
      />
      <button type="submit"
        class="block min-w-[200px] min-h-[40px] text-colorPrimary-light dark:text-colorPrimary-dark border-2 border-colorPrimary-light dark:border-colorPrimary-dark rounded-lg hover:bg-bgHover-light dark:hover:bg-bgHover-dark">
        Sign reply
      </button>

      <!-- Networks -->
      <div v-if="connectedAddressNostr" class="my-1 mt-2">
        Submit to networks:
        <span class="ml-2">
          <!--
          <input disabled checked
            type="checkbox" class="h-5 w-5"
          />
          -->
          <input
            type="checkbox"
            class="h-4 w-4"
            v-model="isNetworkSpasmSelected"
          />
          <label class="ml-1">Spasm</label>
        </span>
        <span class="ml-3">
          <input
            type="checkbox"
            class="h-4 w-4"
            v-model="isNetworkNostrSelected"
          />
          <label class="ml-1">Nostr</label>
        </span>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
/* import {usePostsStore} from '@/stores/usePostsStore' */

import {SpasmEventIdV2} from '@/helpers/interfaces';

/* const postsStore = usePostsStore()                   */
const env = useRuntimeConfig()?.public
const commentPlaceholder = env?.commentPlaceholder
const {
  submitSingleSignedEventV2,
  connectedAddressNostr,
  isNetworkSpasmSelected,
  isNetworkNostrSelected
} = useWeb3()
const {isStringOrNumber} = useUtils()

const props = defineProps<{
  targetIds?: SpasmEventIdV2[] | null
}>()

const emit = defineEmits<{
  (e: 'reply-submitted', targets?: (string | number)[] | null): void
}>()

const userInput = ref('')
const errorBody = ref(false)
/* const bodyPlaceholder = ref(`share your wisdom with other degens...
(basic markdown is enabled, tags are sanitized`) */
const bodyPlaceholder = ref(commentPlaceholder)

const errorMessage = ref<string>('')

watch(
  userInput, async (newBody) => {
    if (newBody) {
      errorBody.value = false
    } else {
      /* errorBody.value = true */
      bodyPlaceholder.value = commentPlaceholder
    }
  }
)

// TODO
const submitReply = async (e: any):Promise<void> => {
  e.preventDefault()
  /* console.log("userInput", userInput.value) */
  /* console.log("submitReply for target:", props.target) */
  if (!userInput.value) {
    /* alert("You didn't type anything") */
    errorBody.value = true
    bodyPlaceholder.value = 'this field is required'
    return
  }
  
  let response = null
  // It's a comment if there is target (action = 'reply'). 
  if (props?.targetIds && Array.isArray(props?.targetIds)) {
    const parentIds: (string | number)[] = []
    props?.targetIds.forEach(id => {
      if (
        id && "value" in id && id.value &&
        isStringOrNumber(id.value)
      ) { parentIds.push(id.value) }
    })
    const result = await submitSingleSignedEventV2(
      'reply', userInput.value, parentIds, ''
    )
    if (result && result.res) {
      response = result.res
    }
  } else {
  // It's a new post if there is no target (action = 'post').
    const result = await submitSingleSignedEventV2('post', userInput.value, '', '')
    if (result && result.res) {
      response = result.res
    }
  }

  /* console.log("response:", response) */
  if (
    response && typeof(response) === "string" &&
    response.toLowerCase().startsWith("error")
  ) {
    errorMessage.value = response
  }

  if (
    response && typeof(response) === "string" &&
    response.toLowerCase().startsWith("success")
    // e.g., 'Success. Action has been saved and incremented'
  ) {
    userInput.value = ''
    errorMessage.value = ''
    const targets: (string | number)[] = []
    if (props.targetIds && Array.isArray(props.targetIds)) {
      props.targetIds.forEach(id => {
        if ("value" in id && id.value) {
          targets.push(id.value)
        }
      })
    }
    emit('reply-submitted', targets)
  }

  if (
    response && typeof(response) === "string" &&
    response === 'Sorry, but you\'ve already submitted the same action'
  ) {
    alert("You've already submitted this comment to this post")
  }
}

</script>

<style scoped>

</style>

