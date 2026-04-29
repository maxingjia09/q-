<script setup>
import { ref, onMounted } from 'vue';
import { RouterView } from 'vue-router';
import NavBar from './components/NavBar.vue';
import Footer from './components/Footer.vue';

const handleScroll = () => {
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});
</script>

<template>
  <div class="app">
    <NavBar />
    <main class="main-content">
      <RouterView />
    </main>
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
  background-image: url('https://images.unsplash.com/photo-1551632811-561732d1e306?w=1920&h=1080&fit=crop');
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  overflow-x: hidden; /* 防止水平滚动条 */
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  background-color: transparent;
}

.main-content {
  flex: 1;
  padding-top: 80px;
  background-color: transparent;
  min-height: calc(100vh - 80px);
  width: 100%;
}

/* 通用容器样式 */
.container {
  max-width: 1600px; /* 增加最大宽度 */
  width: 100%;
  margin: 0 auto;
  padding: 0 2rem;
}

/* 个人中心页面使用更大的宽度 */
.main-content .personal-page .container {
  max-width: 100%;
  padding: 0 1rem;
}

/* 确保RouterView内的内容能够正常居中 */
.main-content > * {
  width: 100%;
  margin: 0;
}

/* 个人中心页面使用更大的宽度 */
.main-content > .personal-container {
  max-width: none;
  width: 100%;
  margin: 0;
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
