import { ref } from 'vue'

const toasts = ref([])

function removeToast(id) {
  toasts.value = toasts.value.filter((toast) => toast.id !== id)
}

export function useToast() {
  function showToast(message, type = 'info', duration = 3000) {
    const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`

    toasts.value.push({
      id,
      message,
      type,
    })

    window.setTimeout(() => {
      removeToast(id)
    }, duration)
  }

  function showSuccess(message) {
    showToast(message, 'success')
  }

  function showError(message) {
    showToast(message, 'error')
  }

  function showWarning(message) {
    showToast(message, 'warning')
  }

  return {
    toasts,
    showToast,
    showSuccess,
    showError,
    showWarning,
    removeToast,
  }
}
