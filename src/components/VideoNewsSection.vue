<template>
  <section id="video-news-section" class="video-news-section">
    <div class="container">
      <!-- 视频专题部分 -->
      <div class="section-header">
        <h2 class="section-title">视频专题</h2>
        <div class="section-actions">
          <button class="btn-prev" @click="prevVideo()">&lt;</button>
          <button class="btn-next" @click="nextVideo()">&gt;</button>
          <button class="btn-more-videos">更多视频</button>
        </div>
      </div>

      <div class="video-carousel">
        <div class="video-cards" :style="{ transform: `translateX(${videoTranslate}px)` }">
          <div class="video-card">
            <div class="video-thumbnail">
              <img src="https://picsum.photos/id/110/600/400" alt="青少年雪鸟基础工具课程">
              <div class="play-icon">▶</div>
            </div>
            <div class="video-title">青少年雪鸟基础工具课程</div>
          </div>

          <div class="video-card">
            <div class="video-thumbnail">
              <img src="https://picsum.photos/id/111/600/400" alt="探险之旅">
              <div class="play-icon">▶</div>
            </div>
            <div class="video-title">探险之旅 - 秘境之路</div>
          </div>

          <div class="video-card">
            <div class="video-thumbnail">
              <img src="https://picsum.photos/id/112/600/400" alt="英雄之路">
              <div class="play-icon">▶</div>
            </div>
            <div class="video-title">英雄之路 - 2019雪山挑战赛</div>
          </div>

          <div class="video-card">
            <div class="video-thumbnail">
              <img src="https://picsum.photos/id/113/600/400" alt="户外摄影技巧">
              <div class="play-icon">▶</div>
            </div>
            <div class="video-title">户外摄影技巧与实践</div>
          </div>
        </div>
      </div>

      <!-- 新闻速递部分 -->
      <div class="section-header mt-5">
        <h2 class="section-title">新闻速递</h2>
        <button class="btn-more-news">更多新闻</button>
      </div>

      <div class="news-grid">
        <div class="news-card">
          <div class="news-image">
            <img src="https://picsum.photos/id/235/400/300" alt="活动日记">
          </div>
          <div class="news-content">
            <h3 class="news-title">活动日记 | 七步半脊峰的'荣耀之路'</h3>
            <div class="news-date">2020-05-15</div>
          </div>
        </div>

        <div class="news-card">
          <div class="news-image">
            <img src="https://picsum.photos/id/237/400/300" alt="荣耀之路">
          </div>
          <div class="news-content">
            <h3 class="news-title">荣耀之路回顾 | 前方有风雨，因为有你们照亮</h3>
            <div class="news-date">2020-05-05</div>
          </div>
        </div>

        <div class="news-card">
          <div class="news-image">
            <img src="https://picsum.photos/id/239/400/300" alt="人间四月天">
          </div>
          <div class="news-content">
            <h3 class="news-title">活动回顾 | 人间四月天，不负春光去踏青</h3>
            <div class="news-date">2020-04-18</div>
          </div>
        </div>

        <div class="news-card">
          <div class="news-image">
            <img src="https://picsum.photos/id/240/400/300" alt="成长计划">
          </div>
          <div class="news-content">
            <h3 class="news-title">荣耀之路·成长的阶梯挑战 | 青少年体验式新标课程</h3>
            <div class="news-date">2020-04-03</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const videoTranslate = ref(0);
const videoCardWidth = 320; // 视频卡片宽度 + 间距
const maxTranslate = ref(0);
const isDragging = ref(false);
const startX = ref(0);
const initialTranslate = ref(0);

// 视频轮播控制
const prevVideo = () => {
  videoTranslate.value = Math.min(videoTranslate.value + videoCardWidth, 0);
};

const nextVideo = () => {
  videoTranslate.value = Math.max(videoTranslate.value - videoCardWidth, -maxTranslate.value);
};

// 处理窗口大小变化
const handleResize = () => {
  const containerWidth = document.querySelector('.video-carousel').clientWidth;
  const visibleCards = Math.floor(containerWidth / videoCardWidth);
  const totalCards = 4; // 视频卡片总数
  maxTranslate.value = (totalCards - visibleCards) * videoCardWidth;
  videoTranslate.value = Math.max(videoTranslate.value, -maxTranslate.value);
};

// 鼠标拖动功能
const startDrag = (e) => {
  isDragging.value = true;
  startX.value = e.clientX || e.touches[0].clientX;
  initialTranslate.value = videoTranslate.value;
  document.body.style.cursor = 'grabbing';
};

const drag = (e) => {
  if (!isDragging.value) return;
  const currentX = e.clientX || e.touches[0].clientX;
  const diff = startX.value - currentX;
  videoTranslate.value = initialTranslate.value - diff;
  // 限制拖动范围
  videoTranslate.value = Math.min(videoTranslate.value, 0);
  videoTranslate.value = Math.max(videoTranslate.value, -maxTranslate.value);
};

const endDrag = () => {
  isDragging.value = false;
  document.body.style.cursor = '';
};

onMounted(() => {
  handleResize();
  window.addEventListener('resize', handleResize);
  const carousel = document.querySelector('.video-cards');
  carousel.addEventListener('mousedown', startDrag);
  carousel.addEventListener('touchstart', startDrag);
  document.addEventListener('mousemove', drag);
  document.addEventListener('touchmove', drag);
  document.addEventListener('mouseup', endDrag);
  document.addEventListener('touchend', endDrag);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  const carousel = document.querySelector('.video-cards');
  carousel.removeEventListener('mousedown', startDrag);
  carousel.removeEventListener('touchstart', startDrag);
  document.removeEventListener('mousemove', drag);
  document.removeEventListener('touchmove', drag);
  document.removeEventListener('mouseup', endDrag);
  document.removeEventListener('touchend', endDrag);
});
</script>

<style scoped>
.video-news-section {
  padding: 5rem 0;
  background-color: #f9f9f9;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
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
  align-items: center;
}

.btn-prev,
.btn-next {
  width: 36px;
  height: 36px;
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

.btn-more-videos,
.btn-more-news {
  padding: 0.5rem 1.2rem;
  background-color: transparent;
  border: 1px solid #3498db;
  color: #3498db;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-more-videos:hover,
.btn-more-news:hover {
  background-color: rgba(52, 152, 219, 0.1);
}

.video-carousel {
  overflow: hidden;
  margin-bottom: 4rem;
}

.video-cards {
  display: flex;
  gap: 1.5rem;
  transition: transform 0.3s ease;
  will-change: transform;
  cursor: grab;
}

.video-cards:active {
  cursor: grabbing;
}

.video-card {
  flex: 0 0 300px;
}

.video-thumbnail {
  position: relative;
  height: 170px;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 0.8rem;
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
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.video-title {
  font-size: 0.95rem;
  color: #2c3e50;
  font-weight: 500;
  line-height: 1.4;
}

.mt-5 {
  margin-top: 5rem;
}

.news-grid {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.news-card {
  display: flex;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
  height: 150px;
}

.news-card:hover {
  transform: translateY(-5px);
}

.news-image {
  width: 200px;
  height: 100%;
  flex-shrink: 0;
}

.news-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.news-content {
  padding: 1.2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.news-title {
  font-size: 1rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
  line-height: 1.4;
}

.news-date {
  font-size: 0.8rem;
  color: #999;
}

@media (max-width: 768px) {
  .section-title {
    font-size: 1.6rem;
  }

  .video-card {
    flex: 0 0 240px;
  }

  .news-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  }
}

@media (max-width: 480px) {
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .section-actions {
    width: 100%;
    justify-content: space-between;
  }

  .video-card {
    flex: 0 0 280px;
  }

  .news-card {
    flex-direction: column;
    height: auto;
  }

  .news-image {
    width: 100%;
    height: 160px;
  }
}
</style>