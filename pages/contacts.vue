<template>
  <div class="p-3">
    <p class="text-2xl mb-5">Contacts</p>
      <DefaultContacts v-if="enableDefaultContacts" />
      <CustomContacts v-if="enableCustomContacts" />

    <div v-if="ifShowDevelopersInfo">
      <p class="mt-5 text-colorNotImportant-light dark:text-colorNotImportant-dark">For developers:</p>
      <div>
        This forum is a part of a
        <a href="https://github.com/degenrocket" target="_blank" class="text-colorPrimary-light dark:text-colorPrimary-dark">
          DegenRocket
          <IconsRocket class="custom-icons" />
        </a>
        network.
      </div>
      <div>
        Check the code on Github to run your own rocket.
      </div>

    </div>

  </div>
</template>

<script setup lang="ts">
// Features are enabled by default if not explicitly disabled in .env
const ifShowDevelopersInfo = useRuntimeConfig()?.public?.ifShowDevelopersInfo === 'false' ? false : true
const enableDefaultContacts = useRuntimeConfig()?.public?.enableDefaultContacts === 'false' ? false : true
const enableCustomContacts = useRuntimeConfig()?.public?.enableCustomContacts === 'false' ? false : true
</script>

<style scoped>

</style>
