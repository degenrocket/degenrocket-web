<template>
  <div 
    v-if="notification.show"
    :class="[
      'fixed m-5 top-5 right-5 z-50 rounded-md px-4 py-2 shadow-lg text-sm transition-all duration-700 ease-out fade-in-custom',
      notification.type === 'success' 
        ? 'bg-green-500 text-white' 
        : '',
      notification.type === 'error' 
        ? 'bg-red-500 text-white'
        : '',
      notification.type === 'warning' 
        ? 'bg-yellow-500 text-white'
        : '',
      notification.type === 'note' 
        ? 'bg-blue-500 text-white' 
        : '',
      notification.animationState === 'leaving'
        ? 'fade-out-custom'
        : ''
    ]"
  >
    {{ notification.message }}
  </div>
</template>

<script setup lang="ts">
import {
  useNotificationStore
} from '@/stores/useNotificationStore'

const { notification } = useNotificationStore()
</script>

<style scoped>
.fade-in-custom {
  animation: fadeIn 0.5s;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.fade-out-custom {
  animation: fadeOut 2s;
}

@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}
</style>
