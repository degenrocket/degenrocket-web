<template>
  <div>
    <div v-if="introTitle">
      <p class="text-2xl mb-4"><span class="font-bold text-4xl text-colorPrimary-light dark:text-colorPrimary-dark">{{introTitle}}</span> forum</p>
    </div>
    <div v-if="introAbout">
      {{introAbout}}
    </div>

  </div>
</template>

<script setup lang="ts">
const introTitle = useRuntimeConfig()?.public?.introTitle
const introAbout = useRuntimeConfig()?.public?.introAbout
</script>

<style scoped></style>
