<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <h2 class="auth-title">用户登录</h2>
        <p class="auth-subtitle">欢迎回来！请输入您的账号信息</p>
      </div>

      <form class="auth-form" @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="email" class="form-label">邮箱</label>
          <input
            type="email"
            id="email"
            v-model="form.email"
            class="form-input"
            placeholder="请输入您的邮箱"
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
            placeholder="请输入您的密码"
            required
          >
          <div v-if="errors.password" class="error-message">{{ errors.password }}</div>
        </div>

        <div class="form-options">
          <label class="remember-me">
            <input type="checkbox" v-model="form.remember"> 记住我
          </label>
          <a href="#" class="forgot-password">忘记密码？</a>
        </div>

        <button type="submit" class="btn-submit" :disabled="isLoading">
          <span v-if="!isLoading">登录</span>
          <span v-if="isLoading">登录中...</span>
        </button>
      </form>

      <div class="auth-footer">
        <p>还没有账号？ <a href="#" class="register-link" @click.prevent="handleSwitchToRegister">立即注册</a></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';
import { defineEmits } from 'vue';

const router = useRouter();
const authStore = useAuthStore();
const emit = defineEmits(['switch-to-register', 'login-success']);

const form = reactive({
  email: '',
  password: '',
  remember: false
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

const handleSwitchToRegister = () => {
  emit('switch-to-register');
};

const handleSubmit = async () => {
    console.log('Login submit called with email:', form.email);
    if (!validateForm()) return;

    isLoading.value = true;
    try {
      // 模拟登录请求
      console.log('Calling authStore.login');
      const userData = await authStore.login(form.email, form.password);
      console.log('Login successful, user data:', userData);
      
      // 登录成功后先确保用户信息已初始化
      await authStore.initAuth();
      console.log('After initAuth, isAuthenticated:', authStore.isAuthenticated);
      
      // 登录成功后触发事件
      emit('login-success');
      
      // 直接跳转到个人中心页面，确保无论是通过模态框还是直接登录都能跳转
      console.log('Redirecting to /personal');
      setTimeout(() => {
        router.push('/personal');
      }, 100); // 短暂延迟确保状态已更新
    } catch (error) {
      console.error('Login failed:', error.message);
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
  border-color: #3498db;
  outline: none;
}

.error-message {
  color: #e74c3c;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.remember-me {
  color: #666;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.forgot-password {
  color: #3498db;
  text-decoration: none;
}

.forgot-password:hover {
  text-decoration: underline;
}

.btn-submit {
  width: 100%;
  padding: 0.9rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-submit:hover:not(:disabled) {
  background-color: #2980b9;
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