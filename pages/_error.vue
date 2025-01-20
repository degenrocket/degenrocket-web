<script lang="ts" setup>
// 404 errors are usually handled by ./error.vue, but
// ./pages/_error.vue should catch all routes that didn't
// match any other route and didn't throw any errors.
const {randomNumber} = useUtils()
</script>

<template>
  <div>
    <ExtraPageNotFound
      :key="randomNumber()"
    />
  </div>
</template>

<style scoped>
</style>
