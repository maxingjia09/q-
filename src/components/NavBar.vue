<script setup>
import { ref, computed } from 'vue';
import { RouterLink } from 'vue-router';
import { useAuthStore } from '../stores/authStore';
import { useRouter, useRoute } from 'vue-router';
import AuthModal from './AuthModal.vue';

const props = defineProps({
  isScrolled: {
    type: Boolean,
    default: false
  }
});

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const isAuthenticated = computed(() => authStore.isAuthenticated);
const user = computed(() => authStore.user);
const points = computed(() => authStore.points);
const avatar = computed(() => authStore.avatar);

const emit = defineEmits(['toggle-sidebar']);

const showAuthModal = ref(false);
const authModalView = ref('login');
const isMobileMenuOpen = ref(false);
const showUserDropdown = ref(false);

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

const handleLoginSuccess = async () => {
  console.log('Login success handler triggered in NavBar');
  closeAuthModal();
  
  try {
    await authStore.initAuth();
    console.log('After initAuth in NavBar, isAuthenticated:', authStore.isAuthenticated);
    
    if (authStore.isAuthenticated) {
      console.log('Redirecting with page refresh to personal center');
      window.location.href = '/personal';
    } else {
      console.error('Authentication failed after login success event');
    }
  } catch (error) {
    console.error('Error initializing auth after login:', error);
  }
};

const handleLogout = () => {
  if (confirm('确定要退出登录吗？')) {
    authStore.logout();
    router.push('/login');
  }
};

const handleRegisterSuccess = () => {
  router.push('/login');
};

const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

const toggleSidebar = () => {
  emit('toggle-sidebar');
};

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const menuItems = [
  {
    title: '首页',
    icon: '🏠',
    route: '#top'
  },
  {
    title: '活动报名',
    icon: '📝',
    route: '#activities'
  },
  {
    title: '探索俱乐部',
    icon: '⛰️',
    route: '#clubs-section'
  },
  {
    title: '课程体系',
    icon: '📚',
    route: '#courses'
  },
  {
    title: '权威认证',
    icon: '🏆',
    route: '#certificates'
  },
  {
    title: '视频专题',
    icon: '🎬',
    route: '#video-news-section'
  },
  {
    title: '新闻速递',
    icon: '📰',
    route: '#news-section'
  },
  {
    title: 'AI定制路线',
    icon: '🤖',
    route: '#ai-custom-section'
  },
  {
    title: '个人中心',
    icon: '👤',
    route: '/personal'
  },
  {
    title: '管理员板块',
    icon: '🔧',
    isSectionHeader: true
  },
  {
    title: '管理员仪表盘',
    icon: '📊',
    route: '/admin/dashboard',
    isAdminOnly: true
  },
  {
    title: '管理员登录',
    icon: '🔑',
    route: '/admin/login',
    isAdminOnly: true
  }
];

const visibleMenuItems = computed(() => {
  if (!authStore.isAuthenticated) {
    return menuItems.filter(item => 
      item.title === '管理员登录' || 
      (!item.isAdminOnly && !item.isSectionHeader)
    );
  } else if (authStore.user?.isAdmin) {
    return menuItems;
  } else {
    return menuItems.filter(item => !item.isAdminOnly && !item.isSectionHeader);
  }
});

const isActive = computed(() => (itemRoute) => {
  if (!itemRoute.startsWith('#')) {
    return route.path === itemRoute;
  }
  return false;
});

const navigateTo = (targetRoute) => {
  if (targetRoute.startsWith('#')) {
    if (route.path !== '/') {
      router.push('/').then(() => {
        setTimeout(() => {
          const element = document.querySelector(targetRoute);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      });
    } else {
      const element = document.querySelector(targetRoute);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  } else {
    if (route.path === '/personal' && targetRoute !== '/personal') {
      window.location.href = targetRoute;
    } else {
      router.push(targetRoute);
    }
  }
  isMobileMenuOpen.value = false;
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
        <a 
          v-for="item in visibleMenuItems" 
          :key="item.title"
          :class="['nav-link', { active: isActive(item.route) }]"
          @click="navigateTo(item.route)"
        >
          <span class="nav-icon">{{ item.icon }}</span>
          <span>{{ item.title }}</span>
        </a>
      </div>

      <button class="menu-toggle" @click="toggleMobileMenu">
        <span :class="{ open: isMobileMenuOpen }"></span>
        <span :class="{ open: isMobileMenuOpen }"></span>
        <span :class="{ open: isMobileMenuOpen }"></span>
      </button>

      <div class="auth-buttons">
        <template v-if="isAuthenticated">
          <div class="user-info" @mouseenter="showUserDropdown = true" @mouseleave="showUserDropdown = false">
            <div class="user-avatar-container">
              <img :src="avatar || '../assets/logo.svg'" alt="用户头像" class="user-avatar-img">
            </div>
            <span class="points">{{ points }} 积分</span>
            <div v-show="showUserDropdown" class="user-dropdown">
              <div class="dropdown-item" @click="router.push('/personal')">
                <span class="dropdown-icon">👤</span>
                <span>个人中心</span>
              </div>
              <div class="dropdown-item" @click="handleLogout">
                <span class="dropdown-icon">🚪</span>
                <span>退出登录</span>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <button class="btn-login" @click="openLoginModal">登录</button>
          <button class="btn-register" @click="openRegisterModal">注册</button>
        </template>
      </div>
    </div>

    <div :class="['mobile-menu', { open: isMobileMenuOpen }]">
      <a 
        v-for="item in visibleMenuItems" 
        :key="item.title"
        :class="['mobile-menu-item', { active: isActive(item.route) }]"
        @click="navigateTo(item.route)"
      >
        <span class="mobile-menu-icon">{{ item.icon }}</span>
        <span>{{ item.title }}</span>
      </a>
    </div>
  </nav>
  
  <AuthModal 
    :is-visible="showAuthModal" 
    :initial-view="authModalView"
    @close="closeAuthModal"
    @login-success="handleLoginSuccess"
    @register-success="handleRegisterSuccess"
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
  background-color: rgba(255, 255, 255, 0.95);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.navbar.scrolled {
  background-color: rgba(255, 255, 255, 0.98);
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.15);
}

.container {
  max-width: 1800px;
  width: 100%;
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
  gap: 0.5rem;
  flex: 1;
  justify-content: center;
  overflow-x: auto;
  padding: 0 1rem;
}

.nav-links::-webkit-scrollbar {
  height: 3px;
}

.nav-links::-webkit-scrollbar-thumb {
  background-color: #3498db;
  border-radius: 3px;
}

.nav-link {
  color: #2c3e50;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  cursor: pointer;
}

.nav-link:hover {
  background-color: #f8f9fa;
  color: #3498db;
}

.nav-link.active {
  background-color: #ecf0f1;
  color: #3498db;
  font-weight: 600;
}

.nav-icon {
  font-size: 1.1rem;
}

.auth-buttons {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-shrink: 0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #2c3e50;
  position: relative;
}

.user-avatar-container {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2px;
  cursor: pointer;
  transition: all 0.3s;
}

.user-avatar-container:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.user-avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  background: white;
}

.user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 10px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  min-width: 180px;
  padding: 8px 0;
  z-index: 1001;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  cursor: pointer;
  transition: all 0.3s;
  color: #495057;
}

.dropdown-item:hover {
  background: #f8f9fa;
  color: #667eea;
}

.dropdown-icon {
  font-size: 18px;
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

.menu-toggle {
  display: none;
  flex-direction: column;
  justify-content: space-around;
  width: 30px;
  height: 25px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 1001;
}

.menu-toggle span {
  width: 100%;
  height: 3px;
  background-color: #2c3e50;
  border-radius: 3px;
  transition: all 0.3s ease;
}

.menu-toggle:hover span:nth-child(2) {
  transform: translateX(5px);
}

.mobile-menu {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.mobile-menu.open {
  max-height: 500px;
  overflow-y: auto;
}

.mobile-menu-item {
  display: flex;
  align-items: center;
  padding: 1rem 2rem;
  color: #2c3e50;
  text-decoration: none;
  transition: all 0.2s;
  border-left: 3px solid transparent;
  cursor: pointer;
}

.mobile-menu-item:hover {
  background-color: #f8f9fa;
  border-left-color: #3498db;
}

.mobile-menu-item.active {
  background-color: #ecf0f1;
  border-left-color: #3498db;
  font-weight: 600;
}

.mobile-menu-icon {
  font-size: 1.2rem;
  margin-right: 1rem;
}

@media (max-width: 1024px) {
  .nav-links {
    display: none;
  }

  .menu-toggle {
    display: flex;
  }

  .mobile-menu {
    display: block;
  }
}

@media (max-width: 768px) {
  .container {
    padding: 0 1rem;
  }

  .logo-text {
    font-size: 1rem;
  }

  .logo-img {
    height: 32px;
  }

  .user-info {
    gap: 0.5rem;
  }

  .points {
    display: none;
  }
}
</style>