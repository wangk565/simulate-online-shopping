<template>
  <div class="product-detail-page">
    <AppHeader />

    <main class="product-detail-page__content">
      <section v-if="product" class="detail-card">
        <div class="detail-card__image">
          <div class="image-carousel">
            <div class="carousel-container" ref="carouselContainer">
              <img
                v-for="(image, index) in product.images"
                :key="index"
                :src="image"
                :alt="product.name"
                class="carousel-image"
                :class="{ active: currentImageIndex === index }"
                @click="currentImageIndex = index"
              />
            </div>
            <div class="carousel-controls">
              <button
                class="control-btn prev"
                @click="prevImage"
                :disabled="currentImageIndex === 0"
              >
                &lt;
              </button>
              <div class="carousel-indicators">
                <button
                  v-for="(image, index) in product.images"
                  :key="index"
                  class="indicator"
                  :class="{ active: currentImageIndex === index }"
                  @click="currentImageIndex = index"
                />
              </div>
              <button
                class="control-btn next"
                @click="nextImage"
                :disabled="currentImageIndex === product.images.length - 1"
              >
                &gt;
              </button>
            </div>
          </div>
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

          <div class="purchase-panel">
            <label class="purchase-panel__label" for="quantity-input">购买数量</label>
            <input
              id="quantity-input"
              v-model.number="quantity"
              class="purchase-panel__input"
              type="number"
              min="1"
              :max="product.stock"
            />
          </div>

          <div class="detail-card__actions">
            <BaseButton type="primary" @click="handleAddToCart">
              加入购物车
            </BaseButton>
            <BaseButton type="secondary" @click="goBackToList">
              返回商品列表
            </BaseButton>
          </div>
        </div>
      </section>

      <Empty
        v-else
        title="未找到该商品"
        description="这个商品可能不存在，或者当前链接有误。"
      >
        <BaseButton type="primary" @click="goBackToList">
          返回商品列表
        </BaseButton>
      </Empty>
    </main>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import categories from '../data/categories.js'
import products from '../data/products.js'
import AppHeader from '../shared/components/AppHeader.vue'
import BaseButton from '../shared/components/BaseButton.vue'
import Empty from '../shared/components/Empty.vue'
import { useCart } from '../shared/composables/useCart.js'
import { useToast } from '../shared/composables/useToast.js'

const route = useRoute()
const router = useRouter()
const quantity = ref(1)
const currentImageIndex = ref(0)
const carouselContainer = ref(null)
const { addToCart } = useCart()
const { showError, showSuccess } = useToast()

function prevImage() {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--
  }
}

function nextImage() {
  if (product.value && currentImageIndex.value < product.value.images.length - 1) {
    currentImageIndex.value++
  }
}

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

watch(
  product,
  (nextProduct) => {
    quantity.value = nextProduct ? 1 : 0
  },
  { immediate: true },
)

function handleAddToCart() {
  if (!product.value) {
    return
  }

  const result = addToCart(product.value, quantity.value)

  if (result.success) {
    showSuccess(result.message)
    return
  }

  showError(result.message)
}

function goBackToList() {
  router.push('/products')
}
</script>

<style scoped>
.product-detail-page {
  min-height: 100vh;
  background-color: var(--surface);
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
  background-color: var(--surface-container-lowest);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  position: relative;
}

.detail-card__image {
  min-height: 360px;
  background-color: var(--surface-container-low);
  position: relative;
  border-radius: var(--radius-lg);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-carousel {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.carousel-container {
  position: relative;
  width: 100%;
  height: 80%;
  overflow: hidden;
  border-radius: var(--radius-lg);
  margin-bottom: var(--spacing-md);
}

.carousel-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.3s ease;
  cursor: pointer;
}

.carousel-image.active {
  opacity: 1;
  position: relative;
}

.carousel-controls {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  width: 100%;
  justify-content: center;
}

.control-btn {
  width: 48px;
  height: 48px;
  border: none;
  border-radius: var(--radius-full);
  background: linear-gradient(135deg, var(--surface-container), var(--surface-container-low));
  color: var(--text-primary);
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  box-shadow: var(--shadow-sm);
}

.control-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.control-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.carousel-indicators {
  display: flex;
  gap: 12px;
}

.indicator {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: none;
  background-color: var(--surface-variant);
  cursor: pointer;
  transition: all 0.2s ease;
}

.indicator.active {
  background-color: var(--color-primary);
  transform: scale(1.2);
}

@media (max-width: 768px) {
  .detail-card {
    grid-template-columns: 1fr;
    padding: var(--spacing-lg);
  }
  
  .detail-card__image {
    min-height: 240px;
  }
  
  .carousel-container {
    height: 70%;
  }
  
  .control-btn {
    width: 40px;
    height: 40px;
    font-size: 16px;
  }
  
  .indicator {
    width: 14px;
    height: 14px;
  }
}

.detail-card__info {
  display: grid;
  gap: var(--spacing-lg);
  align-content: start;
}

.detail-card__title {
  margin: 0;
  font-size: 36px;
  line-height: 1.2;
  font-family: 'Plus Jakarta Sans', sans-serif;
  letter-spacing: -0.02em;
  color: var(--text-primary);
}

.detail-card__price {
  font-size: 36px;
  font-weight: 800;
  color: var(--color-primary);
  font-family: 'Plus Jakarta Sans', sans-serif;
  letter-spacing: -0.02em;
}

.detail-card__description {
  margin: 0;
  line-height: 1.6;
  color: var(--text-secondary);
  font-size: 16px;
}

.detail-card__meta {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  background-color: var(--surface-container-low);
  border-radius: var(--radius-lg);
}

.detail-card__meta-item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.detail-card__meta-item dt {
  font-size: 14px;
  color: var(--text-tertiary);
  font-weight: 600;
  font-family: 'Plus Jakarta Sans', sans-serif;
  letter-spacing: -0.01em;
}

.detail-card__meta-item dd {
  margin: 0;
  font-size: 16px;
  color: var(--text-primary);
}

.purchase-panel {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  padding: var(--spacing-lg);
  background-color: var(--surface-container-low);
  border-radius: var(--radius-lg);
}

.purchase-panel__label {
  font-weight: 600;
  font-family: 'Plus Jakarta Sans', sans-serif;
  letter-spacing: -0.01em;
}

.purchase-panel__input {
  width: 120px;
  min-height: 56px;
  padding: 0 var(--spacing-lg);
  border: none;
  border-radius: var(--radius-full);
  background-color: var(--surface-container-highest);
  color: var(--text-primary);
  font-size: 16px;
  transition: all 0.2s ease;
}

.purchase-panel__input:focus {
  outline: 2px solid var(--color-primary-light);
  outline-offset: 2px;
  transform: scale(1.02);
}

.detail-card__actions {
  display: flex;
  gap: var(--spacing-md);
  margin-top: var(--spacing-lg);
}

@media (max-width: 768px) {
  .detail-card__actions {
    flex-direction: column;
  }
  
  .detail-card__title {
    font-size: 28px;
  }
  
  .detail-card__price {
    font-size: 28px;
  }
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

.purchase-panel {
  display: grid;
  gap: var(--spacing-sm);
  max-width: 220px;
}

.purchase-panel__label {
  font-weight: 600;
}

.purchase-panel__input {
  width: 100%;
  min-height: 44px;
  padding: 0 var(--spacing-md);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  background-color: var(--bg-card);
  color: var(--text-primary);
  font-size: 16px;
}

.detail-card__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
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

  .purchase-panel {
    max-width: none;
  }
}
</style>
