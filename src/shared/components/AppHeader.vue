<template>
  <header class="app-header">
    <RouterLink class="app-header__brand" to="/">
      小学生购物站
    </RouterLink>

    <form class="app-header__search" @submit.prevent="handleSearch">
      <input
        v-model.trim="keyword"
        class="app-header__search-input"
        type="text"
        placeholder="搜索商品"
      />
    </form>

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
import { ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import BaseButton from './BaseButton.vue'
import { useUser } from '../composables/useUser.js'

const route = useRoute()
const router = useRouter()
const keyword = ref('')
const { currentUser, isLoggedIn, logout } = useUser()

watch(
  () => [route.path, route.query.keyword],
  ([path, queryKeyword]) => {
    if (path === '/products' && typeof queryKeyword === 'string') {
      keyword.value = queryKeyword
      return
    }

    if (path !== '/products') {
      keyword.value = ''
    }
  },
  {
    immediate: true,
  },
)

function handleSearch() {
  const trimmedKeyword = keyword.value.trim()

  if (!trimmedKeyword) {
    router.push('/products')
    return
  }

  router.push({
    path: '/products',
    query: {
      keyword: trimmedKeyword,
    },
  })
}

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
  width: min(100%, 420px);
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

@media (max-width: 768px) {
  .app-header {
    align-items: stretch;
    flex-direction: column;
  }

  .app-header__search {
    width: 100%;
  }

  .app-header__search-input {
    width: 100%;
  }

  .app-header__actions {
    justify-content: center;
    flex-wrap: wrap;
  }
}
</style>
