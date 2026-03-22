<template>
  <div class="payment-success-page">
    <AppHeader />

    <main class="payment-success-page__content">
      <section class="success-card">
        <p class="success-card__tag">支付结果</p>
        <h1 class="success-card__title">支付成功</h1>
        <p class="success-card__description">
          订单已经创建成功，你可以继续购物，也可以去查看订单详情。
        </p>

        <div v-if="order" class="success-card__detail">
          <div class="success-card__row">
            <span>订单编号</span>
            <strong>{{ order.id }}</strong>
          </div>
          <div class="success-card__row">
            <span>订单金额</span>
            <strong>¥{{ order.totalAmount.toFixed(2) }}</strong>
          </div>
          <div class="success-card__row">
            <span>订单状态</span>
            <strong>{{ order.status }}</strong>
          </div>
          <div class="success-card__row">
            <span>物流状态</span>
            <strong>{{ order.logisticsStatus }}</strong>
          </div>
        </div>

        <p v-else class="success-card__fallback">
          未找到对应订单信息，但支付成功页入口已经打通。
        </p>

        <div class="success-card__actions">
          <BaseButton type="secondary" @click="goToOrders">
            查看我的订单
          </BaseButton>
          <BaseButton type="primary" @click="goToProducts">
            继续购物
          </BaseButton>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppHeader from '../shared/components/AppHeader.vue'
import BaseButton from '../shared/components/BaseButton.vue'
import { useOrder } from '../shared/composables/useOrder.js'
import { useLogistics } from '../modules/logistics/composables/useLogistics.js'

const route = useRoute()
const router = useRouter()
const { getOrderById, updateLogisticsStatus, updateOrderStatus } = useOrder()
const { generateLogistics } = useLogistics()

const orderId = computed(() => {
  return typeof route.query.orderId === 'string' ? route.query.orderId : ''
})

const order = computed(() => {
  if (!orderId.value) {
    return null
  }

  return getOrderById(orderId.value)
})

watch(
  order,
  (nextOrder) => {
    if (!nextOrder) {
      return
    }

    if (nextOrder.status === '待付款') {
      updateOrderStatus(nextOrder.id, '待收货')
      updateLogisticsStatus(nextOrder.id, '派送中')
    }

    generateLogistics(nextOrder)
  },
  { immediate: true },
)

function goToOrders() {
  router.push('/orders')
}

function goToProducts() {
  router.push('/products')
}
</script>

<style scoped>
.payment-success-page {
  min-height: 100vh;
  background-color: var(--bg-page);
}

.payment-success-page__content {
  width: min(100%, 880px);
  margin: 0 auto;
  padding: var(--spacing-xl) var(--spacing-lg);
}

.success-card {
  display: grid;
  gap: var(--spacing-md);
  padding: var(--spacing-xl);
  background-color: var(--bg-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}

.success-card__tag {
  margin: 0;
  color: var(--color-primary);
  font-weight: 700;
}

.success-card__title {
  margin: 0;
  font-size: 36px;
  line-height: 1.2;
}

.success-card__description,
.success-card__fallback {
  margin: 0;
  color: var(--text-secondary);
  line-height: 1.8;
}

.success-card__detail {
  display: grid;
  gap: var(--spacing-sm);
  padding: var(--spacing-lg);
  border-radius: var(--radius-md);
  background-color: var(--bg-hover);
}

.success-card__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
}

.success-card__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  margin-top: var(--spacing-sm);
}

@media (max-width: 768px) {
  .payment-success-page__content {
    padding: var(--spacing-lg) var(--spacing-md);
  }

  .success-card {
    padding: var(--spacing-lg);
  }

  .success-card__title {
    font-size: 30px;
  }

  .success-card__row {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
