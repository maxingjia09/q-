<template>
  <div class="certificates-page">
    <!-- 页面标题区域 -->
    <div class="page-header">
      <div class="container">
        <h1 class="page-title">权威认证</h1>
        <p class="page-description">国际认可的教练资质，为您的专业能力背书</p>
      </div>
    </div>

    <div class="container">
      <div class="certificate-content">
        <div class="certificate-image">
          <img src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=1000&fit=crop" alt="教练证书" class="certificate-img">
        </div>

        <div class="certificate-details">
          <h3 class="certificate-title">国际认可的教练资质</h3>
          <p class="certificate-description">
            你对每一门课程的学习掌握都有专业、权威的证书证明。当学生的最终成绩达到课程的考核标准后，即可申请由官方认证、学校发出的课程证书。
          </p>

          <div class="certification-badges">
            <div class="badge-item">
              <img src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=100&h=100&fit=crop" alt="认证标志1" class="badge-img">
            </div>
            <div class="badge-item">
              <img src="https://images.unsplash.com/photo-1548092372-0d1bd40894a3?w=100&h=100&fit=crop" alt="认证标志2" class="badge-img">
            </div>
            <div class="badge-item">
              <img src="https://images.unsplash.com/photo-1614850715649-1d0106293bd1?w=100&h=100&fit=crop" alt="认证标志3" class="badge-img">
            </div>
            <div class="badge-item">
              <img src="https://images.unsplash.com/photo-1578269174936-2709b6aeb913?w=100&h=100&fit=crop" alt="认证标志4" class="badge-img">
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

          <router-link to="/certification-apply" class="btn-apply">申请认证</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.certificates-page {
  min-height: 100vh;
  padding-bottom: 5rem;
}

.page-header {
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.4)),
              url('https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=1920&h=600&fit=crop');
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

.certificate-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  margin-top: 4rem;
  background: white;
  padding: 3rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.certificate-image {
  position: relative;
}

.certificate-img {
  width: 100%;
  max-width: 500px;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  margin: 0 auto;
  display: block;
}

.certificate-details {
  padding: 1rem;
}

.certificate-title {
  font-size: 2rem;
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
  font-size: 1rem;
}

.benefit-item:before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #3498db;
  font-weight: bold;
}

.btn-apply {
  padding: 1rem 2.5rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-block;
  text-decoration: none;
}

.btn-apply:hover {
  background-color: #2980b9;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
}

/* 响应式设计 */
@media (max-width: 992px) {
  .certificate-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .certificate-image {
    max-width: 500px;
    margin: 0 auto;
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }

  .certificate-title {
    font-size: 1.5rem;
  }

  .certification-badges {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>
