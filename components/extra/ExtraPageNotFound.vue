<template>
  <div
    class="text-lg w-screen h-screen mx-auto text-center bg-bgBase-light dark:bg-bgBase-dark text-colorBase-light dark:text-colorBase-dark"
  >
    <p 
      v-if="error && error.statusCode"
      class="pt-7 text-7xl font-bold"
    >{{ error.statusCode }}</p>
    <p class="pt-7 text-md">starting the engine...</p>
    <p class="text-md">no fuel</p>
    <p class="text-md">error</p>
    <p class="text-md">error</p>
    <p class="text-md">error</p>
    <p
      v-if="error && error.message"
      class="pt-7"
    >{{ error.message }}</p>
    <div
      class="px-2 py-4 mx-auto mt-6 mb-12 max-w-sm cursor-pointer border-2 rounded-lg border-colorPrimary-light dark:border-colorPrimary-dark text-colorPrimary-light dark:text-colorPrimary-dark hover:bg-bgHover-light dark:hover:bg-bgHover-dark"
      @click="handleClearError">
      <IconsArrowLeft class="custom-icons" />
      Try another rocket
      <IconsRocket class="custom-icons" />
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  error?: any
}>()

const handleClearError = () => clearError({ redirect: '/' })
</script>

<style scoped>

</style>
