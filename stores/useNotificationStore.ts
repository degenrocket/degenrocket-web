import { useState } from '#imports'

type NotificationType = 'success' | 'error' | 'warning' | 'note'

interface NotificationState {
  show: boolean
  message: string
  type: NotificationType
  animationState: 'starting' | 'leaving' | 'idle'
}

export const useNotificationStore = () => {
  const notification = useState<NotificationState>('notification', () => ({
    show: false,
    message: '',
    type: 'success'
  }))

  const showNotification = async (
    message: string,
    originalType: 'success' | 'error',
    originalDuration: number = 3000
  ) => {
    if (!message || typeof(message) !== "string") return
    const minDuration = 1500

    let type: NotificationType = 'note'
    if (originalType && typeof(originalType) === "string") {
      if (
        originalType === 'success' || originalType === 'error' ||
        originalType === 'warning' || originalType === 'normal'
      ) { type = originalType }
    } else if (message.toLowerCase().startsWith('success')) {
      type = 'success'
    } else if (message.toLowerCase() === 'submitted') {
      type = 'success'
    } else if (message.toLowerCase().startsWith('error')) {
      type = 'error'
    } else if (message.toLowerCase().startsWith('warning')) {
      type = 'warning'
    } else if (message.toLowerCase().startsWith('note')) {
      type = 'note'
    } 
    let duration: number = 3000
    if (typeof(originalDuration) === "number") {
      if (originalDuration > minDuration) {
        duration = originalDuration
      } else { duration = minDuration }
    }
    let durationAnimationLeaving = duration - 1000

    notification.value.show = false
    await nextTick()

    notification.value.animationState = 'starting'
    notification.value.show = true
    notification.value.message = message
    notification.value.type = type

    setTimeout(() => {
      notification.value.animationState = 'leaving'
    }, durationAnimationLeaving)
    
    setTimeout(() => {
      notification.value.show = false
    }, duration)
  }

  return { notification, showNotification }
}
