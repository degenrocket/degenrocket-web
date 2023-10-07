<template>
  <div>
    <div v-if="enableNewWeb3ActionsAll && enableNewWeb3ActionsPost">
      <InfoCreateNewPostForm
        :target="''"
      />
    </div>
    <div v-else>
      Submitting all new web3 posts is currently disabled
    </div>
  </div>
</template>

<script setup lang="ts">
// New web3 actions are enabled by default if not disabled in .env
const env = useRuntimeConfig()?.public
const enableNewWeb3ActionsAll: boolean = env?.enableNewWeb3ActionsAll === 'false'? false : true
const enableNewWeb3ActionsPost: boolean = env?.enableNewWeb3ActionsPost === 'false'? false : true
</script>

<style scoped></style>

