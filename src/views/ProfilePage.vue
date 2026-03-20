<template>
  <div class="profile-page">
    <AppHeader />

    <main class="profile-page__content">
      <section v-if="isLoggedIn" class="profile-layout">
        <div class="profile-main">
          <section class="profile-card">
            <p class="profile-card__tag">个人中心</p>
            <h1 class="profile-card__title">{{ currentUser?.username }}</h1>
            <div class="profile-card__grid">
              <div class="profile-card__item">
                <span>用户名</span>
                <strong>{{ currentUser?.username }}</strong>
              </div>
              <div class="profile-card__item">
                <span>联系电话</span>
                <strong>{{ currentUser?.phone || '暂未填写' }}</strong>
              </div>
              <div class="profile-card__item profile-card__item--full">
                <span>收货地址</span>
                <strong>{{ currentUser?.address || '暂未填写' }}</strong>
              </div>
            </div>
          </section>

          <section class="profile-card">
            <h2 class="profile-card__subtitle">订单统计</h2>
            <div class="stats-grid">
              <button class="stats-card" type="button" @click="goToOrdersByStatus('待付款')">
                <span>待付款</span>
                <strong>{{ pendingPaymentCount }}</strong>
              </button>
              <button class="stats-card" type="button" @click="goToOrdersByStatus('待收货')">
                <span>待收货</span>
                <strong>{{ pendingReceiptCount }}</strong>
              </button>
              <button class="stats-card" type="button" @click="goToOrdersByStatus('已完成')">
                <span>已完成</span>
                <strong>{{ completedCount }}</strong>
              </button>
            </div>
          </section>
        </div>

        <aside class="profile-side">
          <section class="profile-card">
            <h2 class="profile-card__subtitle">快捷入口</h2>
            <div class="profile-actions">
              <BaseButton type="primary" @click="goToOrders">
                我的订单
              </BaseButton>
              <BaseButton type="secondary" @click="handleLogout">
                退出登录
              </BaseButton>
            </div>
          </section>
        </aside>
      </section>

      <section v-else class="empty-state">
        <h1 class="empty-state__title">你还没有登录</h1>
        <p class="empty-state__description">
          登录后可以查看订单、统计信息和个人资料。
        </p>
        <BaseButton type="primary" @click="goToLogin">
          去登录
        </BaseButton>
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '../shared/components/AppHeader.vue'
import BaseButton from '../shared/components/BaseButton.vue'
import { useOrder } from '../shared/composables/useOrder.js'
import { useUser } from '../shared/composables/useUser.js'

const router = useRouter()
const { currentUser, isLoggedIn, logout } = useUser()
const { orders } = useOrder()

const pendingPaymentCount = computed(() => {
  return orders.value.filter((order) => order.status === '待付款').length
})

const pendingReceiptCount = computed(() => {
  return orders.value.filter((order) => order.status === '待收货').length
})

const completedCount = computed(() => {
  return orders.value.filter((order) => order.status === '已完成').length
})

function goToOrders() {
  router.push('/orders')
}

function goToOrdersByStatus(status) {
  router.push(`/orders?status=${encodeURIComponent(status)}`)
}

function goToLogin() {
  router.push('/login')
}

function handleLogout() {
  logout()
  router.push('/login')
}
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background-color: var(--bg-page);
}

.profile-page__content {
  width: min(100%, 1200px);
  margin: 0 auto;
  padding: var(--spacing-lg);
}

.profile-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: var(--spacing-lg);
}

.profile-main,
.profile-side {
  display: grid;
  gap: var(--spacing-lg);
}

.profile-card,
.empty-state {
  display: grid;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  background-color: var(--bg-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.profile-card__tag {
  margin: 0;
  color: var(--color-primary);
  font-weight: 700;
}

.profile-card__title,
.profile-card__subtitle,
.empty-state__title {
  margin: 0;
}

.profile-card__title {
  font-size: 34px;
}

.profile-card__subtitle {
  font-size: 24px;
}

.profile-card__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: var(--spacing-md);
}

.profile-card__item {
  display: grid;
  gap: var(--spacing-xs);
}

.profile-card__item span {
  color: var(--text-secondary);
  font-size: 14px;
}

.profile-card__item--full {
  grid-column: 1 / -1;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: var(--spacing-md);
}

.stats-card {
  display: grid;
  gap: var(--spacing-xs);
  min-height: 88px;
  padding: var(--spacing-md);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  background-color: var(--bg-hover);
  text-align: left;
  transition:
    border-color 0.2s ease,
    transform 0.2s ease;
}

.stats-card:hover {
  border-color: var(--color-primary);
  transform: translateY(-2px);
}

.stats-card strong {
  color: var(--color-primary);
  font-size: 28px;
}

.profile-actions {
  display: grid;
  gap: var(--spacing-sm);
}

.empty-state {
  justify-items: start;
}

.empty-state__description {
  margin: 0;
  color: var(--text-secondary);
  line-height: 1.7;
}

@media (max-width: 900px) {
  .profile-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .profile-page__content {
    padding: var(--spacing-md);
  }
}
</style>
