<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <h2 class="auth-title">管理员登录</h2>
        <p class="auth-subtitle">请输入管理员账号信息</p>
      </div>

      <form class="auth-form" @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="email" class="form-label">邮箱</label>
          <input
            type="email"
            id="email"
            v-model="form.email"
            class="form-input"
            placeholder="请输入管理员邮箱"
            required
          >
          <div v-if="errors.email" class="error-message">{{ errors.email }}</div>
        </div>

        <div class="form-group">
          <label for="password" class="form-label">密码</label>
          <input
            type="password"
            id="password"
            v-model="form.password"
            class="form-input"
            placeholder="请输入管理员密码"
            required
          >
          <div v-if="errors.password" class="error-message">{{ errors.password }}</div>
        </div>

        <div v-if="errors.general" class="error-message general-error">{{ errors.general }}</div>

        <button type="submit" class="btn-submit" :disabled="isLoading">
          <span v-if="!isLoading">管理员登录</span>
          <span v-if="isLoading">登录中...</span>
        </button>
      </form>

      <div class="auth-footer">
        <p>返回 <a href="#" class="register-link" @click.prevent="handleSwitchToUserLogin">用户登录</a></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';

const router = useRouter();
const authStore = useAuthStore();

const form = reactive({
  email: '',
  password: ''
});

const errors = reactive({});
const isLoading = ref(false);

const validateForm = () => {
  const newErrors = {};
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!form.email) {
    newErrors.email = '请输入邮箱';
  } else if (!emailRegex.test(form.email)) {
    newErrors.email = '请输入有效的邮箱地址';
  }

  if (!form.password) {
    newErrors.password = '请输入密码';
  } else if (form.password.length < 6) {
    newErrors.password = '密码长度不能少于6位';
  }

  Object.assign(errors, newErrors);
  return Object.keys(newErrors).length === 0;
};

const handleSwitchToUserLogin = () => {
  router.push('/login');
};

const handleSubmit = async () => {
  if (!validateForm()) return;

  isLoading.value = true;
  try {
    // 登录验证
    const userData = await authStore.login(form.email, form.password);
    
    // 检查是否为管理员
    if (userData.isAdmin) {
      // 是管理员，跳转到管理员后台
      router.push('/admin/dashboard');
    } else {
      // 不是管理员，显示错误信息
      errors.general = '您不是管理员，无法登录管理后台';
      // 清除登录状态
      await authStore.logout();
    }
  } catch (error) {
    errors.general = error.message || '登录失败，请检查账号密码';
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
  padding: 2rem;
}

.auth-card {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 420px;
  overflow: hidden;
}

.auth-header {
  padding: 2rem;
  text-align: center;
  border-bottom: 1px solid #f0f0f0;
}

.auth-title {
  font-size: 1.8rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.auth-subtitle {
  color: #666;
}

.auth-form {
  padding: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  color: #2c3e50;
  font-weight: 500;
}

.form-input {
  width: 100%;
  padding: 0.9rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-input:focus {
  border-color: #e74c3c;
  outline: none;
}

.error-message {
  color: #e74c3c;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

.general-error {
  margin-bottom: 1.5rem;
  text-align: center;
}

.btn-submit {
  width: 100%;
  padding: 0.9rem;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-submit:hover:not(:disabled) {
  background-color: #c0392b;
}

.btn-submit:disabled {
  background-color: #95a5a6;
  cursor: not-allowed;
}

.auth-footer {
  padding: 1.5rem 2rem;
  text-align: center;
  border-top: 1px solid #f0f0f0;
}

.register-link {
  color: #3498db;
  text-decoration: none;
  font-weight: 500;
}

.register-link:hover {
  text-decoration: underline;
}
</style>