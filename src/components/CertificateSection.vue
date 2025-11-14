<template>
  <section id="certificates" class="certificate-section">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">权威认证</h2>
        <div class="section-divider"></div>
      </div>

      <div class="certificate-content">
        <div class="certificate-image">
          <img src="https://picsum.photos/id/24/800/1000" alt="教练证书" class="certificate-img">
        </div>

        <div class="certificate-details">
          <h3 class="certificate-title">国际认可的教练资质</h3>
          <p class="certificate-description">
            你对每一门课程的学习掌握都有专业、权威的证书证明。当学生的最终成绩达到课程的考核标准后，即可申请由官方认证、学校发出的课程证书。
          </p>

          <div class="certification-badges">
            <div class="badge-item">
              <img src="https://picsum.photos/id/25/100/100" alt="认证标志1" class="badge-img">
            </div>
            <div class="badge-item">
              <img src="https://picsum.photos/id/26/100/100" alt="认证标志2" class="badge-img">
            </div>
            <div class="badge-item">
              <img src="https://picsum.photos/id/27/100/100" alt="认证标志3" class="badge-img">
            </div>
            <div class="badge-item">
              <img src="https://picsum.photos/id/28/100/100" alt="认证标志4" class="badge-img">
            </div>
          </div>

          <div class="certificate-benefits">
            <h4 class="benefits-title">证书优势：</h4>
            <ul class="benefits-list">
              <li class="benefit-item">国际认可的户外技能资质证明</li>
              <li class="benefit-item">提升个人专业能力和竞争力</li>
              <li class="benefit-item">获得行业就业和发展优势</li>
              <li class="benefit-item">加入专业户外教练人才库</li>
            </ul>
          </div>

          <button class="btn-apply">申请认证</button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.certificate-section {
  padding: 5rem 0;
  background-color: white;
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

.certificate-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
}

.certificate-image {
  position: relative;
}

.certificate-img {
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.certificate-details {
  padding: 2rem;
}

.certificate-title {
  font-size: 1.8rem;
  color: #2c3e50;
  margin-bottom: 1.5rem;
}

.certificate-description {
  color: #666;
  line-height: 1.8;
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

.certification-badges {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.badge-item {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.badge-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.benefits-title {
  font-size: 1.3rem;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.benefits-list {
  list-style-type: none;
  margin-bottom: 2.5rem;
}

.benefit-item {
  color: #666;
  margin-bottom: 0.8rem;
  padding-left: 1.5rem;
  position: relative;
  line-height: 1.6;
}

.benefit-item:before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #3498db;
  font-weight: bold;
}

.btn-apply {
  padding: 0.9rem 2.2rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-apply:hover {
  background-color: #2980b9;
  transform: translateY(-2px);
}

@media (max-width: 992px) {
  .certificate-content {
    grid-template-columns: 1fr;
  }

  .certificate-image {
    max-width: 600px;
    margin: 0 auto;
  }
}

@media (max-width: 768px) {
  .section-title {
    font-size: 2rem;
  }

  .certificate-title {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .certification-badges {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>