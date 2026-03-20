<template>
  <div class="review-page">
    <AppHeader />

    <main class="review-page__content">
      <section v-if="order" class="review-layout">
        <div class="review-card">
          <p class="review-card__tag">订单评价</p>
          <h1 class="review-card__title">评价商品</h1>
          <p class="review-card__description">
            请根据这次购物体验，为本次订单留下简单评价。
          </p>

          <div class="review-card__summary">
            <div class="review-card__row">
              <span>订单编号</span>
              <strong>{{ order.id }}</strong>
            </div>
            <div class="review-card__row">
              <span>商品数量</span>
              <strong>{{ getItemCount(order) }} 件</strong>
            </div>
            <div class="review-card__row">
              <span>订单金额</span>
              <strong>¥{{ order.totalAmount.toFixed(2) }}</strong>
            </div>
          </div>

          <div v-if="review" class="review-result">
            <h2 class="review-result__title">你已经评价过这笔订单</h2>
            <p class="review-result__text">评分：{{ review.rating }} / 5</p>
            <p class="review-result__text">
              评价内容：{{ review.content || '未填写文字评价' }}
            </p>
            <BaseButton type="secondary" @click="goToOrders">
              返回订单列表
            </BaseButton>
          </div>

          <form v-else class="review-form" @submit.prevent="handleSubmit">
            <label class="review-form__field">
              <span class="review-form__label">评分</span>
              <select v-model="rating" class="review-form__select">
                <option :value="5">5 分</option>
                <option :value="4">4 分</option>
                <option :value="3">3 分</option>
                <option :value="2">2 分</option>
                <option :value="1">1 分</option>
              </select>
            </label>

            <label class="review-form__field">
              <span class="review-form__label">评价内容</span>
              <textarea
                v-model.trim="content"
                class="review-form__textarea"
                placeholder="说说你对这次购物的感受"
                rows="5"
              />
            </label>

            <p
              v-if="feedbackMessage"
              class="review-form__message"
              :class="{ 'review-form__message--error': !isSuccessMessage }"
            >
              {{ feedbackMessage }}
            </p>

            <div class="review-form__actions">
              <BaseButton type="secondary" @click="goToOrders">
                返回订单列表
              </BaseButton>
              <BaseButton type="primary" native-type="submit">
                提交评价
              </BaseButton>
            </div>
          </form>
        </div>
      </section>

      <section v-else class="empty-state">
        <h1 class="empty-state__title">未找到该订单</h1>
        <p class="empty-state__description">
          这个订单可能不存在，或者当前链接有误。
        </p>
        <BaseButton type="primary" @click="goToOrders">
          返回订单列表
        </BaseButton>
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppHeader from '../shared/components/AppHeader.vue'
import BaseButton from '../shared/components/BaseButton.vue'
import { useOrder } from '../shared/composables/useOrder.js'
import { useReview } from '../shared/composables/useReview.js'

const route = useRoute()
const router = useRouter()
const rating = ref(5)
const content = ref('')
const feedbackMessage = ref('')
const isSuccessMessage = ref(false)

const { getOrderById } = useOrder()
const { getReviewByOrderId, submitReview } = useReview()

const order = computed(() => {
  return getOrderById(route.params.orderId)
})

const review = computed(() => {
  return getReviewByOrderId(route.params.orderId)
})

function getItemCount(targetOrder) {
  return targetOrder.items.reduce((total, item) => total + item.quantity, 0)
}

function handleSubmit() {
  const result = submitReview({
    orderId: route.params.orderId,
    rating: rating.value,
    content: content.value,
  })

  feedbackMessage.value = result.message
  isSuccessMessage.value = result.success
}

function goToOrders() {
  router.push('/orders')
}
</script>

<style scoped>
.review-page {
  min-height: 100vh;
  background-color: var(--bg-page);
}

.review-page__content {
  width: min(100%, 880px);
  margin: 0 auto;
  padding: var(--spacing-xl) var(--spacing-lg);
}

.review-card,
.empty-state {
  display: grid;
  gap: var(--spacing-md);
  padding: var(--spacing-xl);
  background-color: var(--bg-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}

.review-card__tag {
  margin: 0;
  color: var(--color-primary);
  font-weight: 700;
}

.review-card__title {
  margin: 0;
  font-size: 34px;
}

.review-card__description {
  margin: 0;
  color: var(--text-secondary);
  line-height: 1.8;
}

.review-card__summary {
  display: grid;
  gap: var(--spacing-sm);
  padding: var(--spacing-lg);
  border-radius: var(--radius-md);
  background-color: var(--bg-hover);
}

.review-card__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
}

.review-result {
  display: grid;
  gap: var(--spacing-sm);
  padding: var(--spacing-lg);
  border-radius: var(--radius-md);
  background-color: var(--bg-hover);
}

.review-result__title,
.review-result__text {
  margin: 0;
}

.review-form {
  display: grid;
  gap: var(--spacing-md);
}

.review-form__field {
  display: grid;
  gap: var(--spacing-sm);
}

.review-form__label {
  font-weight: 600;
}

.review-form__select,
.review-form__textarea {
  width: 100%;
  min-height: 44px;
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  background-color: var(--bg-card);
  color: var(--text-primary);
  font-size: 16px;
}

.review-form__textarea {
  min-height: 140px;
  resize: vertical;
}

.review-form__message {
  margin: 0;
  color: #1f8f55;
  line-height: 1.7;
}

.review-form__message--error {
  color: var(--color-danger);
}

.review-form__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
}

.empty-state {
  justify-items: start;
}

.empty-state__title {
  margin: 0;
  font-size: 28px;
}

.empty-state__description {
  margin: 0;
  color: var(--text-secondary);
  line-height: 1.7;
}

@media (max-width: 768px) {
  .review-page__content {
    padding: var(--spacing-lg) var(--spacing-md);
  }

  .review-card,
  .empty-state {
    padding: var(--spacing-lg);
  }

  .review-card__row {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
