<script setup>
import { ref, onMounted } from 'vue';
import { RouterView } from 'vue-router';
import NavBar from './components/NavBar.vue';
import Sidebar from './components/Sidebar.vue';
import Footer from './components/Footer.vue';

// 监听滚动事件
const handleScroll = () => {
  // 滚动事件逻辑可以在这里添加
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});
</script>

<template>
  <div class="app">
    <NavBar />
    <!-- 主要内容布局 -->
    <div class="main-layout">
      <Sidebar />
      <main class="main-content">
        <!-- 恢复RouterView，使路由跳转正常工作 -->
        <RouterView />
      </main>
    </div>
    <Footer />
  </div>
</template>

<style>
/* 全局样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  line-height: 1.6;
  color: #2c3e50;
  margin: 0;
  padding: 0;
  background-image: url('/mount-everest.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  background-repeat: no-repeat;
  overflow-x: hidden; /* 防止水平滚动条 */
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
}

/* 确保app容器不会遮挡背景 */
.app {
  background-color: transparent;
}

.main-layout {
  display: flex;
  flex: 1;
}

.main-content {
  flex: 1;
  /* 移除padding-left，因为侧边栏已经是fixed定位 */
  transition: padding-left 0.3s ease;
  background-color: transparent; /* 透明背景，让页面自己控制背景 */
  min-height: calc(100vh - 80px); /* 确保内容区域足够高 */
  display: flex;
  justify-content: center;
  width: 100%; /* 使用全宽度 */
}

/* 响应式调整 */
@media (max-width: 768px) {
  .main-content {
    /* 响应式下也不需要padding-left */
  }
}

/* 通用容器样式 */
.container {
  max-width: 1600px; /* 增加最大宽度 */
  width: 100%;
  margin: 0 auto;
  padding: 0 2rem;
}

/* 确保RouterView内的内容能够正常居中 */
.main-content > * {
  width: 100%;
  max-width: 1800px; /* 进一步增加最大宽度以满足要求 */
  margin: 0 auto;
}

/* 通用按钮样式 */
.btn {
  padding: 0.5rem 1.2rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  outline: none;
  font-size: 1rem;
}

.btn-primary {
  background-color: #3498db;
  color: white;
}

.btn-primary:hover {
  background-color: #2980b9;
}

.btn-outline {
  background-color: transparent;
  border: 1px solid #3498db;
  color: #3498db;
}

.btn-outline:hover {
  background-color: rgba(52, 152, 219, 0.1);
}
</style>
