<template>
  <div class="p-3">
    <p class="text-2xl mb-5">Contacts</p>

    <CustomContacts />

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
const ifShowDevelopersInfo = useRuntimeConfig()?.public?.ifShowDevelopersInfo === 'true' ? true : false
</script>

<style scoped>

</style>
