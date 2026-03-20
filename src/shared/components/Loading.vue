<template>
  <div v-if="loadingVisible" class="loading-overlay">
    <div class="loading-card">
      <span class="loading-card__spinner" />
      <p class="loading-card__text">{{ loadingText }}</p>
    </div>
  </div>
</template>

<script setup>
import { useLoading } from '../composables/useLoading.js'

const { loadingVisible, loadingText } = useLoading()
</script>

<style scoped>
.loading-overlay {
  position: fixed;
  inset: 0;
  z-index: 999;
  display: grid;
  place-items: center;
  background-color: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(2px);
}

.loading-card {
  display: grid;
  justify-items: center;
  gap: var(--spacing-md);
  min-width: 180px;
  padding: var(--spacing-lg);
  background-color: var(--bg-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}

.loading-card__spinner {
  width: 36px;
  height: 36px;
  border: 3px solid var(--border-default);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: loading-spin 0.8s linear infinite;
}

.loading-card__text {
  margin: 0;
  color: var(--text-secondary);
}

@keyframes loading-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
