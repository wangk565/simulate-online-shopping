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
  min-width: 120px;
  min-height: 64px;
  padding: 0 var(--spacing-lg);
  border-radius: var(--radius-full);
  border: none;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.2;
  transition:
    all 0.2s ease;
  position: relative;
  overflow: hidden;
  font-family: 'Plus Jakarta Sans', sans-serif;
  letter-spacing: -0.02em;
}

.base-button:focus-visible {
  outline: 2px solid var(--color-primary-light);
  outline-offset: 3px;
}

.base-button:disabled {
  background: linear-gradient(135deg, var(--text-disabled), var(--text-placeholder));
  color: var(--text-secondary);
  cursor: not-allowed;
  transform: none;
}

.base-button--primary {
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
  color: var(--text-primary);
  box-shadow: var(--shadow-md);
}

.base-button--primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.base-button--primary:active:not(:disabled) {
  transform: scale(0.98);
}

.base-button--secondary {
  background: linear-gradient(135deg, var(--color-secondary), var(--color-secondary-light));
  color: var(--text-primary);
  box-shadow: var(--shadow-sm);
}

.base-button--secondary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.base-button--secondary:active:not(:disabled) {
  transform: scale(0.98);
}

.base-button--danger {
  background: linear-gradient(135deg, var(--color-danger), #FF8787);
  color: var(--text-primary);
  box-shadow: var(--shadow-sm);
}

.base-button--danger:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.base-button--danger:active:not(:disabled) {
  transform: scale(0.98);
}
</style>
