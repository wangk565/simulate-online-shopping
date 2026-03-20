<template>
  <div class="profile-page">
    <AppHeader />

    <main class="profile-page__content">
      <section v-if="isLoggedIn" class="profile-layout">
        <div class="profile-main">
          <div class="profile-top-actions">
            <BaseButton type="secondary" @click="goToHome">
              返回首页
            </BaseButton>
          </div>

          <section class="profile-card profile-card--hero">
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
            <div class="section-heading">
              <h2 class="profile-card__subtitle">管理收货地址</h2>
              <p class="section-heading__text">保存后，结算页会自动读取这里的信息</p>
            </div>

            <form class="address-form" @submit.prevent="handleSaveAddress">
              <label class="address-form__field">
                <span class="address-form__label">联系电话</span>
                <BaseInput v-model="phone" placeholder="请输入联系电话" />
              </label>

              <label class="address-form__field">
                <span class="address-form__label">收货地址</span>
                <textarea
                  v-model.trim="address"
                  class="address-form__textarea"
                  placeholder="请输入收货地址"
                  rows="4"
                />
              </label>

              <div class="address-form__actions">
                <BaseButton type="primary" native-type="submit">
                  保存收货信息
                </BaseButton>
              </div>
            </form>
          </section>

          <section class="profile-card">
            <div class="section-heading">
              <h2 class="profile-card__subtitle">订单统计</h2>
              <p class="section-heading__text">点击卡片可直接查看对应订单</p>
            </div>

            <div class="stats-grid">
              <button class="stats-card" type="button" @click="goToOrdersByStatus('待付款')">
                <span class="stats-card__label">待付款</span>
                <strong>{{ pendingPaymentCount }}</strong>
              </button>
              <button class="stats-card" type="button" @click="goToOrdersByStatus('待收货')">
                <span class="stats-card__label">待收货</span>
                <strong>{{ pendingReceiptCount }}</strong>
              </button>
              <button class="stats-card" type="button" @click="goToOrdersByStatus('已完成')">
                <span class="stats-card__label">已完成</span>
                <strong>{{ completedCount }}</strong>
              </button>
            </div>
          </section>
        </div>

        <aside class="profile-side">
          <section class="profile-card quick-card">
            <div class="section-heading">
              <h2 class="profile-card__subtitle">快捷入口</h2>
              <p class="section-heading__text">常用操作放在这里</p>
            </div>

            <div class="quick-grid">
              <button class="quick-action quick-action--primary" type="button" @click="goToOrders">
                <span class="quick-action__emoji">📦</span>
                <span class="quick-action__title">我的订单</span>
                <span class="quick-action__desc">查看全部订单记录</span>
              </button>

              <button class="quick-action quick-action--secondary" type="button" @click="handleLogout">
                <span class="quick-action__emoji">↩</span>
                <span class="quick-action__title">退出登录</span>
                <span class="quick-action__desc">返回登录页重新进入</span>
              </button>
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
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '../shared/components/AppHeader.vue'
import BaseButton from '../shared/components/BaseButton.vue'
import BaseInput from '../shared/components/BaseInput.vue'
import { useOrder } from '../shared/composables/useOrder.js'
import { useToast } from '../shared/composables/useToast.js'
import { useUser } from '../shared/composables/useUser.js'

const router = useRouter()
const { showError, showSuccess } = useToast()
const { currentUser, isLoggedIn, logout, updateProfile } = useUser()
const { orders } = useOrder()

const phone = ref('')
const address = ref('')

watch(
  currentUser,
  (nextUser) => {
    phone.value = nextUser?.phone || ''
    address.value = nextUser?.address || ''
  },
  { immediate: true },
)

const pendingPaymentCount = computed(() => {
  return orders.value.filter((order) => order.status === '待付款').length
})

const pendingReceiptCount = computed(() => {
  return orders.value.filter((order) => order.status === '待收货').length
})

const completedCount = computed(() => {
  return orders.value.filter((order) => order.status === '已完成').length
})

function handleSaveAddress() {
  if (!phone.value.trim() || !address.value.trim()) {
    showError('请完整填写联系电话和收货地址')
    return
  }

  const result = updateProfile({
    phone: phone.value.trim(),
    address: address.value.trim(),
  })

  if (result.success) {
    showSuccess(result.message)
    return
  }

  showError(result.message)
}

function goToOrders() {
  router.push('/orders')
}

function goToHome() {
  router.push('/')
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
  background:
    radial-gradient(circle at top right, rgba(74, 144, 217, 0.12), transparent 24%),
    var(--bg-page);
}

.profile-page__content {
  width: min(100%, 1200px);
  margin: 0 auto;
  padding: var(--spacing-lg);
}

.profile-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 340px;
  gap: var(--spacing-lg);
  align-items: start;
}

.profile-main,
.profile-side {
  display: grid;
  gap: var(--spacing-lg);
}

.profile-top-actions {
  display: flex;
  justify-content: flex-start;
}

.profile-card,
.empty-state {
  display: grid;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  background-color: var(--bg-card);
  border-radius: 24px;
  box-shadow: 0 20px 40px rgba(74, 144, 217, 0.08);
}

.profile-card--hero {
  background:
    linear-gradient(135deg, rgba(74, 144, 217, 0.08), rgba(103, 194, 58, 0.05)),
    var(--bg-card);
}

.profile-card__tag {
  margin: 0;
  color: var(--color-primary);
  font-weight: 700;
  letter-spacing: 0.08em;
}

.profile-card__title,
.profile-card__subtitle,
.empty-state__title {
  margin: 0;
}

.profile-card__title {
  font-size: 36px;
  line-height: 1.15;
}

.profile-card__subtitle {
  font-size: 24px;
}

.section-heading {
  display: grid;
  gap: 6px;
}

.section-heading__text {
  margin: 0;
  color: var(--text-secondary);
  font-size: 14px;
}

.profile-card__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: var(--spacing-md);
}

.profile-card__item {
  display: grid;
  gap: var(--spacing-xs);
  padding: var(--spacing-md);
  border: 1px solid rgba(74, 144, 217, 0.12);
  border-radius: 16px;
  background-color: rgba(255, 255, 255, 0.72);
}

.profile-card__item span {
  color: var(--text-secondary);
  font-size: 14px;
}

.profile-card__item strong {
  line-height: 1.6;
}

.profile-card__item--full {
  grid-column: 1 / -1;
}

.address-form {
  display: grid;
  gap: var(--spacing-md);
}

.address-form__field {
  display: grid;
  gap: var(--spacing-sm);
}

.address-form__label {
  font-weight: 600;
}

.address-form__textarea {
  width: 100%;
  min-height: 120px;
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  background-color: var(--bg-card);
  color: var(--text-primary);
  font-size: 16px;
  resize: vertical;
}

.address-form__actions {
  display: flex;
  justify-content: flex-start;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: var(--spacing-md);
}

.stats-card {
  display: grid;
  gap: var(--spacing-xs);
  min-height: 108px;
  padding: var(--spacing-md);
  border: 1px solid var(--border-default);
  border-radius: 18px;
  background:
    linear-gradient(180deg, rgba(74, 144, 217, 0.06), rgba(74, 144, 217, 0)),
    var(--bg-card);
  text-align: left;
  transition:
    border-color 0.2s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.stats-card:hover {
  border-color: var(--color-primary);
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
}

.stats-card__label {
  color: var(--text-secondary);
}

.stats-card strong {
  color: var(--color-primary);
  font-size: 30px;
  line-height: 1;
}

.quick-card {
  gap: var(--spacing-lg);
}

.quick-grid {
  display: grid;
  gap: var(--spacing-md);
}

.quick-action {
  display: grid;
  gap: 10px;
  justify-items: start;
  min-height: 124px;
  padding: 20px;
  border-radius: 20px;
  border: 1px solid transparent;
  text-align: left;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;
}

.quick-action:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
}

.quick-action--primary {
  background: linear-gradient(135deg, #4a90d9, #6ba8e8);
  color: #fff;
}

.quick-action--secondary {
  background: linear-gradient(180deg, #fff, #f7f9fc);
  border-color: var(--border-default);
  color: var(--text-primary);
}

.quick-action__emoji {
  font-size: 24px;
  line-height: 1;
}

.quick-action__title {
  font-size: 28px;
  font-weight: 800;
  line-height: 1.1;
}

.quick-action__desc {
  font-size: 14px;
  opacity: 0.9;
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

  .profile-card,
  .empty-state {
    padding: var(--spacing-md);
    border-radius: 20px;
  }

  .profile-card__title {
    font-size: 30px;
  }

  .quick-action {
    min-height: 104px;
  }

  .quick-action__title {
    font-size: 24px;
  }
}
</style>
