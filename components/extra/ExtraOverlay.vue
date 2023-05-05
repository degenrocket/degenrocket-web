<script lang="ts" setup>
// micro compiler
const emit = defineEmits(['onClose'])

// state
const show = ref(false)

// methods
const close = () => {
  show.value = false
  setTimeout(() => emit('onClose'), 100)
}

// lifecycle
onMounted(() => {
  setTimeout(() => (show.value = true), 100)
})
</script>


<template>
  <div v-if="show">
    <div class="fixed bg-black opacity-70 z-50 top-0 left-0 w-screen h-screen" @click="close"/>
  </div>
</template>
