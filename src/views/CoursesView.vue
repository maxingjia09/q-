<template>
  <div class="courses-page">
    <!-- 页面标题区域 -->
    <div class="page-header">
      <div class="container">
        <h1 class="page-title">课程体系</h1>
        <p class="page-description">专业的户外技能培训，从入门到精通，助您成为户外达人</p>
      </div>
    </div>

    <div class="container">
      <div class="course-grid">
        <div class="course-card">
          <div class="course-image">
            <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=400&fit=crop" alt="山地探索课程">
          </div>
          <div class="course-content">
            <h3 class="course-title">山地探索课程</h3>
            <p class="course-description">适合初学者的山地探索技能培训，包括地图阅读、指南针使用和基础攀登技术。</p>
            <div class="course-meta">
              <span class="meta-item">
                <span class="meta-icon">⏱️</span>
                2天
              </span>
              <span class="meta-item">
                <span class="meta-icon">👥</span>
                10-20人
              </span>
              <span class="meta-item">
                <span class="meta-icon">📊</span>
                入门级
              </span>
            </div>
            <div class="course-footer">
              <span class="course-price">¥1,280</span>
              <router-link to="/courses/1" class="course-link">了解详情 →</router-link>
            </div>
          </div>
        </div>

        <div class="course-card">
          <div class="course-image">
            <img src="@/assets/sd.PNG" alt="山地救援课程">
          </div>
          <div class="course-content">
            <h3 class="course-title">山地救援课程</h3>
            <p class="course-description">专业的山地救援技术培训，学习紧急情况下的救援技巧和安全操作规范。</p>
            <div class="course-meta">
              <span class="meta-item">
                <span class="meta-icon">⏱️</span>
                3天
              </span>
              <span class="meta-item">
                <span class="meta-icon">👥</span>
                5-15人
              </span>
              <span class="meta-item">
                <span class="meta-icon">📊</span>
                进阶级
              </span>
            </div>
            <div class="course-footer">
              <span class="course-price">¥2,580</span>
              <router-link to="/courses/2" class="course-link">了解详情 →</router-link>
            </div>
          </div>
        </div>

        <div class="course-card">
          <div class="course-image">
            <img src="@/assets/sc.PNG" alt="山地生存课程">
          </div>
          <div class="course-content">
            <h3 class="course-title">山地生存课程</h3>
            <p class="course-description">掌握野外生存技能，包括搭建庇护所、寻找水源、野外烹饪和应对恶劣天气。</p>
            <div class="course-meta">
              <span class="meta-item">
                <span class="meta-icon">⏱️</span>
                2天
              </span>
              <span class="meta-item">
                <span class="meta-icon">👥</span>
                8-16人
              </span>
              <span class="meta-item">
                <span class="meta-icon">📊</span>
                中级
              </span>
            </div>
            <div class="course-footer">
              <span class="course-price">¥1,980</span>
              <router-link to="/courses/3" class="course-link">了解详情 →</router-link>
            </div>
          </div>
        </div>

        <div class="course-card">
          <div class="course-image">
            <img src="@/assets/qsn.PNG" alt="青少年课程">
          </div>
          <div class="course-content">
            <h3 class="course-title">青少年户外课程</h3>
            <p class="course-description">专为青少年设计的户外教育课程，培养团队合作能力和环境意识。</p>
            <div class="course-meta">
              <span class="meta-item">
                <span class="meta-icon">⏱️</span>
                1天
              </span>
              <span class="meta-item">
                <span class="meta-icon">👥</span>
                15-30人
              </span>
              <span class="meta-item">
                <span class="meta-icon">📊</span>
                青少年
              </span>
            </div>
            <div class="course-footer">
              <span class="course-price">¥680</span>
              <router-link to="/courses/4" class="course-link">了解详情 →</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.courses-page {
  min-height: 100vh;
  padding-bottom: 5rem;
}

.page-header {
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.4)),
              url('https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1920&h=600&fit=crop');
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

.course-grid {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-top: 3rem;
}

.course-card {
  display: flex;
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.course-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.course-image {
  width: 350px;
  height: 250px;
  overflow: hidden;
  flex-shrink: 0;
}

.course-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.course-card:hover .course-image img {
  transform: scale(1.05);
}

.course-content {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
}

.course-title {
  font-size: 1.5rem;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.course-description {
  color: #666;
  line-height: 1.8;
  margin-bottom: 1.5rem;
  font-size: 1rem;
}

.course-meta {
  display: flex;
  gap: 2rem;
  margin-bottom: 1.5rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #7f8c8d;
  font-size: 0.95rem;
}

.meta-icon {
  font-size: 1.1rem;
}

.course-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.course-price {
  font-size: 1.8rem;
  font-weight: 700;
  color: #e74c3c;
}

.course-link {
  display: inline-block;
  padding: 0.8rem 1.5rem;
  background-color: #3498db;
  color: white;
  font-weight: 500;
  text-decoration: none;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.course-link:hover {
  background-color: #2980b9;
  transform: translateY(-2px);
}

/* 响应式设计 */
@media (max-width: 992px) {
  .course-card {
    flex-direction: column;
  }

  .course-image {
    width: 100%;
    height: 220px;
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }

  .course-meta {
    flex-wrap: wrap;
    gap: 1rem;
  }
}
</style>
