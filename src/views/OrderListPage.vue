<template>
  <div class="order-list-page">
    <AppHeader />

    <main class="order-list-page__content">
      <section class="order-list-page__header">
        <h1 class="order-list-page__title">我的订单</h1>
        <p class="order-list-page__subtitle">
          当前共有 {{ orders.length }} 个订单
        </p>
      </section>

      <section v-if="orders.length" class="order-list">
        <article
          v-for="order in orders"
          :key="order.id"
          class="order-card"
        >
          <div class="order-card__top">
            <div class="order-card__group">
              <span class="order-card__label">订单编号</span>
              <strong>{{ order.id }}</strong>
            </div>
            <div class="order-card__group">
              <span class="order-card__label">创建时间</span>
              <strong>{{ formatTime(order.createdAt) }}</strong>
            </div>
          </div>

          <div class="order-card__summary">
            <div class="order-card__group">
              <span class="order-card__label">商品数量</span>
              <strong>{{ getItemCount(order) }} 件</strong>
            </div>
            <div class="order-card__group">
              <span class="order-card__label">订单金额</span>
              <strong class="order-card__price">¥{{ order.totalAmount.toFixed(2) }}</strong>
            </div>
            <div class="order-card__group">
              <span class="order-card__label">订单状态</span>
              <strong>{{ order.status }}</strong>
            </div>
            <div class="order-card__group">
              <span class="order-card__label">物流状态</span>
              <strong>{{ order.logisticsStatus }}</strong>
            </div>
          </div>

          <div class="order-card__items">
            <p
              v-for="item in order.items"
              :key="`${order.id}-${item.productId}`"
              class="order-card__item"
            >
              {{ item.name }} × {{ item.quantity }}
            </p>
          </div>

          <div class="order-card__actions">
            <BaseButton type="secondary" @click="goToOrderDetail(order.id)">
              查看详情
            </BaseButton>
          </div>
        </article>
      </section>

      <section v-else class="empty-state">
        <h2 class="empty-state__title">还没有订单</h2>
        <p class="empty-state__description">
          先去挑选商品并完成下单，这里就会显示你的订单记录。
        </p>
        <BaseButton type="primary" @click="goToProducts">
          去逛商品
        </BaseButton>
      </section>
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import AppHeader from '../shared/components/AppHeader.vue'
import BaseButton from '../shared/components/BaseButton.vue'
import { useOrder } from '../shared/composables/useOrder.js'

const router = useRouter()
const { orders } = useOrder()

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

function getItemCount(order) {
  return order.items.reduce((total, item) => total + item.quantity, 0)
}

function goToOrderDetail(orderId) {
  router.push(`/order/${orderId}`)
}

function goToProducts() {
  router.push('/products')
}
</script>

<style scoped>
.order-list-page {
  min-height: 100vh;
  background-color: var(--bg-page);
}

.order-list-page__content {
  width: min(100%, 1200px);
  margin: 0 auto;
  padding: var(--spacing-lg);
}

.order-list-page__header {
  margin-bottom: var(--spacing-lg);
}

.order-list-page__title {
  margin: 0 0 var(--spacing-sm);
  font-size: 32px;
}

.order-list-page__subtitle {
  margin: 0;
  color: var(--text-secondary);
}

.order-list {
  display: grid;
  gap: var(--spacing-lg);
}

.order-card,
.empty-state {
  background-color: var(--bg-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.order-card {
  display: grid;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
}

.order-card__top,
.order-card__summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: var(--spacing-md);
}

.order-card__group {
  display: grid;
  gap: var(--spacing-xs);
}

.order-card__label {
  color: var(--text-secondary);
  font-size: 14px;
}

.order-card__price {
  color: var(--color-primary);
}

.order-card__items {
  display: grid;
  gap: var(--spacing-xs);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  background-color: var(--bg-hover);
}

.order-card__item {
  margin: 0;
  color: var(--text-primary);
}

.order-card__actions {
  display: flex;
  justify-content: flex-end;
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

@media (max-width: 768px) {
  .order-list-page__content {
    padding: var(--spacing-md);
  }

  .order-card {
    padding: var(--spacing-md);
  }

  .order-card__actions {
    justify-content: stretch;
  }
}
</style>
