<script setup>
import { useRouter } from 'vue-router';
import HeroSection from '../components/HeroSection.vue';

const router = useRouter();

const quickLinks = [
  { title: '活动报名', icon: '📝', path: '/activities', desc: '探索精彩户外活动' },
  { title: '探索俱乐部', icon: '⛰️', path: '/clubs', desc: '选择专业户外俱乐部' },
  { title: '课程体系', icon: '📚', path: '/courses', desc: '专业户外技能培训' },
  { title: '权威认证', icon: '🏆', path: '/certificates', desc: '国际认可教练资质' },
  { title: 'AI定制', icon: '🤖', path: '/ai-custom', desc: '个性化路线推荐' }
];

const navigateTo = (path) => {
  router.push(path);
};
</script>

<template>
  <div class="home-page">
    <!-- 主视觉区域 -->
    <HeroSection />

    <!-- 快速导航区域 -->
    <section class="quick-links-section">
      <div class="container">
        <h2 class="section-title">探索户外世界</h2>
        <p class="section-subtitle">选择您感兴趣的内容，开始您的户外之旅</p>

        <div class="quick-links-grid">
          <div
            v-for="link in quickLinks"
            :key="link.path"
            class="quick-link-card"
            @click="navigateTo(link.path)"
          >
            <span class="link-icon">{{ link.icon }}</span>
            <h3 class="link-title">{{ link.title }}</h3>
            <p class="link-desc">{{ link.desc }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-page {
  min-height: 100vh;
}

/* 快速导航区域 */
.quick-links-section {
  padding: 5rem 0;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.container {
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 2rem;
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  color: white;
  margin-bottom: 1rem;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
}

.section-subtitle {
  text-align: center;
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 3rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.quick-links-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.quick-link-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.quick-link-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
}

.link-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 1rem;
}

.link-title {
  font-size: 1.3rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.link-desc {
  font-size: 0.95rem;
  color: #7f8c8d;
  line-height: 1.5;
}

/* 响应式设计 */
@media (max-width: 992px) {
  .quick-links-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 576px) {
  .quick-links-grid {
    grid-template-columns: 1fr;
  }

  .section-title {
    font-size: 2rem;
  }
}
</style>
