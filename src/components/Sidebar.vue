<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

// 侧边栏菜单项
const menuItems = [
  {
    title: '首页',
    icon: '🏠',
    route: '/'
  },
  {
    title: '关于我们',
    icon: 'ℹ️',
    route: '/about'
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
    route: '#video-news-section'
  },
  {
    title: '个人中心',
    icon: '👤',
    route: '/personal'
  },
  {
    title: '登录',
    icon: '🔑',
    route: '/login'
  },
  {
    title: '注册',
    icon: '📝',
    route: '/register'
  }
];

// 导航到指定路由或锚点
const navigateTo = (route) => {
  if (route.startsWith('#')) {
    // 处理锚点链接
    const element = document.querySelector(route);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  } else {
    // 处理普通路由
    router.push(route);
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
          v-for="item in menuItems" 
          :key="item.title"
          class="sidebar-item"
        >
          <a 
            :href="item.route"
            class="sidebar-link"
            @click.prevent="navigateTo(item.route)"
            :target="item.route.startsWith('#') ? '_self' : undefined"
          >
            <span class="sidebar-icon">{{ item.icon }}</span>
            <span class="sidebar-text">{{ item.title }}</span>
          </a>
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
  background-color: white;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  z-index: 1000;
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