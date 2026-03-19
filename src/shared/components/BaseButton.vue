<template>
  <button
    :type="nativeType"
    class="base-button"
    :class="`base-button--${buttonType}`"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot />
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'primary',
  },
  nativeType: {
    type: String,
    default: 'button',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['click'])

const buttonType = computed(() => {
  const validTypes = ['primary', 'secondary', 'danger']

  if (validTypes.includes(props.type)) {
    return props.type
  }

  return 'primary'
})

function handleClick(event) {
  if (props.disabled) {
    return
  }

  emit('click', event)
}
</script>

<style scoped>
.base-button {
  min-width: 80px;
  min-height: 44px;
  padding: 0 var(--spacing-md);
  border-radius: var(--radius-md);
  border: 1px solid transparent;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.2;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease;
}

.base-button:focus-visible {
  outline: 2px solid var(--color-primary-light);
  outline-offset: 2px;
}

.base-button:disabled {
  background-color: var(--bg-disabled);
  color: var(--text-disabled);
  cursor: not-allowed;
}

.base-button--primary {
  background-color: var(--color-primary);
  color: #fff;
}

.base-button--primary:hover:not(:disabled) {
  background-color: var(--color-primary-light);
}

.base-button--primary:active:not(:disabled) {
  background-color: var(--color-primary-dark);
  transform: scale(0.98);
}

.base-button--secondary {
  background-color: var(--bg-card);
  border-color: var(--border-default);
  color: var(--text-primary);
}

.base-button--secondary:hover:not(:disabled) {
  background-color: var(--bg-hover);
}

.base-button--secondary:active:not(:disabled) {
  transform: scale(0.98);
}

.base-button--danger {
  background-color: var(--color-danger);
  color: #fff;
}

.base-button--danger:hover:not(:disabled) {
  filter: brightness(1.05);
}

.base-button--danger:active:not(:disabled) {
  transform: scale(0.98);
}
</style>
