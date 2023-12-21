<template>
  <div>
    <ExtraPageNotFound
      :error="error"
      :key="randomNumber()"
    />
  </div>
</template>

<script setup>
const {randomNumber} = useWeb3()

defineProps(['error'])

/* const handleClearError = () => clearError({ redirect: '/' }) */
</script>

<style scoped>
</style>
