<template>
  <section id="courses" class="course-section">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">课程体系</h2>
        <div class="section-divider"></div>
      </div>

      <div class="course-grid">
        <div class="course-card">
          <div class="course-image">
            <img src="https://picsum.photos/id/29/600/400" alt="山地探索课程">
          </div>
          <div class="course-content">
            <h3 class="course-title">山地探索课程</h3>
            <p class="course-description">适合初学者的山地探索技能培训，包括地图阅读、指南针使用和基础攀登技术。</p>
            <a href="#" class="course-link">了解详情 →</a>
          </div>
        </div>

        <div class="course-card">
          <div class="course-image">
            <img src="https://picsum.photos/id/30/600/400" alt="山地救援课程">
          </div>
          <div class="course-content">
            <h3 class="course-title">山地救援课程</h3>
            <p class="course-description">专业的山地救援技术培训，学习紧急情况下的救援技巧和安全操作规范。</p>
            <a href="#" class="course-link">了解详情 →</a>
          </div>
        </div>

        <div class="course-card">
          <div class="course-image">
            <img src="https://picsum.photos/id/31/600/400" alt="山地生存课程">
          </div>
          <div class="course-content">
            <h3 class="course-title">山地生存课程</h3>
            <p class="course-description">掌握野外生存技能，包括搭建庇护所、寻找水源、野外烹饪和应对恶劣天气。</p>
            <a href="#" class="course-link">了解详情 →</a>
          </div>
        </div>

        <div class="course-card">
          <div class="course-image">
            <img src="https://picsum.photos/id/32/600/400" alt="青少年课程">
          </div>
          <div class="course-content">
            <h3 class="course-title">青少年课程</h3>
            <p class="course-description">专为青少年设计的户外教育课程，培养团队合作能力和环境意识。</p>
            <a href="#" class="course-link">了解详情 →</a>
          </div>
        </div>
      </div>

      <div class="view-all-courses">
        <button class="btn-view-all">查看全部课程</button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.course-section {
  padding: 5rem 0;
  background-color: transparent;
  color: #ffffff;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
}

.container {
  max-width: 1800px; /* 与App.vue中的container保持一致 */
  width: 100%;
  margin: 0 auto;
  padding: 0 2rem;
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
  opacity: 0;
  transform: translateY(20px);
  animation: sectionHeaderFadeIn 0.8s ease-out forwards;
  animation-delay: 0.2s;
}

.section-title {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 1rem;
  display: inline-block;
  position: relative;
  padding: 0 2.5rem;
}

.section-title::before,
.section-title::after {
  content: '';
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 60px;
  height: 60px;
  opacity: 0;
  animation: climberFadeIn 0.5s ease-out forwards;
  animation-delay: 0.5s;
}

.section-title::before {
  left: -1.5rem;
  background-image: url('/src/assets/climbingAnimation.svg');
  background-size: contain;
  background-repeat: no-repeat;
}

.section-title::after {
  right: -1.5rem;
  background-image: url('/src/assets/climbingAnimation.svg');
  background-size: contain;
  background-repeat: no-repeat;
  transform: translateY(-50%) rotateY(180deg);
}

.section-divider {
  width: 0;
  height: 4px;
  background-color: #3498db;
  margin: 0 auto;
  animation: dividerGrow 1s ease-out forwards;
  animation-delay: 0.8s;
}

/* 动画关键帧 */
@keyframes sectionHeaderFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes climberFadeIn {
  from {
    opacity: 0;
    transform: translateY(-50%) scale(0.8);
  }
  to {
    opacity: 1;
    transform: translateY(-50%) scale(1);
  }
}

.section-title::after {
  animation-name: climberFadeInAfter;
}

@keyframes climberFadeInAfter {
  from {
    opacity: 0;
    transform: translateY(-50%) scale(0.8) rotateY(180deg);
  }
  to {
    opacity: 1;
    transform: translateY(-50%) scale(1) rotateY(180deg);
  }
}

@keyframes dividerGrow {
  from {
    width: 0;
  }
  to {
    width: 80px;
  }
}

.course-grid {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-bottom: 3rem;
}

.course-card {
  display: flex;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 200px;
}

.course-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.course-image {
  width: 300px;
  height: 100%;
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
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.course-title {
  font-size: 1.3rem;
  color: #2c3e50;
  margin-bottom: 0.8rem;
}

.course-description {
  color: #666;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.course-link {
  display: inline-block;
  color: #3498db;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.2s ease;
}

.course-link:hover {
  color: #2980b9;
}

.view-all-courses {
  text-align: center;
}

.btn-view-all {
  padding: 0.8rem 2rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-view-all:hover {
  background-color: #2980b9;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .section-title {
    font-size: 2rem;
  }

  .course-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
}

@media (max-width: 768px) {
  .course-card {
    flex-direction: column;
    height: auto;
  }
  
  .course-image {
    width: 100%;
    height: 200px;
  }
}
</style>