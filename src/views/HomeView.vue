<script setup>
import { ref, onMounted } from 'vue';
import HeroSection from '../components/HeroSection.vue';
import CourseSection from '../components/CourseSection.vue';
import CertificateSection from '../components/CertificateSection.vue';
import VideoNewsSection from '../components/VideoNewsSection.vue';
import NavBar from '../components/NavBar.vue';

const isScrolled = ref(false);

// 监听滚动事件
onMounted(() => {
  const handleScroll = () => {
    isScrolled.value = window.scrollY > 10;
  };
  
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <div class="home-page container">
    <!-- 主视觉区域 -->
    <HeroSection />

    <!-- 课程体系部分 -->
    <CourseSection />

    <!-- 证书展示部分 -->
    <CertificateSection />
    
    <!-- 视频新闻部分 -->
    <VideoNewsSection />
  </div>
</template>

<style scoped>
.home-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
