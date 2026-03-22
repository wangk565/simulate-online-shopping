import { computed, ref, watch } from 'vue'
import { getStorage, setStorage } from '../../storage/index.js'
import { useUser } from './useUser.js'

const REVIEW_KEY_PREFIX = 'shopping_reviews_'

const { currentUser } = useUser()
const reviews = ref([])

const reviewStorageKey = computed(() => {
  if (!currentUser.value) {
    return ''
  }

  return `${REVIEW_KEY_PREFIX}${currentUser.value.id}`
})

function loadReviews() {
  if (!reviewStorageKey.value) {
    reviews.value = []
    return
  }

  reviews.value = getStorage(reviewStorageKey.value, [])
}

function saveReviews() {
  if (!reviewStorageKey.value) {
    return
  }

  setStorage(reviewStorageKey.value, reviews.value)
}

watch(currentUser, loadReviews, { immediate: true })

export function useReview() {
  function getReviewByOrderId(orderId) {
    return reviews.value.find((review) => review.orderId === orderId) || null
  }

  function hasReviewed(orderId) {
    return getReviewByOrderId(orderId) !== null
  }

  function submitReview(reviewData) {
    if (!currentUser.value) {
      return {
        success: false,
        message: '请先登录后再提交评价',
      }
    }

    if (!reviewData?.orderId) {
      return {
        success: false,
        message: '订单信息无效',
      }
    }

    if (hasReviewed(reviewData.orderId)) {
      return {
        success: false,
        message: '该订单已经评价过了',
      }
    }

    const rating = Number(reviewData.rating)

    if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
      return {
        success: false,
        message: '评分必须在 1 到 5 之间',
      }
    }

    const newReview = {
      id: `review_${Date.now()}`,
      orderId: reviewData.orderId,
      userId: currentUser.value.id,
      rating,
      content: (reviewData.content || '').trim(),
      createdAt: new Date().toISOString(),
    }

    reviews.value.unshift(newReview)
    saveReviews()

    return {
      success: true,
      message: '评价提交成功',
      review: newReview,
    }
  }

  return {
    reviews,
    getReviewByOrderId,
    hasReviewed,
    submitReview,
  }
}
