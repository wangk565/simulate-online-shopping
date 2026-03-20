import { ref } from 'vue'

const loadingVisible = ref(false)
const loadingText = ref('加载中...')

export function useLoading() {
  function showLoading(text = '加载中...') {
    loadingText.value = text
    loadingVisible.value = true
  }

  function hideLoading() {
    loadingVisible.value = false
  }

  return {
    loadingVisible,
    loadingText,
    showLoading,
    hideLoading,
  }
}
