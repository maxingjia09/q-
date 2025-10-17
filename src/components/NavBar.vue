<script setup>
import { computed, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { useAuthStore } from '../stores/authStore';
import { useRouter } from 'vue-router';
import AuthModal from './AuthModal.vue';
const props = defineProps({
  isScrolled: {
    type: Boolean,
    default: false
  }
});

const authStore = useAuthStore();
const router = useRouter();
const isAuthenticated = computed(() => authStore.isAuthenticated);
const user = computed(() => authStore.user);
const points = computed(() => authStore.points);

// 模态框状态
const showAuthModal = ref(false);
const authModalView = ref('login');

const openLoginModal = () => {
  authModalView.value = 'login';
  showAuthModal.value = true;
};

const openRegisterModal = () => {
  authModalView.value = 'register';
  showAuthModal.value = true;
};

const closeAuthModal = () => {
  showAuthModal.value = false;
};

const handleLoginSuccess = () => {
  closeAuthModal();
  router.push('/personal');
};

const handleLogout = () => {
  if (confirm('确定要退出登录吗？')) {
    authStore.logout();
    router.push('/login');
  }
};

// 页面内滚动到指定区域
const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};
</script>

<template>
  <nav :class="['navbar', isScrolled ? 'scrolled' : '']">
    <div class="container">
      <div class="logo">
        <img src="../assets/logo.svg" alt="户外俱乐部Logo" class="logo-img">
        <span class="logo-text">探索户外运动中心</span>
      </div>

      <div class="nav-links">
          <RouterLink to="/" class="nav-link">首页</RouterLink>
        <a href="#courses" class="nav-link" @click.prevent="scrollToSection('courses')">课程</a>
        <a href="#certificates" class="nav-link" @click.prevent="scrollToSection('certificates')">证书</a>
        <a href="#about" class="nav-link" @click.prevent="scrollToSection('about')">关于我们</a>
      </div>

      <div class="auth-buttons">
        <template v-if="isAuthenticated">
          <div class="user-info">
            <span class="username">{{ user?.username }}</span>
            <span class="points">{{ points }} 积分</span>
            <button class="btn-logout" @click="handleLogout">退出</button>
          </div>
        </template>
        <template v-else>
          <button class="btn-login" @click="openLoginModal">登录</button>
          <button class="btn-register" @click="openRegisterModal">注册</button>
        </template>
      </div>
    </div>
  </nav>
  
  <!-- 登录/注册模态框 -->
  <AuthModal 
    :is-visible="showAuthModal" 
    :initial-view="authModalView"
    @close="closeAuthModal"
    @login-success="handleLoginSuccess"
  />
</template>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  padding: 0.8rem 0;
}

.navbar.scrolled {
  background-color: rgba(255, 255, 255, 0.95);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.logo-img {
  height: 40px;
}

.logo-text {
  font-size: 1.25rem;
  font-weight: bold;
  color: #2c3e50;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-link {
  color: #2c3e50;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.navbar:not(.scrolled) .nav-link {
  color: white;
}

.nav-link:hover {
  color: #3498db;
}

.auth-buttons {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #2c3e50;
}

.navbar:not(.scrolled) .user-info {
  color: white;
}

.points {
  background-color: #3498db;
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
}

.btn-login,
.btn-register {
  padding: 0.5rem 1.2rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-login {
  background-color: transparent;
  border: 1px solid #3498db;
  color: #3498db;
}

.navbar:not(.scrolled) .btn-login {
  border-color: white;
  color: white;
}

.btn-login:hover {
  background-color: rgba(52, 152, 219, 0.1);
}

.btn-register {
  background-color: #3498db;
  border: 1px solid #3498db;
  color: white;
}

.btn-register:hover {
  background-color: #2980b9;
}

@media (max-width: 768px) {
  .nav-links {
    display: none;
  }
}
</style>