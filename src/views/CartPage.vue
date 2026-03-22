<template>
  <div class="cart-page">
    <AppHeader />

    <main class="cart-page__content">
      <section class="cart-page__header">
        <h1 class="cart-page__title">购物车</h1>
        <p class="cart-page__subtitle">已加入商品 {{ cartCount }} 件</p>
        <div class="cart-page__header-actions">
          <BaseButton type="secondary" @click="goToHome">
            返回首页
          </BaseButton>
        </div>
      </section>

      <section v-if="cartItems.length" class="cart-layout">
        <div class="cart-list">
          <article
            v-for="item in cartItems"
            :key="item.productId"
            class="cart-item"
          >
            <div class="cart-item__image">{{ item.name }}</div>

            <div class="cart-item__body">
              <div class="cart-item__main">
                <h2 class="cart-item__title">{{ item.name }}</h2>
                <p class="cart-item__price">¥{{ item.price.toFixed(2) }}</p>
                <p class="cart-item__stock">库存 {{ item.stock }}</p>
              </div>

              <div class="cart-item__actions">
                <label class="cart-item__label" :for="`quantity-${item.productId}`">数量</label>
                <input
                  :id="`quantity-${item.productId}`"
                  class="cart-item__input"
                  type="number"
                  min="1"
                  :max="item.stock"
                  :value="item.quantity"
                  @change="handleQuantityChange(item.productId, $event)"
                />
                <BaseButton type="danger" @click="handleRemove(item.productId)">
                  删除
                </BaseButton>
              </div>
            </div>
          </article>
        </div>

        <aside class="cart-summary">
          <h2 class="cart-summary__title">订单摘要</h2>
          <div class="cart-summary__row">
            <span>商品总数</span>
            <strong>{{ cartCount }} 件</strong>
          </div>
          <div class="cart-summary__row">
            <span>商品总价</span>
            <strong>¥{{ cartTotal.toFixed(2) }}</strong>
          </div>

          <div class="cart-summary__actions">
            <BaseButton type="secondary" @click="handleClearCart">
              清空购物车
            </BaseButton>
            <BaseButton type="primary" @click="goToCheckout">
              去结算
            </BaseButton>
          </div>
        </aside>
      </section>

      <Empty
        v-else
        title="购物车还是空的"
        description="先去商品列表挑选几件商品吧。"
      >
        <BaseButton type="primary" @click="goToProducts">
          去逛商品
        </BaseButton>
      </Empty>
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import AppHeader from '../shared/components/AppHeader.vue'
import BaseButton from '../shared/components/BaseButton.vue'
import Empty from '../shared/components/Empty.vue'
import { useCart } from '../shared/composables/useCart.js'
import { useToast } from '../shared/composables/useToast.js'

const router = useRouter()
const { showError, showSuccess } = useToast()

const {
  cartItems,
  cartCount,
  cartTotal,
  updateQuantity,
  removeFromCart,
  clearCart,
} = useCart()

function handleQuantityChange(productId, event) {
  const result = updateQuantity(productId, event.target.value)
  result.success ? showSuccess(result.message) : showError(result.message)
}

function handleRemove(productId) {
  const result = removeFromCart(productId)
  result.success ? showSuccess(result.message) : showError(result.message)
}

function handleClearCart() {
  const result = clearCart()
  result.success ? showSuccess(result.message) : showError(result.message)
}

function goToCheckout() {
  router.push('/checkout')
}

function goToProducts() {
  router.push('/products')
}

function goToHome() {
  router.push('/')
}
</script>

<style scoped>
.cart-page { min-height: 100vh; background-color: var(--bg-page); }
.cart-page__content { width: min(100%, 1200px); margin: 0 auto; padding: var(--spacing-lg); }
.cart-page__header { margin-bottom: var(--spacing-lg); }
.cart-page__title { margin: 0 0 var(--spacing-sm); font-size: 32px; }
.cart-page__subtitle { margin: 0; color: var(--text-secondary); }
.cart-page__header-actions { margin-top: var(--spacing-md); }
.cart-layout { display: grid; grid-template-columns: minmax(0, 1fr) 320px; gap: var(--spacing-lg); }
.cart-list { display: grid; gap: var(--spacing-md); }
.cart-item { display: grid; grid-template-columns: 180px minmax(0, 1fr); gap: var(--spacing-lg); padding: var(--spacing-lg); background-color: var(--bg-card); border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); }
.cart-item__image { display: grid; place-items: center; min-height: 180px; padding: var(--spacing-md); border-radius: var(--radius-md); background-color: var(--bg-hover); color: var(--text-secondary); text-align: center; font-weight: 700; }
.cart-item__body { display: grid; gap: var(--spacing-md); }
.cart-item__main { display: grid; gap: var(--spacing-sm); }
.cart-item__title { margin: 0; font-size: 24px; }
.cart-item__price { margin: 0; color: var(--color-primary); font-size: 24px; font-weight: 700; }
.cart-item__stock { margin: 0; color: var(--text-secondary); }
.cart-item__actions { display: flex; align-items: end; gap: var(--spacing-md); flex-wrap: wrap; }
.cart-item__label { display: grid; gap: var(--spacing-xs); font-weight: 600; }
.cart-item__input { width: 110px; min-height: 44px; padding: 0 var(--spacing-md); border: 1px solid var(--border-default); border-radius: var(--radius-md); background-color: var(--bg-card); color: var(--text-primary); font-size: 16px; }
.cart-summary { display: grid; gap: var(--spacing-md); align-content: start; padding: var(--spacing-lg); background-color: var(--bg-card); border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); }
.cart-summary__title { margin: 0; font-size: 24px; }
.cart-summary__row { display: flex; align-items: center; justify-content: space-between; gap: var(--spacing-md); }
.cart-summary__actions { display: grid; gap: var(--spacing-sm); }
@media (max-width: 900px) { .cart-layout { grid-template-columns: 1fr; } }
@media (max-width: 768px) { .cart-page__content { padding: var(--spacing-md); } .cart-item { grid-template-columns: 1fr; } .cart-item__image { min-height: 220px; } }
</style>
