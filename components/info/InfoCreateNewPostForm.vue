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
        class="block p-1 bg-bgBase-light dark:bg-bgBase-dark border-bgSecondary-light dark:border-bgSecondary-dark w-[90%] max-w-[700px] h-60 lg:h-48 focus:outline-none rounded-b-lg border-2"
        :class="errorBody ? 'border-red-400 dark:border-red-400 placeholder:text-red-400' : ''"
      />
      <button
        v-if="!showAdvanced"
        type="submit"
        class="inline px-6 lg:min-w-[200px] min-h-[40px] text-colorPrimary-light dark:text-colorPrimary-dark border-2 border-colorPrimary-light dark:border-colorPrimary-dark rounded-lg hover:bg-bgHover-light dark:hover:bg-bgHover-dark">
        Sign message
      </button>
      <!-- TODO advanced is hidden -->
      <span class="ml-2 cursor-pointer text-colorNotImportant-light dark:text-colorNotImportant-dark mb-4 hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark"
        @click="toggleShowAdvanced()">
        {{showAdvancedText}} advanced
      </span>

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

      <!-- Advanced (multi-signing) -->
      <div v-if="showAdvanced" class="mt-1">
        Sign with multiple private keys:
        <div v-if="connectedAddressEthereum">
          Ethereum: {{ sliceAddress(connectedAddressEthereum, 8, 6) }}
          <span
            @click="showWeb3Modal"
            class="hover:underline cursor-pointer text-colorPrimary-light dark:text-colorPrimary-dark"
          > change </span> /
          <span
            @click="removeAddressEthereum"
            class="hover:underline cursor-pointer text-colorPrimary-light dark:text-colorPrimary-dark"
          > remove </span>
        </div>
        <div v-else>
          <span
            @click="showWeb3Modal"
            class="hover:underline cursor-pointer text-colorPrimary-light dark:text-colorPrimary-dark"
          >
            Click to connect Ethereum
          </span>
        </div>
        <div v-if="connectedAddressNostr">
          Nostr: {{ sliceAddress(connectedAddressNostr, 8) }}
          <span
            @click="showWeb3Modal"
            class="hover:underline cursor-pointer text-colorPrimary-light dark:text-colorPrimary-dark"
          >
            change
          </span>
            /
          <span
            @click="removeAddressNostr"
            class="hover:underline cursor-pointer text-colorPrimary-light dark:text-colorPrimary-dark"
          >
            remove
          </span>
        </div>
        <div v-else>
          <span
            @click="showWeb3Modal"
            class="hover:underline cursor-pointer text-colorPrimary-light dark:text-colorPrimary-dark"
          >
            Click to connect Nostr
          </span>
        </div>
        <div v-if="connectedAddressEthereum && connectedAddressNostr">
          <div
            v-if="!spasmEventSignedWithEthereum"
            class="block hover:underline cursor-pointer text-colorPrimary-light dark:text-colorPrimary-dark"
            @click="signWithEthereum()"
          >
            Sign with Ethereum
          </div>
          <div v-if="spasmEventSignedWithEthereum">
            Ethereum: signed
          </div>
          <div
            v-if="!spasmEventSignedWithNostr && spasmEventSignedWithEthereum"
            class="block hover:underline cursor-pointer text-colorPrimary-light dark:text-colorPrimary-dark"
            @click="signWithNostr()"
          >
            Sign with Nostr
          </div>
          <div v-if="spasmEventSignedWithNostr">
            Nostr: signed
          </div>
        </div>
        <div
          v-if="errorMessageMultiSign"
          class="text-colorRed-light dark:text-colorRed-dark"
        > ERROR: {{ errorMessageMultiSign }}
        </div>
        <button
          v-if="spasmEventSignedWithEthereum && spasmEventSignedWithNostr"
          class="inline px-6 lg:min-w-[200px] min-h-[40px] text-colorPrimary-light dark:text-colorPrimary-dark border-2 border-colorPrimary-light dark:border-colorPrimary-dark rounded-lg hover:bg-bgHover-light dark:hover:bg-bgHover-dark">
          Submit to
          <span v-if="isNetworkSpasmSelected">Spasm</span>
          <span
            v-if="isNetworkSpasmSelected && isNetworkNostrSelected"
          > and
          </span>
          <span v-if="isNetworkNostrSelected">Nostr</span>
        </button>
      </div>

    </form>
    <DevOnly>
      <div>
        Signed with Ethereum:
        <br/>
        {{ spasmEventSignedWithEthereum }}
      </div>
      <div>
        Signed with Nostr:
        <br/>
        {{ spasmEventSignedWithNostr }}
      </div>
      <div class="mb-8">
        Multi signed with Ethereum and Nostr:
        <br/>
        {{ savedMergedMultiSignedSpasmEventV2 }}
        <br/>
        Number of siblings:
        {{ savedMergedMultiSignedSpasmEventV2?.siblings?.length }}
      </div>
    </DevOnly>
  </div>
</template>

<script setup lang="ts">
const {
  submitSingleSignedEventV2,
  submitMultiSignedEventV2,
  connectedAddressEthereum,
  connectedAddressNostr,
  showWeb3Modal,
  sliceAddress,
  removeAddressEthereum,
  removeAddressNostr,
  resetMultiSigning,
  turnOnMultiSign,
  turnOffMultiSign,
  signMessageWithEthereum,
  signSavedMessageWithNostr,
  isNetworkSpasmSelected,
  isNetworkNostrSelected,
  isMultiSign,
  spasmEventSignedWithEthereum,
  spasmEventSignedWithNostr,
  savedMergedMultiSignedSpasmEventV2
} = useWeb3()
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
const errorMessageMultiSign = ref<string>('')

const showAdvanced = ref(false)
const showAdvancedText = ref('show')

watch(
  userInputTitle, async (newTitle: string) => {
    if (newTitle) {
      errorTitle.value = false
      resetMultiSigning()
    } else {
      /* errorTitle.value = true */
    }
  }
)

watch(
  userInput, async (newBody: string) => {
    if (newBody) {
      errorBody.value = false
      resetMultiSigning()
    } else {
      /* errorBody.value = true */
    }
  }
)

const toggleShowAdvanced = (): void => {
  showAdvanced.value = !showAdvanced.value
  showAdvancedText.value = showAdvancedText.value === 'show'
    ? 'hide'
    : 'show'
  if (showAdvanced.value) {
    turnOnMultiSign()
  } else {
    turnOffMultiSign()
  }
}

const submitPost = async (e: any):Promise<void> => {
  e.preventDefault()
  errorMessageMultiSign.value = ''

  let response

  // Multi signed message
  if (isMultiSign.value && showAdvanced.value) {
    if (!spasmEventSignedWithEthereum.value) {
    console.log("spasmEventSignedWithEthereum.value:", spasmEventSignedWithEthereum.value)
      errorMessageMultiSign.value =
        "Message is not signed with Ethereum yet"
    } else if (!spasmEventSignedWithNostr.value) {
      errorMessageMultiSign.value =
        "Message is not signed with Nostr yet"
    } else if (!savedMergedMultiSignedSpasmEventV2.value) {
      errorMessageMultiSign.value =
        "Something went wrong. Try signing with Ethereum and Nostr again."
    }
    response = await submitMultiSignedEventV2()

  // Single signed message
  } else {
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
    
    // It's a comment if there is a target (action = 'reply'). 
    if (props.target && typeof(props?.target) === 'string') {
      response = await submitSingleSignedEventV2(
        'reply', userInput.value, props?.target, ''
      )

    // It's a new post if there is no target (action = 'post').
    } else {
      response = await submitSingleSignedEventV2(
        'post', userInput.value, '', userInputTitle.value
      )
    }
  }

  console.log("response:", response)

  if (
    response &&
    response.res &&
    typeof(response.res) === "string" &&
    response.res.startsWith("ERROR:")
  ) {
    // console.log("response.res:", response.res)
    errorMessage.value = response.res
  }

  if (response && response.res === 'Success. The event was saved into database') {

    if (response.id && typeof(response.id) === "string") {
      const router = useRouter()
      router.push(`/news/${response.id}`)

      setTimeout(() => {
        userInput.value = ''
        userInputTitle.value = ''
        errorBody.value = false
        errorTitle.value = false
      }, 2000)
    }
  }

  /* if (response && response.res === 'ERROR: this address is not whitelisted to submit new posts') { */
  /*   errorMessage.value = 'ERROR: this address is not whitelisted to submit new posts'              */
  /* }                                                                                                */

  // This should be a valid response if
  // a reply was submitted successfully.
  /* if (response && response.res === 'Action has been saved, but count was not incremented') { */
  /*   // Redirect a user to a newly created post,                                              */
  /*   // signature is also an ID of a new post.                                                */
  /*   const router = useRouter()                                                               */
  /*   router.push(`/news/${response.signature}`)                                               */
  /*                                                                                            */
  /*   // setTimeout() is used to prevent blinking when input fields                            */
  /*   // are emptied before a user is redirected to a new post.                                */
  /*   setTimeout(() => {                                                                       */
  /*     userInput.value = ''                                                                   */
  /*     userInputTitle.value = ''                                                              */
  /*     errorBody.value = false                                                                */
  /*     errorTitle.value = false                                                               */
  /*   }, 2000)                                                                                 */
  /* }                                                                                          */
}

const signWithEthereum = async ():Promise<void> => {
  errorMessageMultiSign.value = ''
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

  const response = await signMessageWithEthereum(
    'post', userInput.value, '', userInputTitle.value
  )
  // TODO
  /* const response = await submitSingleSignedEventV2(   */
  /*   'post', userInput.value, '', userInputTitle.value */
  /* )                                                   */
}

const signWithNostr = async ():Promise<void> => {
  errorMessageMultiSign.value = ''
  await signSavedMessageWithNostr()
}


</script>

<style scoped>

</style>
