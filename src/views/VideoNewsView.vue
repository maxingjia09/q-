
<template>
  <div class="video-news-page">
    <!-- 页面标题区域 -->
    <div class="page-header">
      <div class="container">
        <h1 class="page-title">视频与新闻</h1>
        <p class="page-description">精彩视频专题与最新户外资讯</p>
      </div>
    </div>

    <div class="container">
      <!-- 视频专题部分 -->
      <div class="video-section">
        <div class="section-header">
          <h2 class="section-title">视频专题</h2>
          <div class="section-actions">
            <button class="btn-prev" @click="prevVideo">&lt;</button>
            <button class="btn-next" @click="nextVideo">&gt;</button>
          </div>
        </div>

        <div class="video-carousel">
          <div class="video-cards" :style="{ transform: `translateX(${videoTranslate}px)` }">
            <div class="video-card">
              <div class="video-thumbnail">
                <img src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=225&fit=crop" alt="青少年雪鸟基础工具课程">
                <div class="play-icon">▶</div>
              </div>
              <div class="video-title">青少年雪鸟基础工具课程</div>
            </div>

            <div class="video-card">
              <div class="video-thumbnail">
                <img src="https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=225&fit=crop" alt="探险之旅">
                <div class="play-icon">▶</div>
              </div>
              <div class="video-title">探险之旅 - 秘境之路</div>
            </div>

            <div class="video-card">
              <div class="video-thumbnail">
                <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=225&fit=crop" alt="英雄之路">
                <div class="play-icon">▶</div>
              </div>
              <div class="video-title">英雄之路 - 2019雪山挑战赛</div>
            </div>

            <div class="video-card">
              <div class="video-thumbnail">
                <img src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=225&fit=crop" alt="户外摄影技巧">
                <div class="play-icon">▶</div>
              </div>
              <div class="video-title">户外摄影技巧与实践</div>
            </div>

            <div class="video-card">
              <div class="video-thumbnail">
                <img src="https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&h=225&fit=crop" alt="野外生存">
                <div class="play-icon">▶</div>
              </div>
              <div class="video-title">野外生存技能指南</div>
            </div>

            <div class="video-card">
              <div class="video-thumbnail">
                <img src="https://images.unsplash.com/photo-1522163182402-834f871fd851?w=400&h=225&fit=crop" alt="攀岩入门">
                <div class="play-icon">▶</div>
              </div>
              <div class="video-title">攀岩入门教学</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 新闻速递部分 -->
      <div class="news-section">
        <div class="section-header">
          <h2 class="section-title">新闻速递</h2>
        </div>

        <div class="news-grid">
          <div class="news-card">
            <div class="news-image">
              <img src="https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&h=225&fit=crop" alt="活动日记">
            </div>
            <div class="news-content">
              <h3 class="news-title">活动日记 | 七步半脊峰的'荣耀之路'</h3>
              <p class="news-excerpt">记录我们团队的荣耀之路，七步半脊峰挑战全程回顾...</p>
              <div class="news-date">2020-05-15</div>
            </div>
          </div>

          <div class="news-card">
            <div class="news-image">
              <img src="https://images.unsplash.com/photo-1522163182402-834f871fd851?w=400&h=225&fit=crop" alt="荣耀之路">
            </div>
            <div class="news-content">
              <h3 class="news-title">荣耀之路回顾 | 前方有风雨，因为有你们照亮</h3>
              <p class="news-excerpt">感谢每一位队友的付出与坚持，让我们一起回顾精彩瞬间...</p>
              <div class="news-date">2020-05-05</div>
            </div>
          </div>

          <div class="news-card">
            <div class="news-image">
              <img src="https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&h=225&fit=crop" alt="人间四月天">
            </div>
            <div class="news-content">
              <h3 class="news-title">活动回顾 | 人间四月天，不负春光去踏青</h3>
              <p class="news-excerpt">春暖花开时节，我们组织了一场精彩的踏青活动...</p>
              <div class="news-date">2020-04-18</div>
            </div>
          </div>

          <div class="news-card">
            <div class="news-image">
              <img src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=225&fit=crop" alt="成长计划">
            </div>
            <div class="news-content">
              <h3 class="news-title">荣耀之路·成长的阶梯挑战 | 青少年体验式新标课程</h3>
              <p class="news-excerpt">专为青少年设计的成长课程，让孩子在户外挑战中成长...</p>
              <div class="news-date">2020-04-03</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const videoTranslate = ref(0);
const videoCardWidth = 320;
const maxTranslate = ref(0);

const prevVideo = () => {
  videoTranslate.value = Math.min(videoTranslate.value + videoCardWidth, 0);
};

const nextVideo = () => {
  videoTranslate.value = Math.max(videoTranslate.value - videoCardWidth, -maxTranslate.value);
};

const handleResize = () => {
  const container = document.querySelector('.video-carousel');
  if (container) {
    const containerWidth = container.clientWidth;
    const visibleCards = Math.floor(containerWidth / videoCardWidth);
    const totalCards = 6;
    maxTranslate.value = Math.max(0, (totalCards - visibleCards) * videoCardWidth);
    videoTranslate.value = Math.max(videoTranslate.value, -maxTranslate.value);
  }
};

onMounted(() => {
  handleResize();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<style scoped>
.video-news-page {
  min-height: 100vh;
  padding-bottom: 5rem;
}

.page-header {
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.4)),
              url('https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1920&h=600&fit=crop');
  background-size: cover;
  background-position: center;
  padding: 6rem 0 4rem;
  text-align: center;
  color: white;
}

.page-title {
  font-size: 3rem;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.page-description {
  font-size: 1.2rem;
  opacity: 0.9;
}

.container {
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* 视频部分 */
.video-section {
  margin-top: 3rem;
  margin-bottom: 5rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.section-title {
  font-size: 2rem;
  color: #2c3e50;
}

.section-actions {
  display: flex;
  gap: 0.8rem;
}

.btn-prev,
.btn-next {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: white;
  border: 1px solid #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 1.2rem;
}

.btn-prev:hover,
.btn-next:hover {
  background-color: #3498db;
  color: white;
  border-color: #3498db;
}

.video-carousel {
  overflow: hidden;
}

.video-cards {
  display: flex;
  gap: 1.5rem;
  transition: transform 0.3s ease;
}

.video-card {
  flex: 0 0 300px;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s ease;
}

.video-card:hover {
  transform: translateY(-5px);
}

.video-thumbnail {
  position: relative;
  height: 170px;
  overflow: hidden;
}

.video-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.play-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50px;
  height: 50px;
  background-color: rgba(52, 152, 219, 0.9);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  transition: all 0.3s ease;
}

.video-card:hover .play-icon {
  background-color: rgba(52, 152, 219, 1);
  transform: translate(-50%, -50%) scale(1.1);
}

.video-title {
  padding: 1rem;
  font-size: 1rem;
  color: #2c3e50;
  font-weight: 500;
}

/* 新闻部分 */
.news-section {
  margin-top: 4rem;
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
}

.news-card {
  display: flex;
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease;
}

.news-card:hover {
  transform: translateY(-5px);
}

.news-image {
  width: 250px;
  height: 180px;
  flex-shrink: 0;
  overflow: hidden;
}

.news-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.news-card:hover .news-image img {
  transform: scale(1.05);
}

.news-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.news-title {
  font-size: 1.1rem;
  color: #2c3e50;
  margin-bottom: 0.8rem;
  line-height: 1.5;
  font-weight: 600;
}

.news-excerpt {
  color: #666;
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.news-date {
  font-size: 0.85rem;
  color: #999;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .news-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }

  .section-title {
    font-size: 1.5rem;
  }

  .news-card {
    flex-direction: column;
  }

  .news-image {
    width: 100%;
    height: 200px;
  }

  .video-card {
    flex: 0 0 260px;
  }
}
</style>
