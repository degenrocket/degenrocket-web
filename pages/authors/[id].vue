<template>
  <div class="p-2">
    <div>
      <ExtraBlockies v-if="author" :seed="author" :scale="10" />
    </div>

    <div class="mt-2">
      <div class="text-colorNotImportant-light dark:text-colorNotImportant-dark">
        Author:
      </div>
      <span class="overflow-auto overflow-wrap break-words">
      {{ author }}
      </span>
      <ExtraAddressIcons
        v-if="author"
        :key="author"
        :value="author"
        :showCopyToClipboard="true"
        :showQrCode="true"
        :showExternalWebsite="true"
      />
    </div>

    <div class="mt-4 mb-12">
      All actions:
      <div class="cursor-pointer text-colorNotImportant-light dark:text-colorNotImportant-dark mb-4 hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark"
        @click="toggleShowActionDetails()">
        {{showActionDetailsText}} details
      </div>

      <div v-if="areValidPosts(posts)">
        <InfoPostCommentsCard
          v-for="post in posts"
          :key="post.id"
          :comment="post"
          :show-comments-count="false"
          :show-action-details="showActionDetails"
        />
      </div>

    </div>

  </div>
</template>

<script setup lang="ts">
import {Post} from '@/helpers/interfaces';
const { id } = useRoute().params
const author = id

const {areValidPosts, copyToClipboard} = useUtils()
const apiURL = useRuntimeConfig()?.public?.apiURL

const showActionDetails = ref(false)
const showActionDetailsText = ref('show')

let posts = reactive<Post[]>([])

let isError = ref<boolean>(false)

const path: string = `${apiURL}/api/authors/${author}`

const {data, error} = await useFetch(path)
/* console.log("data:", data) */

if (error.value) {
  isError.value = true
  console.error(error.value)
}

posts = data

const toggleShowActionDetails = (): void => {
  showActionDetails.value = !showActionDetails.value
  showActionDetailsText.value = showActionDetailsText.value === 'show'
    ? 'hide'
    : 'show'
}
</script>

<style scoped>

</style>
