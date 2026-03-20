<template>
  <div class="checkout-page">
    <AppHeader />

    <main class="checkout-page__content">
      <section class="checkout-page__header">
        <h1 class="checkout-page__title">订单确认</h1>
        <p class="checkout-page__subtitle">请核对收货信息和商品清单</p>
      </section>

      <section v-if="cartItems.length" class="checkout-layout">
        <div class="checkout-main">
          <section class="info-card">
            <h2 class="info-card__title">收货信息</h2>
            <div class="info-card__row">
              <span>收货人</span>
              <strong>{{ currentUser?.username || '未登录' }}</strong>
            </div>
            <div class="info-card__row">
              <span>联系电话</span>
              <strong>{{ currentUser?.phone || '暂未填写' }}</strong>
            </div>
            <div class="info-card__row">
              <span>收货地址</span>
              <strong>{{ currentUser?.address || '暂未填写' }}</strong>
            </div>
          </section>

          <section class="info-card">
            <h2 class="info-card__title">商品清单</h2>

            <article
              v-for="item in cartItems"
              :key="item.productId"
              class="checkout-item"
            >
              <div class="checkout-item__image">{{ item.name }}</div>

              <div class="checkout-item__body">
                <h3 class="checkout-item__title">{{ item.name }}</h3>
                <p class="checkout-item__meta">单价 ¥{{ item.price.toFixed(2) }}</p>
                <p class="checkout-item__meta">数量 {{ item.quantity }}</p>
              </div>

              <strong class="checkout-item__subtotal">
                ¥{{ (item.price * item.quantity).toFixed(2) }}
              </strong>
            </article>
          </section>
        </div>

        <aside class="summary-card">
          <h2 class="summary-card__title">费用汇总</h2>
          <div class="summary-card__row">
            <span>商品数量</span>
            <strong>{{ cartCount }} 件</strong>
          </div>
          <div class="summary-card__row">
            <span>商品总价</span>
            <strong>¥{{ cartTotal.toFixed(2) }}</strong>
          </div>
          <div class="summary-card__row">
            <span>运费</span>
            <strong>¥0.00</strong>
          </div>
          <div class="summary-card__total">
            <span>应付金额</span>
            <strong>¥{{ cartTotal.toFixed(2) }}</strong>
          </div>

          <p
            v-if="feedbackMessage"
            class="summary-card__message"
            :class="{ 'summary-card__message--error': !isSuccessMessage }"
          >
            {{ feedbackMessage }}
          </p>

          <div class="summary-card__actions">
            <BaseButton type="secondary" @click="goBackToCart">
              返回购物车
            </BaseButton>
            <BaseButton type="primary" @click="handleSubmitOrder">
              提交订单
            </BaseButton>
          </div>
        </aside>
      </section>

      <section v-else class="empty-state">
        <h2 class="empty-state__title">还没有可结算的商品</h2>
        <p class="empty-state__description">
          先把商品加入购物车，再回来确认订单。
        </p>
        <div class="empty-state__actions">
          <BaseButton type="secondary" @click="goBackToCart">
            返回购物车
          </BaseButton>
          <BaseButton type="primary" @click="goToProducts">
            去逛商品
          </BaseButton>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '../shared/components/AppHeader.vue'
import BaseButton from '../shared/components/BaseButton.vue'
import { useCart } from '../shared/composables/useCart.js'
import { useOrder } from '../shared/composables/useOrder.js'
import { useUser } from '../shared/composables/useUser.js'

const router = useRouter()
const feedbackMessage = ref('')
const isSuccessMessage = ref(false)

const { cartItems, cartCount, cartTotal, clearCart } = useCart()
const { currentUser } = useUser()
const { createOrder } = useOrder()

function goBackToCart() {
  router.push('/cart')
}

function goToProducts() {
  router.push('/products')
}

function handleSubmitOrder() {
  const result = createOrder({
    items: cartItems.value.map((item) => ({
      productId: item.productId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    })),
    totalAmount: cartTotal.value,
    receiverName: currentUser.value?.username || '',
    phone: currentUser.value?.phone || '',
    address: currentUser.value?.address || '',
  })

  if (!result.success || !result.order) {
    feedbackMessage.value = '提交订单失败，请稍后再试'
    isSuccessMessage.value = false
    return
  }

  clearCart()
  feedbackMessage.value = '订单提交成功，正在进入支付结果页'
  isSuccessMessage.value = true
  router.push(`/payment/success?orderId=${result.order.id}`)
}
</script>

<style scoped>
.checkout-page {
  min-height: 100vh;
  background-color: var(--bg-page);
}

.checkout-page__content {
  width: min(100%, 1200px);
  margin: 0 auto;
  padding: var(--spacing-lg);
}

.checkout-page__header {
  margin-bottom: var(--spacing-lg);
}

.checkout-page__title {
  margin: 0 0 var(--spacing-sm);
  font-size: 32px;
}

.checkout-page__subtitle {
  margin: 0;
  color: var(--text-secondary);
}

.checkout-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: var(--spacing-lg);
}

.checkout-main {
  display: grid;
  gap: var(--spacing-lg);
}

.info-card,
.summary-card,
.empty-state {
  background-color: var(--bg-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.info-card {
  display: grid;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
}

.info-card__title {
  margin: 0;
  font-size: 24px;
}

.info-card__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
  padding-bottom: var(--spacing-sm);
  border-bottom: 1px solid var(--border-default);
}

.checkout-item {
  display: grid;
  grid-template-columns: 120px minmax(0, 1fr) auto;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md) 0;
  border-top: 1px solid var(--border-default);
}

.checkout-item__image {
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

.checkout-item__body {
  display: grid;
  gap: var(--spacing-xs);
}

.checkout-item__title,
.checkout-item__meta {
  margin: 0;
}

.checkout-item__meta {
  color: var(--text-secondary);
}

.checkout-item__subtotal {
  color: var(--color-primary);
  font-size: 20px;
}

.summary-card {
  display: grid;
  gap: var(--spacing-md);
  align-content: start;
  padding: var(--spacing-lg);
}

.summary-card__title {
  margin: 0;
  font-size: 24px;
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

.summary-card__actions,
.empty-state__actions {
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
  .checkout-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .checkout-page__content {
    padding: var(--spacing-md);
  }

  .info-card__row,
  .checkout-item {
    grid-template-columns: 1fr;
    align-items: start;
  }
}
</style>
