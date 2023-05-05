<template>
  <div v-if="target">
    <form class="mb-10" @submit="submitReply">
      <!--
      placeholder="share your wisdom with other degens...
      (markdown is disabled)"
      -->
      <textarea
      v-model="userInput"
      :placeholder="bodyPlaceholder"
      class="p-1 bg-bgBase-light dark:bg-bgBase-dark w-[90%] max-w-[700px] h-[160px] rounded-b-lg focus:outline-none border-bgSecondary-light dark:border-bgSecondary-dark border"
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
const {submitAction} = useWeb3()

const props = defineProps<{
  target?: string | number | null
}>()

const emit = defineEmits<{
  (e: 'reply-submitted', target?: string | number | null): void
}>()

const userInput = ref('')
const errorBody = ref(false)
const bodyPlaceholder = ref(`share your wisdom with other degens...
(markdown is disabled)`)

watch(
  userInput, async (newBody) => {
    if (newBody) {
      errorBody.value = false
    } else {
      /* errorBody.value = true */
      bodyPlaceholder.value = `share your wisdom with other degens...
      (markdown is disabled)`
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
  
  let response
  // It's a comment if there is target (action = 'reply'). 
  if (typeof(props?.target) === 'string') {
    const { res } = await submitAction('reply', userInput.value, props?.target, '')
    response = res
  } else {
  // It's a new post if there is no target (action = 'post').
    const { res } = await submitAction('post', userInput.value, '', '')
    response = res
  }

  /* console.log("response:", response) */

  if (response === 'Success. Action has been saved and incremented') {
    userInput.value = ''
    emit('reply-submitted', props.target)
  }
}

</script>

<style scoped>

</style>

