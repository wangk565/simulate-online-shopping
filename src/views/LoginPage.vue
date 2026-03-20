<template>
  <main class="login-page">
    <section class="login-card">
      <h1 class="login-card__title">登录账号</h1>
      <p class="login-card__subtitle">输入用户名和密码，进入模拟购物流程。</p>

      <form class="login-form" @submit.prevent="handleSubmit">
        <label class="login-form__field">
          <span class="login-form__label">用户名</span>
          <BaseInput v-model="username" placeholder="请输入用户名" />
        </label>

        <label class="login-form__field">
          <span class="login-form__label">密码</span>
          <BaseInput v-model="password" type="password" placeholder="请输入密码" />
        </label>

        <BaseButton native-type="submit" class="login-form__submit">
          登录
        </BaseButton>
      </form>

      <RouterLink class="login-card__link" to="/register">
        没有账号？去注册
      </RouterLink>
    </section>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import BaseButton from '../shared/components/BaseButton.vue'
import BaseInput from '../shared/components/BaseInput.vue'
import { useLoading } from '../shared/composables/useLoading.js'
import { useToast } from '../shared/composables/useToast.js'
import { useUser } from '../shared/composables/useUser.js'

const router = useRouter()
const { login } = useUser()
const { showLoading, hideLoading } = useLoading()
const { showError, showSuccess } = useToast()

const username = ref('')
const password = ref('')

function handleSubmit() {
  if (!username.value.trim() || !password.value) {
    showError('请输入用户名和密码')
    return
  }

  showLoading('正在登录...')

  try {
    const result = login(username.value, password.value)

    if (!result.success) {
      showError(result.message)
      return
    }

    showSuccess(result.message)
    router.push('/')
  } finally {
    hideLoading()
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-lg);
}

.login-card {
  width: min(100%, 420px);
  padding: var(--spacing-xl);
  background-color: var(--bg-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}

.login-card__title {
  margin: 0 0 var(--spacing-sm);
  font-size: 28px;
  line-height: 1.3;
  text-align: center;
}

.login-card__subtitle {
  margin: 0 0 var(--spacing-lg);
  color: var(--text-secondary);
  text-align: center;
}

.login-form {
  display: grid;
  gap: var(--spacing-md);
}

.login-form__field {
  display: grid;
  gap: var(--spacing-sm);
}

.login-form__label {
  font-weight: 600;
}

.login-form__submit {
  width: 100%;
}

.login-card__link {
  display: inline-block;
  margin-top: var(--spacing-md);
  color: var(--color-primary);
  font-weight: 600;
}
</style>
