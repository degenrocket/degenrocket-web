<template>
  <div v-if="target">
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
    </form>
  </div>
</template>

<script setup lang="ts">
/* import {usePostsStore} from '@/stores/usePostsStore' */
/* const postsStore = usePostsStore()                   */
const env = useRuntimeConfig()?.public
const commentPlaceholder = env?.commentPlaceholder
const {submitAction} = useWeb3()

const props = defineProps<{
  target?: string | number | null
}>()

const emit = defineEmits<{
  (e: 'reply-submitted', target?: string | number | null): void
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
const submitReply = async (e):Promise<void> => {
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
  if (typeof(props?.target) === 'string') {
    const result = await submitAction(
      'reply', userInput.value, props?.target, ''
    )
    if (result && result.res) {
      response = result.res
    }
  } else {
  // It's a new post if there is no target (action = 'post').
    const result = await submitAction('post', userInput.value, '', '')
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
    emit('reply-submitted', props.target)
  }
}

</script>

<style scoped>

</style>

