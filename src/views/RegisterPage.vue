<template>
  <main class="register-page">
    <section class="register-card">
      <h1 class="register-card__title">注册账号</h1>
      <p class="register-card__subtitle">先创建一个学习用账号，再进入登录页面。</p>

      <form class="register-form" @submit.prevent="handleSubmit">
        <label class="register-form__field">
          <span class="register-form__label">用户名</span>
          <BaseInput v-model="username" placeholder="请输入用户名" />
        </label>

        <label class="register-form__field">
          <span class="register-form__label">密码</span>
          <BaseInput v-model="password" type="password" placeholder="请输入密码" />
        </label>

        <label class="register-form__field">
          <span class="register-form__label">确认密码</span>
          <BaseInput
            v-model="confirmPassword"
            type="password"
            placeholder="请再次输入密码"
          />
        </label>

        <BaseButton native-type="submit" class="register-form__submit">
          注册
        </BaseButton>
      </form>
    </section>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BaseButton from '../shared/components/BaseButton.vue'
import BaseInput from '../shared/components/BaseInput.vue'
import { useLoading } from '../shared/composables/useLoading.js'
import { useToast } from '../shared/composables/useToast.js'
import { useUser } from '../shared/composables/useUser.js'

const router = useRouter()
const { register } = useUser()
const { showLoading, hideLoading } = useLoading()
const { showError, showSuccess } = useToast()

const username = ref('')
const password = ref('')
const confirmPassword = ref('')

function handleSubmit() {
  if (!username.value.trim() || !password.value || !confirmPassword.value) {
    showError('请完整填写注册信息')
    return
  }

  if (password.value !== confirmPassword.value) {
    showError('两次密码输入不一致')
    return
  }

  showLoading('正在注册...')

  try {
    const result = register(username.value, password.value)

    if (!result.success) {
      showError(result.message)
      return
    }

    showSuccess(result.message)
    router.push('/login')
  } finally {
    hideLoading()
  }
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-lg);
}

.register-card {
  width: min(100%, 420px);
  padding: var(--spacing-xl);
  background-color: var(--bg-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}

.register-card__title {
  margin: 0 0 var(--spacing-sm);
  font-size: 28px;
  line-height: 1.3;
  text-align: center;
}

.register-card__subtitle {
  margin: 0 0 var(--spacing-lg);
  color: var(--text-secondary);
  text-align: center;
}

.register-form {
  display: grid;
  gap: var(--spacing-md);
}

.register-form__field {
  display: grid;
  gap: var(--spacing-sm);
}

.register-form__label {
  font-weight: 600;
}

.register-form__submit {
  width: 100%;
}
</style>
