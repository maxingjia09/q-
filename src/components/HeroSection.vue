<template>
  <div class="hero-wrapper">
    <!-- 英雄内容 -->
    <div class="hero-content">
      <h1>探索自然的奇妙</h1>
      <p>加入我们，开启您的户外冒险之旅</p>
    </div>
  </div>
</template>

<script setup>
// 组件逻辑
</script>

<style scoped>
.hero-wrapper {
    width: 100%;
    height: 600px;
    background-image: url('@/assets/zf.jpg');
    background-size: cover;
    background-position: center;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
}

.hero-wrapper::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
  z-index: 0;
}

.hero-content {
  position: relative;
  z-index: 1;
  color: white;
  padding: 0 20px;
  max-width: 800px;
  /* 添加一些额外的文字阴影以增强可读性 */
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
}

.hero-content h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  font-weight: bold;
  letter-spacing: 1px;
}

.hero-content p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  line-height: 1.6;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .hero-wrapper {
    height: 400px;
  }
  
  .hero-content h1 {
    font-size: 2rem;
  }
  
  .hero-content p {
    font-size: 1rem;
  }
}
</style>