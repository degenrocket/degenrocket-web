<template>
  <div class="p-1">
    <div class="pt-2 block cursor-pointer lg:hidden text-colorNotImportant-light dark:text-colorNotImportant-dark"
      @click="showFeed()">
      <IconsArrowLeft class="custom-icons" />Show feed
    </div>
    <!-- 
      Hydration mismatch can be solved by wrapping </slot>
      with <client-only> tags, but that's bad for SEO.
      Hydration mismatch doesn't occur with build/preview.
    -->
    <slot />
  </div>
</template>

<script setup lang="ts">
const {showFeed} = useFeed()

</script>

<style scoped>

</style>

