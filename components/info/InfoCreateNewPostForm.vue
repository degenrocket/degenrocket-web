<template>
  <div>
    <div
      v-if="errorMessage"
      class="text-colorRed-light dark:text-colorRed-dark"
    >
      {{ errorMessage }}
    </div>
    <div>Create a new post</div>
    <form class="mb-4" @submit="submitPost">
      <div class="mt-2 text-colorNotImportant-light dark:text-colorNotImportant-dark">Title:</div>
      <input
        v-model="userInputTitle"
        :placeholder="titlePlaceholder"
        class="p-1 bg-bgBase-light dark:bg-bgBase-dark border-bgSecondary-light dark:border-bgSecondary-dark w-[90%] max-w-[700px] focus:outline-none border-2"
        :class="errorTitle ? 'border-red-400 dark:border-red-400 placeholder:text-red-400' : ''"
      >
      <div class="mt-2 text-colorNotImportant-light dark:text-colorNotImportant-dark">Body:</div>
      <textarea
        v-model="userInput"
        :placeholder="bodyPlaceholder"
        class="p-1 bg-bgBase-light dark:bg-bgBase-dark border-bgSecondary-light dark:border-bgSecondary-dark w-[90%] max-w-[700px] h-60 focus:outline-none rounded-b-lg border-2"
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
const {submitAction} = useWeb3()
const env = useRuntimeConfig()?.public
const postPlaceholder = env?.postPlaceholder

const props = defineProps<{
  target: string
}>()

const titlePlaceholder = ref<string>('title')
const bodyPlaceholder = ref<string>(postPlaceholder)

const userInputTitle = ref<string>('')
const userInput = ref<string>('')

const errorTitle = ref<boolean>(false)
const errorBody = ref<boolean>(false)

const errorMessage = ref<string>('')

watch(
  userInputTitle, async (newTitle: string) => {
    if (newTitle) {
      errorTitle.value = false
    } else {
      /* errorTitle.value = true */
    }
  }
)

watch(
  userInput, async (newBody: string) => {
    if (newBody) {
      errorBody.value = false
    } else {
      /* errorBody.value = true */
    }
  }
)

const submitPost = async (e):Promise<void> => {
  e.preventDefault()
  /* console.log("userInputTitle", userInputTitle.value) */
  /* console.log("userInput", userInput.value) */
  /* console.log("submitPost for props.target:", props.target) */

  // highlight a title input field if a title is empty
  if (!userInputTitle.value) {
    errorTitle.value = true
    titlePlaceholder.value = 'title is required'
    return
  }

  // highlight a body input field if a body is empty
  if (!userInput.value) {
    errorBody.value = true
    bodyPlaceholder.value = 'this field is required'
    return
  }
  
  let response

  // It's a comment if there is a target (action = 'reply'). 
  if (props.target && typeof(props?.target) === 'string') {
    response = await submitAction('reply', userInput.value, props?.target, '')

  } else {
  // It's a new post if there is no target (action = 'post').
    response = await submitAction('post', userInput.value, '', userInputTitle.value)
  }

  /* console.log("response:", response) */

  if (response && response.res === 'Success. Action has been saved and incremented') {
    /* console.log("Success") */
    userInput.value = ''
  }

  if (response && response.res === 'ERROR: this address is not whitelisted to submit new posts') {
    errorMessage.value = 'ERROR: this address is not whitelisted to submit new posts'
    alert('ERROR: this address is not whitelisted to submit new posts')
  }

  // This should be a valid response if
  // a reply was submitted successfully.
  if (response && response.res === 'Action has been saved, but count was not incremented') {
    // Redirect a user to a newly created post,
    // signature is also an ID of a new post.
    const router = useRouter()
    router.push(`/news/${response.signature}`)

    // setTimeout() is used to prevent blinking when input fields
    // are emptied before a user is redirected to a new post.
    setTimeout(() => {
      userInput.value = ''
      userInputTitle.value = ''
      errorBody.value = false
      errorTitle.value = false
    }, 2000)
  }
}

</script>

<style scoped>

</style>
