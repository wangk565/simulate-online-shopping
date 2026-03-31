<template>
  <div class="home-page">
    <AppHeader />

    <main class="home-page__content">
      <section class="home-section">
        <div class="home-section__header">
          <h1 class="home-section__title">商品分类</h1>
          <p class="home-section__subtitle">先看看你想买哪一类学习用品。</p>
        </div>

        <div class="category-list">
          <button
            v-for="category in categories"
            :key="category.id"
            class="category-list__item"
            type="button"
            @click="goToCategory(category.id)"
          >
            {{ category.name }}
          </button>
        </div>
      </section>

      <section class="home-section">
        <div class="home-section__header">
          <h2 class="home-section__title">推荐商品</h2>
          <p class="home-section__subtitle">这里先展示 8 个推荐商品，方便快速浏览。</p>
        </div>

        <div class="product-grid">
          <article
            v-for="product in featuredProducts"
            :key="product.id"
            class="product-card"
            @click="goToProduct(product.id)"
          >
            <div class="product-card__image">
              <img
                :src="product.images[0]"
                :alt="product.name"
                class="product-image"
                @error="handleImageError($event)"
              />
            </div>

            <div class="product-card__body">
              <h3 class="product-card__title">{{ product.name }}</h3>
              <p class="product-card__description">{{ product.description }}</p>
              <div class="product-card__footer">
                <span class="product-card__price">¥{{ product.price.toFixed(2) }}</span>
                <span class="product-card__stock">库存 {{ product.stock }}</span>
              </div>
            </div>
          </article>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import categories from '../data/categories.js'
import products from '../data/products.js'
import AppHeader from '../shared/components/AppHeader.vue'

const router = useRouter()

const featuredProducts = computed(() => products.slice(0, 8))

function goToCategory(categoryId) {
  router.push(`/products?category=${categoryId}`)
}

function goToProduct(productId) {
  router.push(`/product/${productId}`)
}

function handleImageError(event) {
  // 图片加载失败时使用占位图
  event.target.src = `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=school%20supplies%20placeholder&image_size=square`
}
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background-color: var(--bg-page);
}

.home-page__content {
  width: min(100%, 1200px);
  margin: 0 auto;
  padding: var(--spacing-lg);
}

.home-section {
  margin-bottom: var(--spacing-xl);
}

.home-section__header {
  margin-bottom: var(--spacing-lg);
}

.home-section__title {
  margin: 0 0 var(--spacing-sm);
  font-size: 28px;
  line-height: 1.3;
}

.home-section__subtitle {
  margin: 0;
  color: var(--text-secondary);
}

.category-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
}

.category-list__item {
  min-width: 120px;
  min-height: 44px;
  padding: 0 var(--spacing-lg);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-round);
  background-color: var(--bg-card);
  color: var(--text-primary);
  font-size: 16px;
  font-weight: 600;
  transition:
    background-color 0.2s ease,
    transform 0.2s ease,
    border-color 0.2s ease;
}

.category-list__item:hover {
  border-color: var(--color-primary);
  background-color: var(--bg-hover);
}

.category-list__item:active {
  transform: scale(0.98);
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: var(--spacing-lg);
}

.product-card {
  background-color: var(--surface-container-lowest);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  position: relative;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.product-card__image {
  height: 200px;
  background-color: var(--surface-container-low);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
}

.product-card__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.2s ease;
}

.product-card:hover .product-card__image img {
  transform: scale(1.05);
}

.product-card__body {
  display: grid;
  gap: var(--spacing-sm);
  padding: var(--spacing-lg);
  background-color: var(--surface-container-lowest);
}

.product-card__title {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  font-family: 'Plus Jakarta Sans', sans-serif;
  letter-spacing: -0.01em;
  color: var(--text-primary);
}

.product-card__price {
  font-size: 20px;
  font-weight: 800;
  color: var(--color-primary);
  font-family: 'Plus Jakarta Sans', sans-serif;
  letter-spacing: -0.02em;
}

.product-card__stock {
  font-size: 14px;
  color: var(--text-tertiary);
}

.product-card__description {
  margin: 0;
  color: var(--text-secondary);
  font-size: 14px;
}

.product-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-sm);
}

.product-card__price {
  color: var(--color-primary);
  font-size: 18px;
  font-weight: 700;
}

.product-card__stock {
  color: var(--text-tertiary);
  font-size: 14px;
}
</style>
