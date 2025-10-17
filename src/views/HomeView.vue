<script setup>
import HeroSection from '../components/HeroSection.vue';
import CourseSection from '../components/CourseSection.vue';
import CertificateSection from '../components/CertificateSection.vue';
</script>

<template>
  <div class="home-page">
    <!-- 导航栏 -->
    <NavBar :is-scrolled="isScrolled" />

    <!-- 主视觉区域 -->
    <HeroSection />

    <!-- 课程体系部分 -->
    <CourseSection />

    <!-- 证书展示部分 -->
    <CertificateSection />
  </div>
</template>

<style scoped>
.home-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
