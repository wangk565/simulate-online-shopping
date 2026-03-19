<template>
  <div class="product-detail-page">
    <AppHeader />

    <main class="product-detail-page__content">
      <section v-if="product" class="detail-card">
        <div class="detail-card__image">
          {{ product.name }}
        </div>

        <div class="detail-card__info">
          <p class="detail-card__category">{{ categoryName }}</p>
          <h1 class="detail-card__title">{{ product.name }}</h1>
          <p class="detail-card__price">¥{{ product.price.toFixed(2) }}</p>
          <p class="detail-card__description">{{ product.description }}</p>

          <dl class="detail-card__meta">
            <div class="detail-card__meta-item">
              <dt>商品编号</dt>
              <dd>{{ product.id }}</dd>
            </div>
            <div class="detail-card__meta-item">
              <dt>库存数量</dt>
              <dd>{{ product.stock }}</dd>
            </div>
          </dl>

          <div class="detail-card__actions">
            <BaseButton type="secondary" @click="goBackToList">
              返回商品列表
            </BaseButton>
          </div>
        </div>
      </section>

      <section v-else class="empty-state">
        <h1 class="empty-state__title">未找到该商品</h1>
        <p class="empty-state__description">
          这个商品可能不存在，或者当前链接有误。
        </p>
        <BaseButton type="primary" @click="goBackToList">
          返回商品列表
        </BaseButton>
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import categories from '../data/categories.js'
import products from '../data/products.js'
import AppHeader from '../shared/components/AppHeader.vue'
import BaseButton from '../shared/components/BaseButton.vue'

const route = useRoute()
const router = useRouter()

const product = computed(() => {
  return products.find((item) => item.id === route.params.id) || null
})

const categoryName = computed(() => {
  if (!product.value) {
    return '商品详情'
  }

  const category = categories.find((item) => item.id === product.value.categoryId)
  return category?.name || '未分类商品'
})

function goBackToList() {
  router.push('/products')
}
</script>

<style scoped>
.product-detail-page {
  min-height: 100vh;
  background-color: var(--bg-page);
}

.product-detail-page__content {
  width: min(100%, 1200px);
  margin: 0 auto;
  padding: var(--spacing-lg);
}

.detail-card {
  display: grid;
  grid-template-columns: minmax(280px, 420px) minmax(0, 1fr);
  gap: var(--spacing-xl);
  padding: var(--spacing-xl);
  background-color: var(--bg-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}

.detail-card__image {
  display: grid;
  place-items: center;
  min-height: 360px;
  padding: var(--spacing-lg);
  border-radius: var(--radius-md);
  background-color: var(--bg-hover);
  color: var(--text-secondary);
  text-align: center;
  font-size: 24px;
  font-weight: 700;
}

.detail-card__info {
  display: grid;
  gap: var(--spacing-md);
  align-content: start;
}

.detail-card__category {
  margin: 0;
  color: var(--color-primary);
  font-weight: 700;
}

.detail-card__title {
  margin: 0;
  font-size: 32px;
  line-height: 1.25;
}

.detail-card__price {
  margin: 0;
  color: var(--color-primary);
  font-size: 32px;
  font-weight: 700;
}

.detail-card__description {
  margin: 0;
  color: var(--text-secondary);
  font-size: 16px;
  line-height: 1.8;
}

.detail-card__meta {
  display: grid;
  gap: var(--spacing-md);
  margin: 0;
  padding: var(--spacing-lg);
  border-radius: var(--radius-md);
  background-color: var(--bg-hover);
}

.detail-card__meta-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
}

.detail-card__meta-item dt {
  color: var(--text-secondary);
  font-weight: 600;
}

.detail-card__meta-item dd {
  margin: 0;
  color: var(--text-primary);
  font-weight: 700;
}

.detail-card__actions {
  display: flex;
  gap: var(--spacing-md);
}

.empty-state {
  display: grid;
  gap: var(--spacing-md);
  justify-items: start;
  padding: var(--spacing-xl);
  background-color: var(--bg-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
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
  .product-detail-page__content {
    padding: var(--spacing-md);
  }

  .detail-card {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
    padding: var(--spacing-lg);
  }

  .detail-card__image {
    min-height: 240px;
  }

  .detail-card__title,
  .detail-card__price {
    font-size: 28px;
  }

  .detail-card__meta-item {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
