<template>
  <div class="toast-list">
    <transition-group name="toast">
      <article
        v-for="toast in toasts"
        :key="toast.id"
        class="toast-item"
        :class="`toast-item--${toast.type}`"
      >
        <span>{{ toast.message }}</span>
        <button type="button" class="toast-item__close" @click="removeToast(toast.id)">
          ×
        </button>
      </article>
    </transition-group>
  </div>
</template>

<script setup>
import { useToast } from '../composables/useToast.js'

const { toasts, removeToast } = useToast()
</script>

<style scoped>
.toast-list {
  position: fixed;
  top: var(--spacing-lg);
  right: var(--spacing-lg);
  z-index: 1000;
  display: grid;
  gap: var(--spacing-sm);
  width: min(360px, calc(100vw - 32px));
}

.toast-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
  padding: 12px 14px;
  border-radius: var(--radius-md);
  color: #fff;
  box-shadow: var(--shadow-md);
}

.toast-item--success { background-color: var(--color-success); }
.toast-item--error { background-color: var(--color-danger); }
.toast-item--warning { background-color: var(--color-warning); }
.toast-item--info { background-color: var(--color-info); }

.toast-item__close {
  min-width: 32px;
  min-height: 32px;
  padding: 0;
  background: transparent;
  color: inherit;
  font-size: 20px;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.2s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
