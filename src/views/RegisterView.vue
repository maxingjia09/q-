<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <h2 class="auth-title">用户注册</h2>
        <p class="auth-subtitle">创建账号，开启您的户外探险之旅</p>
      </div>

      <form class="auth-form" @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="username" class="form-label">用户名</label>
          <input
            type="text"
            id="username"
            v-model="form.username"
            class="form-input"
            placeholder="请输入用户名"
            required
          >
          <div v-if="errors.username" class="error-message">{{ errors.username }}</div>
        </div>

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
            placeholder="请设置密码（至少6位）"
            required
          >
          <div v-if="errors.password" class="error-message">{{ errors.password }}</div>
        </div>

        <div class="form-group">
          <label for="confirmPassword" class="form-label">确认密码</label>
          <input
            type="password"
            id="confirmPassword"
            v-model="form.confirmPassword"
            class="form-input"
            placeholder="请再次输入密码"
            required
          >
          <div v-if="errors.confirmPassword" class="error-message">{{ errors.confirmPassword }}</div>
        </div>

        <div class="form-group">
          <label class="terms-agreement">
            <input type="checkbox" v-model="form.agreeTerms">
            我已阅读并同意<a href="#" class="terms-link">用户协议</a>和<a href="#" class="privacy-link">隐私政策</a>
          </label>
          <div v-if="errors.agreeTerms" class="error-message">{{ errors.agreeTerms }}</div>
        </div>

        <div v-if="errors.general" class="error-message general-error">{{ errors.general }}</div>
        <button type="submit" class="btn-submit" :disabled="isLoading">
          <span v-if="!isLoading">注册</span>
          <span v-if="isLoading">注册中...</span>
        </button>
      </form>

      <div class="auth-footer">
        <p>已有账号？ <a href="#" class="login-link" @click.prevent="handleSwitchToLogin">立即登录</a></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../stores/authStore';
import { defineEmits } from 'vue';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const emit = defineEmits(['switch-to-login', 'register-success']);

const form = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreeTerms: false
});

const errors = reactive({});
const isLoading = ref(false);

// 监听密码变化，实时验证密码格式
watch(
  () => form.password,
  (newPassword) => {
    if (newPassword) {
      if (newPassword.length < 6) {
        errors.password = '密码长度不能少于6位';
      } else if (!/[a-zA-Z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
        errors.password = '密码必须同时包含字母和数字';
      } else {
        // 密码格式正确时清除错误信息
        delete errors.password;
        // 如果确认密码已填写，重新验证两次密码是否一致
        if (form.confirmPassword && form.confirmPassword !== newPassword) {
          errors.confirmPassword = '两次输入的密码不一致';
        }
      }
    }
  }
);

// 监听确认密码变化，实时验证两次密码是否一致
watch(
  () => form.confirmPassword,
  (newConfirmPassword) => {
    if (newConfirmPassword) {
      if (newConfirmPassword !== form.password) {
        errors.confirmPassword = '两次输入的密码不一致';
      } else {
        // 两次密码一致时清除错误信息
        delete errors.confirmPassword;
      }
    }
  }
);

const validateForm = () => {
  const newErrors = {};
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!form.username) {
    newErrors.username = '请输入用户名';
  } else if (form.username.length < 2 || form.username.length > 20) {
    newErrors.username = '用户名长度必须在2-20个字符之间';
  }

  if (!form.email) {
    newErrors.email = '请输入邮箱';
  } else if (!emailRegex.test(form.email)) {
    newErrors.email = '请输入有效的邮箱地址';
  }

  if (!form.password) {
    newErrors.password = '请输入密码';
  } else if (form.password.length < 6) {
    newErrors.password = '密码长度不能少于6位';
  } else if (!/[a-zA-Z]/.test(form.password) || !/[0-9]/.test(form.password)) {
    newErrors.password = '密码必须同时包含字母和数字';
  }

  if (!form.confirmPassword) {
    newErrors.confirmPassword = '请确认密码';
  } else if (form.confirmPassword !== form.password) {
    newErrors.confirmPassword = '两次输入的密码不一致';
  }

  if (!form.agreeTerms) {
    newErrors.agreeTerms = '请阅读并同意用户协议和隐私政策';
  }

  Object.assign(errors, newErrors);
  return Object.keys(newErrors).length === 0;
};

const handleSwitchToLogin = () => {
  emit('switch-to-login');
  if (route.path === '/register') {
    router.push('/login');
  }
};

const handleSubmit = async () => {
  if (!validateForm()) return;

  isLoading.value = true;
  try {
    // 模拟注册请求
    await authStore.register({
      username: form.username,
      email: form.email,
      password: form.password
    });
    // 注册成功后发出事件通知父组件
    emit('register-success');
    // 直接在独立页面访问注册页时跳转到登录页
    if (route.path === '/register') {
      router.push('/login');
    }
  } catch (error) {
    errors.general = error.message || '注册失败，请稍后重试';
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
  max-width: 480px;
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
  margin-bottom: 1.2rem;
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

.general-error {
  background: #ffeaea;
  border: 1px solid #e74c3c;
  border-radius: 6px;
  padding: 0.75rem;
  margin-bottom: 1rem;
  text-align: center;
  font-weight: 500;
}

.terms-agreement {
  color: #666;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  line-height: 1.6;
}

.terms-link,
.privacy-link,
.terms-link:hover,
.privacy-link:hover {
  color: #3498db;
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
  margin-top: 0.5rem;
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

.login-link {
  color: #3498db;
  text-decoration: none;
  font-weight: 500;
}

.login-link:hover {
  text-decoration: underline;
}
</style>