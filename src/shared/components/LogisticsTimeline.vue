<template>
  <section class="logistics-timeline">
    <h2 class="logistics-timeline__title">物流时间线</h2>

    <div v-if="timeline.length" class="logistics-timeline__list">
      <article
        v-for="item in timeline"
        :key="`${item.status}-${item.time}`"
        class="logistics-timeline__item"
        :class="{
          'logistics-timeline__item--active': item.status === currentStatus,
          'logistics-timeline__item--done': isCompleted(item.status),
        }"
      >
        <span class="logistics-timeline__dot" />
        <div class="logistics-timeline__content">
          <div class="logistics-timeline__top">
            <strong>{{ item.status }}</strong>
            <span>{{ formatTime(item.time) }}</span>
          </div>
          <p>{{ item.description }}</p>
        </div>
      </article>
    </div>

    <p v-else class="logistics-timeline__empty">暂无物流信息</p>
  </section>
</template>

<script setup>
const props = defineProps({
  timeline: {
    type: Array,
    default: () => [],
  },
  currentStatus: {
    type: String,
    default: '',
  },
})

const statusOrder = ['已发货', '运输中', '派送中', '已签收']

function formatTime(time) {
  const date = new Date(time)

  if (Number.isNaN(date.getTime())) {
    return '未知时间'
  }

  return date.toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function isCompleted(status) {
  return statusOrder.indexOf(status) <= statusOrder.indexOf(props.currentStatus)
}
</script>

<style scoped>
.logistics-timeline {
  display: grid;
  gap: var(--spacing-md);
}

.logistics-timeline__title {
  margin: 0;
  font-size: 24px;
}

.logistics-timeline__list {
  display: grid;
  gap: var(--spacing-md);
}

.logistics-timeline__item {
  position: relative;
  display: grid;
  grid-template-columns: 18px minmax(0, 1fr);
  gap: var(--spacing-md);
  align-items: start;
}

.logistics-timeline__item:not(:last-child)::after {
  content: '';
  position: absolute;
  left: 8px;
  top: 22px;
  width: 2px;
  height: calc(100% + var(--spacing-md));
  background-color: var(--border-default);
}

.logistics-timeline__dot {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: var(--border-default);
  box-shadow: 0 0 0 4px rgba(78, 145, 227, 0.08);
}

.logistics-timeline__content {
  display: grid;
  gap: var(--spacing-xs);
  padding-bottom: var(--spacing-sm);
}

.logistics-timeline__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
}

.logistics-timeline__content p,
.logistics-timeline__empty {
  margin: 0;
  color: var(--text-secondary);
  line-height: 1.7;
}

.logistics-timeline__item--done .logistics-timeline__dot {
  background-color: var(--color-primary);
}

.logistics-timeline__item--active .logistics-timeline__content strong {
  color: var(--color-primary);
}

@media (max-width: 768px) {
  .logistics-timeline__top {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
