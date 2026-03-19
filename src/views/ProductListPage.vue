<template>
  <div class="product-list-page">
    <AppHeader />

    <main class="product-list-page__content">
      <section class="list-section">
        <div class="list-section__header">
          <h1 class="list-section__title">商品列表</h1>
          <p class="list-section__subtitle">
            当前分类：
            <span class="list-section__highlight">{{ currentCategoryName }}</span>
          </p>
        </div>

        <div class="toolbar">
          <div class="toolbar__block">
            <span class="toolbar__label">分类筛选</span>
            <div class="category-list">
              <button
                v-for="category in allCategories"
                :key="category.id"
                class="category-list__item"
                :class="{ 'category-list__item--active': category.id === selectedCategoryId }"
                type="button"
                @click="handleCategoryClick(category.id)"
              >
                {{ category.name }}
              </button>
            </div>
          </div>

          <div class="toolbar__row">
            <div class="toolbar__control">
              <label class="toolbar__label" for="search-input">搜索框</label>
              <input
                id="search-input"
                v-model.trim="searchKeyword"
                class="toolbar__input"
                type="text"
                placeholder="搜索商品"
              />
            </div>

            <div class="toolbar__control">
              <label class="toolbar__label" for="sort-select">排序区域</label>
              <select
                id="sort-select"
                v-model="sortType"
                class="toolbar__select"
              >
                <option value="default">默认排序</option>
                <option value="price-asc">价格从低到高</option>
                <option value="price-desc">价格从高到低</option>
              </select>
            </div>
          </div>
        </div>

        <div class="product-grid">
          <article
            v-for="product in sortedProducts"
            :key="product.id"
            class="product-card"
            tabindex="0"
            role="button"
            @click="goToProductDetail(product.id)"
            @keydown.enter="goToProductDetail(product.id)"
            @keydown.space.prevent="goToProductDetail(product.id)"
          >
            <div class="product-card__image">
              {{ product.name }}
            </div>

            <div class="product-card__body">
              <h2 class="product-card__title">{{ product.name }}</h2>
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
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import categories from '../data/categories.js'
import products from '../data/products.js'
import AppHeader from '../shared/components/AppHeader.vue'

const route = useRoute()
const router = useRouter()
const searchKeyword = ref('')
const sortType = ref('default')

const allCategories = computed(() => {
  return [
    {
      id: '',
      name: '全部商品',
    },
    ...categories,
  ]
})

const selectedCategoryId = computed(() => {
  return typeof route.query.category === 'string' ? route.query.category : ''
})

const currentCategoryName = computed(() => {
  const currentCategory = categories.find((category) => category.id === selectedCategoryId.value)

  return currentCategory?.name || '全部商品'
})

const filteredProducts = computed(() => {
  let result = products

  if (selectedCategoryId.value) {
    result = result.filter((product) => product.categoryId === selectedCategoryId.value)
  }

  if (!searchKeyword.value) {
    return result
  }

  const keyword = searchKeyword.value.toLowerCase()

  return result.filter((product) => {
    return (
      product.name.toLowerCase().includes(keyword) ||
      product.description.toLowerCase().includes(keyword)
    )
  })
})

const sortedProducts = computed(() => {
  const result = [...filteredProducts.value]

  if (sortType.value === 'price-asc') {
    return result.sort((firstProduct, secondProduct) => firstProduct.price - secondProduct.price)
  }

  if (sortType.value === 'price-desc') {
    return result.sort((firstProduct, secondProduct) => secondProduct.price - firstProduct.price)
  }

  return result
})

function handleCategoryClick(categoryId) {
  if (!categoryId) {
    router.push('/products')
    return
  }

  router.push(`/products?category=${categoryId}`)
}

function goToProductDetail(productId) {
  router.push(`/product/${productId}`)
}
</script>

<style scoped>
.product-list-page {
  min-height: 100vh;
  background-color: var(--bg-page);
}

.product-list-page__content {
  width: min(100%, 1200px);
  margin: 0 auto;
  padding: var(--spacing-lg);
}

.list-section__header {
  margin-bottom: var(--spacing-lg);
}

.list-section__title {
  margin: 0 0 var(--spacing-sm);
  font-size: 28px;
  line-height: 1.3;
}

.list-section__subtitle {
  margin: 0;
  color: var(--text-secondary);
}

.list-section__highlight {
  color: var(--color-primary);
  font-weight: 700;
}

.toolbar {
  margin-bottom: var(--spacing-lg);
  padding: var(--spacing-lg);
  background-color: var(--bg-card);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}

.toolbar__block {
  margin-bottom: var(--spacing-md);
}

.toolbar__row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: var(--spacing-md);
}

.toolbar__control {
  display: grid;
  gap: var(--spacing-sm);
}

.toolbar__label {
  font-weight: 600;
}

.toolbar__input,
.toolbar__select {
  width: 100%;
  min-height: 44px;
  padding: 0 var(--spacing-md);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  background-color: var(--bg-card);
  color: var(--text-primary);
  font-size: 16px;
}

.category-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  margin-top: var(--spacing-sm);
}

.category-list__item {
  min-width: 96px;
  min-height: 44px;
  padding: 0 var(--spacing-md);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-round);
  background-color: var(--bg-card);
  color: var(--text-primary);
  font-size: 16px;
  font-weight: 600;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease;
}

.category-list__item:hover {
  border-color: var(--color-primary);
  background-color: var(--bg-hover);
}

.category-list__item:active {
  transform: scale(0.98);
}

.category-list__item--active {
  border-color: var(--color-primary);
  background-color: var(--color-primary);
  color: #fff;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: var(--spacing-lg);
}

.product-card {
  background-color: var(--bg-card);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.product-card:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 3px;
}

.product-card__image {
  display: grid;
  place-items: center;
  min-height: 160px;
  padding: var(--spacing-md);
  background-color: var(--bg-hover);
  color: var(--text-secondary);
  text-align: center;
  font-weight: 600;
}

.product-card__body {
  display: grid;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
}

.product-card__title {
  margin: 0;
  font-size: 20px;
  line-height: 1.4;
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
