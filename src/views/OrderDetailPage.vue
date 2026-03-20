<template>
  <div class="order-detail-page">
    <AppHeader />

    <main class="order-detail-page__content">
      <section v-if="order" class="detail-layout">
        <div class="detail-main">
          <section class="detail-card">
            <h1 class="detail-card__title">订单详情</h1>
            <div class="detail-card__grid">
              <div class="detail-card__item">
                <span class="detail-card__label">订单编号</span>
                <strong>{{ order.id }}</strong>
              </div>
              <div class="detail-card__item">
                <span class="detail-card__label">创建时间</span>
                <strong>{{ formatTime(order.createdAt) }}</strong>
              </div>
              <div class="detail-card__item">
                <span class="detail-card__label">订单状态</span>
                <strong>{{ order.status }}</strong>
              </div>
              <div class="detail-card__item">
                <span class="detail-card__label">物流状态</span>
                <strong>{{ order.logisticsStatus }}</strong>
              </div>
            </div>
          </section>

          <section class="detail-card">
            <h2 class="detail-card__subtitle">收货信息</h2>
            <div class="detail-card__grid">
              <div class="detail-card__item">
                <span class="detail-card__label">收货人</span>
                <strong>{{ order.receiverName || '未填写' }}</strong>
              </div>
              <div class="detail-card__item">
                <span class="detail-card__label">联系电话</span>
                <strong>{{ order.phone || '未填写' }}</strong>
              </div>
              <div class="detail-card__item detail-card__item--full">
                <span class="detail-card__label">收货地址</span>
                <strong>{{ order.address || '未填写' }}</strong>
              </div>
            </div>
          </section>

          <section class="detail-card">
            <h2 class="detail-card__subtitle">商品清单</h2>

            <article
              v-for="item in order.items"
              :key="`${order.id}-${item.productId}`"
              class="order-item"
            >
              <div class="order-item__image">{{ item.name }}</div>
              <div class="order-item__body">
                <h3 class="order-item__title">{{ item.name }}</h3>
                <p class="order-item__meta">单价 ¥{{ item.price.toFixed(2) }}</p>
                <p class="order-item__meta">数量 {{ item.quantity }}</p>
              </div>
              <strong class="order-item__subtotal">
                ¥{{ (item.price * item.quantity).toFixed(2) }}
              </strong>
            </article>
          </section>

          <section class="detail-card">
            <LogisticsTimeline
              :timeline="logistics?.timeline || []"
              :current-status="logistics?.currentStatus || order.logisticsStatus"
            />
          </section>
        </div>

        <aside class="summary-card">
          <h2 class="summary-card__title">订单汇总</h2>
          <div class="summary-card__row">
            <span>商品总数</span>
            <strong>{{ getItemCount(order) }} 件</strong>
          </div>
          <div class="summary-card__row">
            <span>订单金额</span>
            <strong>¥{{ order.totalAmount.toFixed(2) }}</strong>
          </div>
          <div class="summary-card__row">
            <span>运费</span>
            <strong>¥0.00</strong>
          </div>
          <div class="summary-card__total">
            <span>实付金额</span>
            <strong>¥{{ order.totalAmount.toFixed(2) }}</strong>
          </div>

          <p
            v-if="feedbackMessage"
            class="summary-card__message"
            :class="{ 'summary-card__message--error': !isSuccessMessage }"
          >
            {{ feedbackMessage }}
          </p>

          <div class="summary-card__actions">
            <BaseButton
              v-if="order.status !== '已完成'"
              type="primary"
              @click="handleConfirmReceipt"
            >
              确认收货
            </BaseButton>
            <BaseButton
              v-else-if="!reviewed"
              type="primary"
              @click="goToReview"
            >
              去评价
            </BaseButton>
            <BaseButton
              v-else
              type="secondary"
              @click="goToReview"
            >
              已评价，查看评价
            </BaseButton>
            <BaseButton type="secondary" @click="goToOrders">
              返回订单列表
            </BaseButton>
          </div>
        </aside>
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
import LogisticsTimeline from '../shared/components/LogisticsTimeline.vue'
import { useOrder } from '../shared/composables/useOrder.js'
import { useReview } from '../shared/composables/useReview.js'
import { useLogistics } from '../modules/logistics/composables/useLogistics.js'

const route = useRoute()
const router = useRouter()
const feedbackMessage = ref('')
const isSuccessMessage = ref(false)

const { getOrderById, confirmReceipt } = useOrder()
const { hasReviewed } = useReview()
const { getLogistics, updateLogisticsCurrentStatus } = useLogistics()

const order = computed(() => {
  return getOrderById(route.params.id)
})

const logistics = computed(() => {
  if (!order.value) {
    return null
  }

  return getLogistics(order.value.id)
})

const reviewed = computed(() => {
  if (!order.value) {
    return false
  }

  return hasReviewed(order.value.id)
})

function formatTime(time) {
  const date = new Date(time)

  if (Number.isNaN(date.getTime())) {
    return '未知时间'
  }

  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function getItemCount(targetOrder) {
  return targetOrder.items.reduce((total, item) => total + item.quantity, 0)
}

function handleConfirmReceipt() {
  if (!order.value) {
    return
  }

  const result = confirmReceipt(order.value.id)

  if (result.success) {
    updateLogisticsCurrentStatus(order.value.id, '已签收')
  }

  feedbackMessage.value = result.message
  isSuccessMessage.value = result.success
}

function goToReview() {
  if (!order.value) {
    return
  }

  router.push(`/review/${order.value.id}`)
}

function goToOrders() {
  router.push('/orders')
}
</script>

<style scoped>
.order-detail-page {
  min-height: 100vh;
  background-color: var(--bg-page);
}

.order-detail-page__content {
  width: min(100%, 1200px);
  margin: 0 auto;
  padding: var(--spacing-lg);
}

.detail-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: var(--spacing-lg);
}

.detail-main {
  display: grid;
  gap: var(--spacing-lg);
}

.detail-card,
.summary-card,
.empty-state {
  background-color: var(--bg-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.detail-card {
  display: grid;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
}

.detail-card__title,
.detail-card__subtitle,
.summary-card__title {
  margin: 0;
}

.detail-card__title {
  font-size: 32px;
}

.detail-card__subtitle,
.summary-card__title {
  font-size: 24px;
}

.detail-card__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: var(--spacing-md);
}

.detail-card__item {
  display: grid;
  gap: var(--spacing-xs);
}

.detail-card__item--full {
  grid-column: 1 / -1;
}

.detail-card__label {
  color: var(--text-secondary);
  font-size: 14px;
}

.order-item {
  display: grid;
  grid-template-columns: 120px minmax(0, 1fr) auto;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md) 0;
  border-top: 1px solid var(--border-default);
}

.order-item__image {
  display: grid;
  place-items: center;
  min-height: 100px;
  padding: var(--spacing-sm);
  border-radius: var(--radius-md);
  background-color: var(--bg-hover);
  color: var(--text-secondary);
  text-align: center;
  font-weight: 700;
}

.order-item__body {
  display: grid;
  gap: var(--spacing-xs);
}

.order-item__title,
.order-item__meta {
  margin: 0;
}

.order-item__meta {
  color: var(--text-secondary);
}

.order-item__subtotal {
  color: var(--color-primary);
  font-size: 20px;
}

.summary-card {
  display: grid;
  gap: var(--spacing-md);
  align-content: start;
  padding: var(--spacing-lg);
}

.summary-card__row,
.summary-card__total {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
}

.summary-card__total {
  padding-top: var(--spacing-sm);
  border-top: 1px solid var(--border-default);
  font-size: 20px;
}

.summary-card__message {
  margin: 0;
  color: #1f8f55;
  line-height: 1.7;
  font-size: 14px;
}

.summary-card__message--error {
  color: var(--color-danger);
}

.summary-card__actions {
  display: grid;
  gap: var(--spacing-sm);
}

.empty-state {
  display: grid;
  gap: var(--spacing-md);
  justify-items: start;
  padding: var(--spacing-xl);
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

@media (max-width: 900px) {
  .detail-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .order-detail-page__content {
    padding: var(--spacing-md);
  }

  .detail-card,
  .summary-card {
    padding: var(--spacing-md);
  }

  .order-item {
    grid-template-columns: 1fr;
    align-items: start;
  }
}
</style>
