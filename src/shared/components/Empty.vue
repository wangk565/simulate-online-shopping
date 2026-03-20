<template>
  <section class="empty-block">
    <div class="empty-block__icon">□</div>
    <h2 class="empty-block__title">{{ title }}</h2>
    <p class="empty-block__description">{{ description }}</p>
    <div v-if="$slots.default" class="empty-block__actions">
      <slot />
    </div>
  </section>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: '暂无内容',
  },
  description: {
    type: String,
    default: '当前还没有可以展示的数据。',
  },
})
</script>

<style scoped>
.empty-block {
  display: grid;
  gap: var(--spacing-md);
  justify-items: start;
  padding: var(--spacing-xl);
  background-color: var(--bg-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.empty-block__icon {
  display: grid;
  place-items: center;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: var(--bg-hover);
  color: var(--color-primary);
  font-size: 26px;
}

.empty-block__title,
.empty-block__description {
  margin: 0;
}

.empty-block__description {
  color: var(--text-secondary);
  line-height: 1.7;
}

.empty-block__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
}
</style>
