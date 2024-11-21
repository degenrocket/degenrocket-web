<template>
  <div class="mb-16">
    <div
      v-if="errorMessage"
      class="text-colorRed-light dark:text-colorRed-dark"
    >
      {{ errorMessage }}
    </div>
    <div
      class="mb-4"
      v-if="formAction === 'post'"
    >Create a new post</div>
    <form class="mb-4" @submit="submitMessage">
      <!-- Category -->
      <div v-if="formAction === 'post'">
        <div v-if="ifShowCategoriesFilter">
          <!-- Dropdown toggle button -->
          <div
            @click="toggleCategoriesDropDown()"
            class="text-colorNotImportant-light dark:text-colorNotImportant-dark cursor-pointer"
          >
            <span>
              <span class="mt-2">Category:</span>
              <span class="ml-2 uppercase text-colorPrimary-light dark:text-colorPrimary-dark">
                {{ userInputCategoryMain }}
              </span>
            </span>
            <svg
              class="inline w-5 h-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </div>

          <!-- Dropdown menu -->
          <div
            v-show="categoriesDropDownShown"
            class="pl-20 bg-bgSecondary-light dark:bg-bgSecondary-dark rounded-md shadow-md"
          >
          <span v-if="categories">
            <span v-if="categories[0]" class="">
              <div
                v-for="category in categories"
                class="uppercase hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark cursor-pointer"
                @click="selectCategoryMain(category)"
              >
                {{category}}
              </div>
            </span>
          </span>


          </div>


        </div>
      </div>

      <!-- Title -->
      <div v-if="formAction === 'post'">
        <div class="mt-2 text-colorNotImportant-light dark:text-colorNotImportant-dark">Title:</div>
        <input
          v-model="userInputTitle"
          :placeholder="titlePlaceholder"
          class="p-1 bg-bgBase-light dark:bg-bgBase-dark border-bgSecondary-light dark:border-bgSecondary-dark w-[90%] max-w-[700px] focus:outline-none border-2"
          :class="errorTitle ? 'border-red-400 dark:border-red-400 placeholder:text-red-400' : ''"
        >
      </div>

      <!-- Content -->
      <div
        v-if="formAction === 'post'"
        class="mt-2 text-colorNotImportant-light dark:text-colorNotImportant-dark">Body:</div>
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
      <span class="ml-2 cursor-pointer text-colorNotImportant-light dark:text-colorNotImportant-dark mb-4 hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark"
        @click="toggleShowAdvanced()">
        {{showAdvancedText}} advanced
      </span>

      <!-- Networks -->
      <div
        v-if="(connectedKeyType === 'nostr' && !isMultiSign) || (connectedAddressNostr && isMultiSign)"
        class="my-1 mt-2"
      >
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
      DevOnly
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
import {FiltersCategory, SpasmEventCategoryV2, SpasmEventIdV2, SpasmEventV2} from '@/helpers/interfaces';
const ifShowCategoriesFilter = useRuntimeConfig()?.public?.ifShowCategoriesFilter === 'true' ? true : false
const envCategories = useRuntimeConfig()?.public?.envCategories

const {
  submitSingleSignedEventV2,
  submitMultiSignedEventV2,
  connectedAddressEthereum,
  connectedAddressNostr,
  connectedKeyType,
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
const {isStringOrNumber} = useUtils()
const env = useRuntimeConfig()?.public
const postPlaceholder = env?.postPlaceholder

const props = defineProps<{
  formAction?: "post" | "reply"
  parentEvent?: SpasmEventV2 | null
}>()

const emit = defineEmits<{(
  e: 'reply-submitted',
  targets?: (string | number)[] | null): void
}>()

const titlePlaceholder = ref<string>('title')
const bodyPlaceholder = ref<string>(postPlaceholder)

const userInputTitle = ref<string>('')
const userInput = ref<string>('')
const userInputCategoryMain = ref<string>('')
const userInputCategorySub = ref<string>('')

const errorTitle = ref<boolean>(false)
const errorBody = ref<boolean>(false)

const errorMessage = ref<string>('')
const errorMessageMultiSign = ref<string>('')

const categoriesDropDownShown = ref(false)
const showAdvanced = ref(false)
const showAdvancedText = ref('show')

const categories: FiltersCategory[] = [
  ...envCategories,
  'none',
]

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

const toggleCategoriesDropDown = () => {
  categoriesDropDownShown.value = !categoriesDropDownShown.value
}

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

const hideShowAdvanced = (): void => {
  showAdvanced.value = false
  showAdvancedText.value = 'show'
  turnOffMultiSign()
}

const submitMessage = async (e: any):Promise<void> => {
  e.preventDefault()
  errorMessageMultiSign.value = ''

  let response

  // Multi signed message
  if (isMultiSign.value && showAdvanced.value) {
    if (!spasmEventSignedWithEthereum.value) {
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
    if (!userInputTitle.value && props.formAction === 'post') {
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

    const parentEvent = props?.parentEvent
    let categories: SpasmEventCategoryV2[] | null = null
    if (
      parentEvent && "categories" in parentEvent &&
      parentEvent.categories &&
      Array.isArray(parentEvent.categories) &&
      parentEvent.categories[0] &&
      "name" in parentEvent.categories[0] &&
      typeof(parentEvent.categories[0].name) === "string"
    ) {
      categories = parentEvent.categories
    } else if (
      userInputCategoryMain.value &&
      typeof(userInputCategoryMain.value) === "string" &&
      userInputCategoryMain.value.toLowerCase() !== "any" &&
      userInputCategoryMain.value.toLowerCase() !== "none"
    ) {
      if (
        userInputCategorySub.value &&
        typeof(userInputCategorySub.value) === "string" &&
        userInputCategorySub.value.toLowerCase() !== "any" &&
        userInputCategorySub.value.toLowerCase() !== "none"
      ) {
        categories = [{
          name: userInputCategoryMain.value.toLowerCase(),
          sub: { name: userInputCategorySub.value.toLowerCase() }
        }]
      } else {
        categories = [{
          name: userInputCategoryMain.value.toLowerCase()
        }]
      }
    }
    
    // It's a comment if there is a target (action = 'reply'). 
    if (
      props?.formAction === 'reply' &&
      props?.parentEvent?.ids &&
      Array.isArray(props?.parentEvent?.ids)
    ) {
      const parentIds: (string | number)[] = []
      props?.parentEvent?.ids?.forEach(id => {
        if (
          id && "value" in id && id.value &&
          isStringOrNumber(id.value)
        ) { parentIds.push(id.value) }
      })
      response = await submitSingleSignedEventV2(
        'reply', userInput.value, parentIds, '',
        categories
      )

    // It's a new post if there is no target (action = 'post').
    } else if (props?.formAction === 'post') {
      response = await submitSingleSignedEventV2(
        'post', userInput.value, '', userInputTitle.value,
        categories
      )
    }
  }

  if (
    response &&
    response.res &&
    typeof(response.res) === "string" &&
    response.res.startsWith("ERROR:")
  ) { errorMessage.value = response.res }

  if (
    response && "res" in response && response.res &&
    typeof(response.res) === "string" &&
    response.res.toLowerCase().startsWith("success")
    // e.g., 'Success. Action has been saved and incremented'
    /* response && response.res === 'Success. The event was saved into database' */
  ) {
    if (props?.formAction === 'post') {
      if (response.id && typeof(response.id) === "string") {
        const router = useRouter()
        router.push(`/news/${response.id}`)

        setTimeout(() => {
          userInput.value = ''
          userInputTitle.value = ''
          errorBody.value = false
          errorTitle.value = false
          hideShowAdvanced()
        }, 2000)
      }
    } else if (props?.formAction === 'reply') {
      userInput.value = ''
      errorMessage.value = ''
      const targets: (string | number)[] = []
      if (
        props?.parentEvent?.ids &&
        Array.isArray(props?.parentEvent?.ids)
      ) {
        props?.parentEvent?.ids?.forEach(id => {
          if ("value" in id && id.value) {targets.push(id.value)}
        })
      }
      hideShowAdvanced()
      emit('reply-submitted', targets)
    }
  }

  if (
    response && response.res &&
    response.res === 'Sorry, but you\'ve already submitted the same action'
  ) {alert("You've already submitted this comment to this post")}

  if (
    response && response.res &&
    response.res === 'ERROR: this address is not whitelisted to submit new posts'
  ) {
    errorMessage.value = 'ERROR: this address is not whitelisted to submit new posts'
  }
}

const signWithEthereum = async ():Promise<void> => {
  errorMessageMultiSign.value = ''
  // highlight a title input field if a title is empty
  if (!userInputTitle.value && props.formAction === 'post') {
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

  const parentEvent = props?.parentEvent
  let categories: SpasmEventCategoryV2[] | null = null
  if (
    parentEvent && "categories" in parentEvent &&
    parentEvent.categories &&
    Array.isArray(parentEvent.categories) &&
    parentEvent.categories[0] &&
    "name" in parentEvent.categories[0] &&
    typeof(parentEvent.categories[0].name) === "string"
  ) {
    categories = parentEvent.categories
  } else if (
    userInputCategoryMain.value &&
    typeof(userInputCategoryMain.value) === "string" &&
    userInputCategoryMain.value.toLowerCase() !== "any" &&
    userInputCategoryMain.value.toLowerCase() !== "none"
  ) {
    if (
      userInputCategorySub.value &&
      typeof(userInputCategorySub.value) === "string" &&
      userInputCategorySub.value.toLowerCase() !== "any" &&
      userInputCategorySub.value.toLowerCase() !== "none"
    ) {
      categories = [{
        name: userInputCategoryMain.value.toLowerCase(),
        sub: { name: userInputCategorySub.value.toLowerCase() }
      }]
    } else {
      categories = [{
        name: userInputCategoryMain.value.toLowerCase()
      }]
    }
  }

  let response = null
  // It's a comment if there is a target (action = 'reply'). 
  if (
    props?.formAction === 'reply' &&
    props?.parentEvent?.ids &&
    Array.isArray(props?.parentEvent?.ids)
  ) {
    const parentIds: (string | number)[] = []
    props?.parentEvent?.ids?.forEach(id => {
      if (
        id && "value" in id && id.value &&
        isStringOrNumber(id.value)
      ) { parentIds.push(id.value) }
    })

    response = await signMessageWithEthereum(
      'reply', userInput.value, parentIds, '',
      categories
    )

  // It's a new post if there is no target (action = 'post').
  } else if (props?.formAction === 'post') {
    response = await signMessageWithEthereum(
      'post', userInput.value, '', userInputTitle.value,
      categories
    )
  }
}

const signWithNostr = async ():Promise<void> => {
  errorMessageMultiSign.value = ''
  await signSavedMessageWithNostr()
}

const selectCategoryMain = (category: string): void => {
  userInputCategoryMain.value = category
  toggleCategoriesDropDown()
  resetMultiSigning()
}

</script>

<style scoped>

</style>
