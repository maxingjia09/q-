<script setup>
import { ref, onMounted } from 'vue';
import HeroSection from '../components/HeroSection.vue';
import CourseSection from '../components/CourseSection.vue';
import CertificateSection from '../components/CertificateSection.vue';
import VideoNewsSection from '../components/VideoNewsSection.vue';
import ActivitiesSection from '../components/ActivitiesSection.vue';
import ClubsSection from '../components/ClubsSection.vue';
import AICustomSection from '../components/AICustomSection.vue';
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
  <div class="home-page container" id="top">
    <!-- 主视觉区域 -->
    <HeroSection />
    
    <!-- 活动报名部分 -->
  <ActivitiesSection />
  
  <!-- 俱乐部板块 -->
  <ClubsSection />

  <!-- 课程体系部分 -->
    <CourseSection />

    <!-- 证书展示部分 -->
    <CertificateSection />
    
    <!-- 视频新闻部分 -->
    <VideoNewsSection />
    
    <!-- AI定制板块 -->
    <AICustomSection />
  </div>
</template>

<style scoped>
.home-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
