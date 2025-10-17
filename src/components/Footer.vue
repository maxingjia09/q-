<template>
  <footer class="footer-section">
    <div class="container">
      <div class="footer-content">
        <div class="footer-logo">
          <img src="../assets/logo.svg" alt="户外俱乐部Logo" class="logo-img">
          <p class="logo-text">探索户外运动中心</p>
          <p class="footer-description">
            专业的户外探险课程和认证体系，让每个人安全享受大自然的魅力
          </p>
        </div>

        <div class="footer-links">
          <h4 class="link-title">快速链接</h4>
          <ul class="link-list">
            <li><a href="#" class="footer-link">首页</a></li>
            <li><a href="#courses" class="footer-link">课程体系</a></li>
            <li><a href="#certificates" class="footer-link">证书认证</a></li>
            <li><a href="#" class="footer-link">关于我们</a></li>
            <li><a href="#" class="footer-link">联系我们</a></li>
          </ul>
        </div>

        <div class="footer-contact">
          <h4 class="link-title">联系我们</h4>
          <ul class="contact-list">
            <li class="contact-item">
              <i class="icon-location"></i>
              <span>北京市海淀区中关村南大街5号</span>
            </li>
            <li class="contact-item">
              <i class="icon-phone"></i>
              <span>400-123-4567</span>
            </li>
            <li class="contact-item">
              <i class="icon-email"></i>
              <span>info@outdoorclub.com</span>
            </li>
          </ul>

          <div class="social-links">
            <a href="#" class="social-icon"><i class="icon-weixin"></i></a>
            <a href="#" class="social-icon"><i class="icon-weibo"></i></a>
            <a href="#" class="social-icon"><i class="icon-instagram"></i></a>
            <a href="#" class="social-icon"><i class="icon-youtube"></i></a>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <div class="copyright">
          © 2023 探索户外运动中心 版权所有
        </div>
        <div class="footer-policies">
          <a href="#" class="policy-link">隐私政策</a>
          <a href="#" class="policy-link">服务条款</a>
          <a href="#" class="policy-link">Cookie政策</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer-section {
  background-color: #2c3e50;
  color: white;
  padding: 4rem 0 2rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.footer-content {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr;
  gap: 3rem;
  margin-bottom: 3rem;
}

.footer-logo {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.logo-img {
  width: 60px;
  height: 60px;
}

.logo-text {
  font-size: 1.3rem;
  font-weight: bold;
}

.footer-description {
  color: #bdc3c7;
  line-height: 1.6;
  font-size: 0.9rem;
}

.link-title {
  font-size: 1.1rem;
  margin-bottom: 1.2rem;
  position: relative;
  padding-bottom: 0.5rem;
}

.link-title:after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 30px;
  height: 2px;
  background-color: #3498db;
}

.link-list {
  list-style: none;
}

.footer-link {
  color: #bdc3c7;
  text-decoration: none;
  line-height: 1.8;
  transition: color 0.2s ease;
  display: inline-block;
}

.footer-link:hover {
  color: #3498db;
  transform: translateX(3px);
}

.contact-list {
  list-style: none;
}

.contact-item {
  display: flex;
  align-items: flex-start;
  gap: 0.8rem;
  margin-bottom: 1rem;
  color: #bdc3c7;
  line-height: 1.6;
}

.icon-location,
.icon-phone,
.icon-email {
  font-size: 1.2rem;
  color: #3498db;
  flex-shrink: 0;
  margin-top: 3px;
}

.social-links {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.social-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: all 0.3s ease;
}

.social-icon:hover {
  background-color: #3498db;
  transform: translateY(-3px);
}

.icon-weixin,
.icon-weibo,
.icon-instagram,
.icon-youtube {
  font-size: 1.2rem;
}

.footer-bottom {
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.copyright {
  color: #bdc3c7;
  font-size: 0.9rem;
}

.footer-policies {
  display: flex;
  gap: 1.5rem;
}

.policy-link {
  color: #bdc3c7;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s ease;
}

.policy-link:hover {
  color: #3498db;
}

@media (max-width: 992px) {
  .footer-content {
    grid-template-columns: 1fr 1fr;
  }

  .footer-logo {
    grid-column: 1 / -1;
    text-align: center;
    align-items: center;
  }
}

@media (max-width: 768px) {
  .footer-bottom {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}

@media (max-width: 576px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .footer-links,
  .footer-contact {
    text-align: center;
  }

  .link-title:after {
    left: 50%;
    transform: translateX(-50%);
  }

  .contact-item {
    justify-content: center;
  }

  .social-links {
    justify-content: center;
  }
}
</style>