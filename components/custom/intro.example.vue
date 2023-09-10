<template>
  <!-- You can customize this section -->
  <div>
    <div>
      <p class="text-2xl mb-4"><span class="font-bold text-4xl text-colorPrimary-light dark:text-colorPrimary-dark">{{introTitle}}</span> forum</p>
    </div>
    <div>
      {{introAbout}}
    </div>

    <div v-if="ifShowContactsInIntro">
      <CustomContacts />
    </div>

    <div v-if="ifShowIntroTutorial" class="mt-4">
      <p>- Connect a browser extension (MetaMask, Rabby) or log in as a guest.</p>
      <p>- Sign all comments and reactions with your private keys.</p>
      <p>- Never sign any messages that you don't understand.</p>
      <div>
        - This forum is a part of a
        <a href="https://github.com/degenrocket" target="_blank" class="text-colorPrimary-light dark:text-colorPrimary-dark">
          DegenRocket
          <IconsRocket class="custom-icons" />
        </a>
        network.
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
const introTitle = useRuntimeConfig()?.public?.introTitle
const introAbout = useRuntimeConfig()?.public?.introAbout
const ifShowContactsInIntro = useRuntimeConfig()?.public?.ifShowContactsInIntro === 'true' ? true : false
const ifShowIntroTutorial = useRuntimeConfig()?.public?.ifShowIntroTutorial === 'true' ? true : false
</script>

<style scoped></style>
