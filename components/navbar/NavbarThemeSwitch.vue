<template>
  <span class="cursor-pointer" @click="setColorTheme()">
    <IconsSun class="m-1 w-6 inline-block dark:hidden" />
    <IconsMoon class="m-1 w-6 hidden dark:inline-block" />
  </span>
</template>

<script setup lang="ts">
  const setColorTheme = () => {
    // When manually toggled, change preference from "system" to custom
    // otherwise theme will change to system every time a new post is opened
    useColorMode().preference = useColorMode().value === 'light' ? 'dark' : 'light'
  }
</script>

<style scoped></style>

