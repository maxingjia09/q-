<script setup>
import { useRouter, useRoute } from 'vue-router';
import { computed } from 'vue';
import { useAuthStore } from '../stores/authStore';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

// 侧边栏菜单项
const menuItems = [
  {
    title: '首页',
    icon: '🏠',
    route: '#top'  // 改为锚点，点击时滚动到页面顶部
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

// 计算最终要显示的菜单项，根据用户权限控制
const visibleMenuItems = computed(() => {
  if (!authStore.isAuthenticated) {
    // 未登录用户只能看到管理员登录选项，看不到管理员板块标题和仪表盘
    return menuItems.filter(item => 
      item.title === '管理员登录' || 
      (!item.isAdminOnly && !item.isSectionHeader)
    );
  } else if (authStore.user?.isAdmin) {
    // 管理员可以看到所有菜单项
    return menuItems;
  } else {
    // 普通用户看不到任何管理员相关项
    return menuItems.filter(item => !item.isAdminOnly && !item.isSectionHeader);
  }
});

// 判断菜单项是否处于活动状态
const isActive = computed(() => (itemRoute) => {
  // 对于路由链接，检查当前路径
  if (!itemRoute.startsWith('#')) {
    return route.path === itemRoute;
  }
  // 对于锚点链接，这里可以添加特殊处理逻辑
  // 目前暂时返回false，因为锚点状态通常在页面内部管理
  return false;
});

// 导航到指定路由或锚点
const navigateTo = (targetRoute) => {
  if (targetRoute.startsWith('#')) {
    // 处理锚点链接
    if (route.path !== '/') {
      // 如果当前不在首页，先跳转到首页，然后滚动到锚点
      router.push('/').then(() => {
        setTimeout(() => {
          const element = document.querySelector(targetRoute);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      });
    } else {
      // 如果已经在首页，直接滚动到锚点
      const element = document.querySelector(targetRoute);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  } else {
    // 判断当前是否在个人中心页面且要切换到其他页面
    // 如果是从个人中心切换到其他页面，使用window.location.href强制刷新
    if (route.path === '/personal' && targetRoute !== '/personal') {
      window.location.href = targetRoute;
    } else {
      // 其他情况使用router.push
      router.push(targetRoute);
    }
  }
};
</script>

<template>
  <!-- 侧边栏 -->
  <aside class="sidebar">
    <!-- 侧边栏头部 -->
    <div class="sidebar-header">
      <h2>户外俱乐部</h2>
    </div>

    <!-- 侧边栏菜单 -->
    <nav class="sidebar-nav">
      <ul class="sidebar-menu">
        <li 
          v-for="item in visibleMenuItems" 
          :key="item.title"
          :class="['sidebar-item', { 'sidebar-section-header': item.isSectionHeader }]"
        >
          <template v-if="item.isSectionHeader">
            <div class="sidebar-section-header-text">
              <span class="sidebar-icon">{{ item.icon }}</span>
              <span class="sidebar-text">{{ item.title }}</span>
            </div>
          </template>
          <template v-else>
            <a 
              :href="item.route"
              class="sidebar-link"
              :class="{ active: isActive(item.route) }"
              @click.prevent="navigateTo(item.route)"
              :target="item.route.startsWith('#') ? '_self' : undefined"
            >
              <span class="sidebar-icon">{{ item.icon }}</span>
              <span class="sidebar-text">{{ item.title }}</span>
            </a>
          </template>
        </li>
      </ul>
    </nav>

    <!-- 侧边栏底部 -->
    <div class="sidebar-footer">
      <p class="sidebar-copyright">© 2023 户外俱乐部</p>
    </div>
  </aside>
</template>

<style scoped>
/* 侧边栏 */
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 280px;
  height: 100vh;
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.2);
  overflow-y: auto;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

/* 确保侧边栏在小屏幕上仍然显示 */
@media (max-width: 768px) {
  .sidebar {
    width: 240px;
  }
}

/* 侧边栏头部 */
.sidebar-header {
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
  text-align: center;
}

.sidebar-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #2c3e50;
}

/* 侧边栏菜单 */
.sidebar-nav {
  padding: 1rem 0;
}

.sidebar-menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar-item {
  margin: 0;
}

.sidebar-link {
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  color: #2c3e50;
  text-decoration: none;
  transition: all 0.2s ease;
  border-left: 3px solid transparent;
}

.sidebar-link:hover {
  background-color: #f8f9fa;
  border-left-color: #3498db;
}

.sidebar-link.active {
  background-color: #ecf0f1;
  border-left-color: #3498db;
  font-weight: 500;
}

/* 侧边栏图标样式 */
.sidebar-icon {
  font-size: 1.25rem;
  margin-right: 1rem;
  width: 24px;
  text-align: center;
}

.sidebar-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  margin-right: 1rem;
  font-size: 1.2rem;
}

.sidebar-text {
  font-size: 1rem;
}

/* 管理员板块标题样式 */
.sidebar-section-header {
  margin: 1rem 0;
}

.sidebar-section-header-text {
  display: flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  color: #3498db;
  font-weight: 600;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-left: 3px solid #3498db;
  background-color: rgba(52, 152, 219, 0.1);
}

/* 侧边栏底部 */
.sidebar-footer {
  padding: 1.5rem;
  border-top: 1px solid #eee;
  margin-top: auto;
}

.sidebar-copyright {
  margin: 0;
  font-size: 0.875rem;
  color: #7f8c8d;
  text-align: center;
}

/* 遮罩层 */
.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  transition: all 0.3s ease;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .sidebar {
    width: 250px;
    left: -250px;
  }
}
</style>