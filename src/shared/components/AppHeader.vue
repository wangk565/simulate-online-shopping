<template>
  <header class="app-header">
    <RouterLink class="app-header__brand" to="/">
      小学生购物站
    </RouterLink>

    <div class="app-header__search">
      <input
        class="app-header__search-input"
        type="text"
        placeholder="搜索商品"
      />
    </div>

    <nav class="app-header__actions">
      <RouterLink class="app-header__cart" to="/cart">
        购物车
      </RouterLink>

      <RouterLink
        v-if="!isLoggedIn"
        class="app-header__user-link"
        to="/login"
      >
        登录
      </RouterLink>

      <div v-else class="app-header__user">
        <RouterLink class="app-header__user-link" to="/profile">
          {{ currentUser?.username }}
        </RouterLink>

        <BaseButton type="secondary" @click="handleLogout">
          退出
        </BaseButton>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { RouterLink, useRouter } from 'vue-router'
import BaseButton from './BaseButton.vue'
import { useUser } from '../composables/useUser.js'

const router = useRouter()
const { currentUser, isLoggedIn, logout } = useUser()

function handleLogout() {
  logout()
  router.push('/login')
}
</script>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
  min-height: 70px;
  padding: var(--spacing-md) var(--spacing-lg);
  background-color: var(--bg-card);
  border-bottom: 1px solid var(--border-default);
}

.app-header__brand {
  color: var(--color-primary);
  font-size: 24px;
  font-weight: 700;
  white-space: nowrap;
}

.app-header__search {
  flex: 1;
  display: flex;
  justify-content: center;
}

.app-header__search-input {
  width: min(100%, 300px);
  min-height: 44px;
  padding: 0 var(--spacing-md);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  background-color: var(--bg-card);
  color: var(--text-primary);
  font-size: 16px;
}

.app-header__search-input:focus {
  border-color: var(--border-focus);
  outline: none;
}

.app-header__actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.app-header__cart,
.app-header__user-link {
  font-weight: 600;
}

.app-header__cart:hover,
.app-header__user-link:hover {
  color: var(--color-primary);
}

.app-header__user {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}
</style>
