<template>
  <input
    :value="modelValue"
    :type="inputType"
    class="base-input"
    :placeholder="placeholder"
    @input="handleInput"
  />
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'text',
  },
  placeholder: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue'])

const inputType = computed(() => {
  const validTypes = ['text', 'password']

  if (validTypes.includes(props.type)) {
    return props.type
  }

  return 'text'
})

function handleInput(event) {
  emit('update:modelValue', event.target.value)
}
</script>

<style scoped>
.base-input {
  width: 100%;
  min-height: 44px;
  padding: 0 var(--spacing-md);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  background-color: var(--bg-card);
  color: var(--text-primary);
  font-size: 16px;
  line-height: 1.5;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.base-input::placeholder {
  color: var(--text-placeholder);
}

.base-input:focus {
  border-color: var(--border-focus);
  outline: none;
  box-shadow: 0 0 0 2px rgba(74, 144, 217, 0.12);
}
</style>
