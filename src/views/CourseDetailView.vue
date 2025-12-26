<template>
  <div class="course-detail-page">
    <div class="page-container">
      <aside class="sidebar">
        <div class="sidebar-header">
          <div class="logo">
            <img src="../assets/logo.svg" alt="Logo">
          </div>
          <h3 class="brand-name">探索户外运动中心</h3>
        </div>

        <nav class="sidebar-nav">
          <div 
            v-for="tab in [
              { id: 'overview', label: '课程概览', icon: '📖' },
              { id: 'details', label: '课程详情', icon: '📋' },
              { id: 'reviews', label: '课程评价', icon: '⭐' },
              { id: 'register', label: '报名课程', icon: '📝' }
            ]"
            :key="tab.id"
            :class="['nav-item', { active: activeTab === tab.id }]"
            @click="activeTab = tab.id"
          >
            <span class="icon">{{ tab.icon }}</span>
            <span>{{ tab.label }}</span>
          </div>
          <div class="nav-item back" @click="goBack">
            <span class="icon">⬅️</span>
            <span>返回首页</span>
          </div>
        </nav>
      </aside>

      <main class="main-content">
        <div class="content-wrapper">
          <div v-if="course" class="course-detail">
            <header class="course-header">
              <div class="course-banner">
                <img :src="course.image" :alt="course.name">
              </div>
              <div class="course-title-section">
                <h1 class="course-title">{{ course.name }}</h1>
                <div class="course-meta">
                  <span class="meta-item">
                    <i class="meta-icon">📊</i>
                    难度：{{ course.difficulty }}
                  </span>
                  <span class="meta-item">
                    <i class="meta-icon">⏱️</i>
                    时长：{{ course.duration }}
                  </span>
                  <span class="meta-item">
                    <i class="meta-icon">👥</i>
                    适合：{{ course.targetAudience }}
                  </span>
                </div>
              </div>
            </header>

            <div class="tab-content">
              <div v-if="activeTab === 'overview'" class="overview-section">
                <h2>课程介绍</h2>
                <div class="course-description">
                  <p v-for="(paragraph, index) in descriptionParagraphs" :key="index" class="description-paragraph">
                    {{ paragraph }}
                  </p>
                </div>
              </div>

              <div v-if="activeTab === 'details'" class="details-section">
                <h2>课程详情</h2>
                <div class="course-details">
                  <div class="detail-card">
                    <div class="card-icon">📊</div>
                    <div class="card-content">
                      <label>课程难度</label>
                      <div class="value">{{ course.difficulty }}</div>
                    </div>
                  </div>
                  <div class="detail-card">
                    <div class="card-icon">⏱️</div>
                    <div class="card-content">
                      <label>课程时长</label>
                      <div class="value">{{ course.duration }}</div>
                    </div>
                  </div>
                  <div class="detail-card">
                    <div class="card-icon">📋</div>
                    <div class="card-content">
                      <label>前置要求</label>
                      <div class="value">{{ course.prerequisites }}</div>
                    </div>
                  </div>
                  <div class="detail-card">
                    <div class="card-icon">👥</div>
                    <div class="card-content">
                      <label>适合人群</label>
                      <div class="value">{{ course.targetAudience }}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="activeTab === 'reviews'" class="reviews-section">
                <h2>课程评价</h2>
                
                <div class="evaluations-list">
                  <h3>学员评价 ({{ course.reviews.length }})</h3>
                  <div v-if="course.reviews.length > 0" class="reviews-container">
                    <div v-for="(review, index) in course.reviews" :key="index" class="review-card">
                      <div class="review-header">
                        <div class="review-user">
                          <div class="user-avatar">{{ review.user.charAt(0) }}</div>
                          <span class="user-name">{{ review.user }}</span>
                        </div>
                        <div class="review-rating">
                          <span v-for="star in 5" :key="star" class="star" :class="{ active: star <= review.rating }">
                            ★
                          </span>
                        </div>
                      </div>
                      <div class="review-content">{{ review.content }}</div>
                      <div class="review-date">{{ review.date }}</div>
                    </div>
                  </div>
                  <div v-else class="no-reviews">
                    暂无评价，快来发表第一条评价吧！
                  </div>
                </div>

                <div class="evaluation-form">
                  <h3>发表评价</h3>
                  <div class="form-group">
                    <label>评分</label>
                    <div class="rating-stars">
                      <span 
                        v-for="star in 5" 
                        :key="star"
                        class="star"
                        :class="{ active: star <= newEvaluation.rating }"
                        @click="setRating(star)"
                      >
                        ★
                      </span>
                    </div>
                  </div>
                  <div class="form-group">
                    <label for="content">评价内容</label>
                    <textarea 
                      id="content" 
                      v-model="newEvaluation.content" 
                      placeholder="请分享您的学习体验..."
                      class="form-textarea"
                      rows="4"
                    ></textarea>
                  </div>
                  <button @click="submitEvaluation" class="btn-submit">提交评价</button>
                </div>
              </div>

              <div v-if="activeTab === 'register'" class="register-section">
                <h2>报名课程</h2>
                
                <div v-if="!authStore.isAuthenticated" class="login-prompt">
                  <div class="prompt-icon">🔒</div>
                  <h3>请先登录</h3>
                  <p>您需要登录后才能报名课程</p>
                  <button @click="goToLogin" class="btn-login">去登录</button>
                </div>

                <div v-else class="registration-form">
                  <div class="course-summary">
                    <img :src="course.image" :alt="course.name" class="course-thumbnail">
                    <div class="course-info">
                      <h3>{{ course.name }}</h3>
                      <div class="info-row">
                        <span class="label">课程类别：</span>
                        <span class="value">{{ course.category }}</span>
                      </div>
                      <div class="info-row">
                        <span class="label">课程难度：</span>
                        <span class="value">{{ course.difficulty }}</span>
                      </div>
                      <div class="info-row">
                        <span class="label">课程时长：</span>
                        <span class="value">{{ course.duration }}</span>
                      </div>
                      <div class="info-row">
                        <span class="label">课程价格：</span>
                        <span class="value price">¥{{ course.price }}</span>
                      </div>
                    </div>
                  </div>

                  <form @submit.prevent="submitRegistration">
                    <div class="form-group">
                      <label for="name">真实姓名 *</label>
                      <input 
                        type="text" 
                        id="name" 
                        v-model="formData.name" 
                        placeholder="请输入您的真实姓名"
                        class="form-input"
                        required
                      >
                    </div>

                    <div class="form-group">
                      <label for="phone">联系电话 *</label>
                      <input 
                        type="tel" 
                        id="phone" 
                        v-model="formData.phone" 
                        placeholder="请输入您的联系电话"
                        class="form-input"
                        required
                      >
                    </div>

                    <div class="form-group">
                      <label for="email">电子邮箱 *</label>
                      <input 
                        type="email" 
                        id="email" 
                        v-model="formData.email" 
                        placeholder="请输入您的电子邮箱"
                        class="form-input"
                        required
                      >
                    </div>

                    <div class="form-group">
                      <label for="experience">户外运动经验</label>
                      <textarea 
                        id="experience" 
                        v-model="formData.experience" 
                        placeholder="请简单描述您的户外运动经验（选填）"
                        class="form-textarea"
                        rows="3"
                      ></textarea>
                    </div>

                    <div class="form-group">
                      <label for="notes">备注信息</label>
                      <textarea 
                        id="notes" 
                        v-model="formData.notes" 
                        placeholder="其他需要说明的信息（选填）"
                        class="form-textarea"
                        rows="2"
                      ></textarea>
                    </div>

                    <div class="payment-section">
                      <h4>支付方式</h4>
                      <div class="payment-methods">
                        <label class="payment-method" :class="{ active: formData.paymentMethod === 'points' }">
                          <input type="radio" v-model="formData.paymentMethod" value="points">
                          <div class="method-info">
                            <span class="method-name">积分支付</span>
                            <span class="method-desc">当前积分：{{ authStore.points }}</span>
                          </div>
                        </label>
                        <label class="payment-method" :class="{ active: formData.paymentMethod === 'wechat' }">
                          <input type="radio" v-model="formData.paymentMethod" value="wechat">
                          <div class="method-info">
                            <span class="method-name">微信支付</span>
                            <span class="method-desc">使用微信扫码支付</span>
                          </div>
                        </label>
                        <label class="payment-method" :class="{ active: formData.paymentMethod === 'alipay' }">
                          <input type="radio" v-model="formData.paymentMethod" value="alipay">
                          <div class="method-info">
                            <span class="method-name">支付宝支付</span>
                            <span class="method-desc">使用支付宝扫码支付</span>
                          </div>
                        </label>
                      </div>
                    </div>

                    <div class="total-price">
                      <span>课程总价：</span>
                      <span class="price">¥{{ course.price }}</span>
                    </div>

                    <button type="submit" class="btn-submit">确认报名</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="course-not-found">
            <h2>课程未找到</h2>
            <p>抱歉，您查找的课程不存在。</p>
            <button class="btn-back" @click="goBack">返回首页</button>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { courses } from '../data/courseData';
import { useAuthStore } from '../stores/authStore';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const courseId = parseInt(route.params.id);
const course = ref(null);
const activeTab = ref('overview');

const newEvaluation = ref({
  user: authStore.user?.username || '',
  rating: 0,
  content: ''
});

const formData = ref({
  name: '',
  phone: '',
  email: '',
  experience: '',
  notes: '',
  paymentMethod: 'points'
});

const descriptionParagraphs = computed(() => {
  if (!course.value) return [];
  return course.value.detailedDescription.split('\n\n').filter(p => p.trim());
});

const setRating = (rating) => {
  newEvaluation.value.rating = rating;
};

const submitEvaluation = () => {
  if (!authStore.isAuthenticated) {
    alert('请先登录');
    return;
  }
  if (newEvaluation.value.rating === 0) {
    alert('请选择评分');
    return;
  }
  if (!newEvaluation.value.content.trim()) {
    alert('请输入评价内容');
    return;
  }

  const review = {
    user: authStore.user.username,
    rating: newEvaluation.value.rating,
    content: newEvaluation.value.content,
    date: new Date().toISOString().split('T')[0]
  };

  course.value.reviews.unshift(review);
  
  newEvaluation.value = {
    user: authStore.user.username,
    rating: 0,
    content: ''
  };

  alert('评价提交成功！');
};

const submitRegistration = () => {
  if (!authStore.isAuthenticated) {
    alert('请先登录');
    return;
  }

  if (!formData.value.name.trim()) {
    alert('请输入真实姓名');
    return;
  }

  if (!formData.value.phone.trim()) {
    alert('请输入联系电话');
    return;
  }

  if (!formData.value.email.trim()) {
    alert('请输入电子邮箱');
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.value.email)) {
    alert('请输入有效的电子邮箱地址');
    return;
  }

  if (formData.value.paymentMethod === 'points') {
    if (authStore.points < course.value.price) {
      alert('您的积分不足，请先充值');
      return;
    }
    try {
      authStore.deductPoints(course.value.price);
    } catch (error) {
      alert(error.message);
      return;
    }
  }

  try {
    authStore.joinCourse(course.value, formData.value);
    alert('课程报名成功！');
    formData.value = {
      name: '',
      phone: '',
      email: '',
      experience: '',
      notes: '',
      paymentMethod: 'points'
    };
  } catch (error) {
    alert(error.message);
  }
};

const goToLogin = () => {
  router.push('/login');
};

const goBack = () => {
  router.push('/');
  setTimeout(() => {
    window.scrollTo(0, 0);
  }, 100);
};

onMounted(() => {
  course.value = courses.find(c => c.id === courseId);
  if (course.value) {
    window.scrollTo(0, 0);
  }
  
  refreshInterval = setInterval(async () => {
    await refreshUserData();
  }, 30000);
});

onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
  }
});

const refreshUserData = async () => {
  try {
    await authStore.initAuth();
  } catch (error) {
    console.error('刷新用户数据失败:', error);
  }
};

let refreshInterval = null;
</script>

<style scoped>
.course-detail-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding-top: 80px;
}

.page-container {
  display: flex;
  min-height: calc(100vh - 80px);
  max-width: 1440px;
  margin: 0 auto;
  width: 100%;
}

.sidebar {
  width: 280px;
  flex-shrink: 0;
  background: white;
  border-right: 1px solid #e9ecef;
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 80px;
  height: calc(100vh - 80px);
  overflow-y: auto;
}

.sidebar-header {
  padding: 30px 20px;
  border-bottom: 1px solid #e9ecef;
  text-align: center;
}

.logo img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-bottom: 10px;
}

.brand-name {
  margin: 0;
  font-size: 16px;
  color: #667eea;
  font-weight: 600;
}

.sidebar-nav {
  flex: 1;
  padding: 20px 0;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px 25px;
  cursor: pointer;
  transition: all 0.3s;
  color: #495057;
  font-size: 15px;
  margin: 5px 15px;
  border-radius: 8px;
}

.nav-item:hover {
  background: #f8f9fa;
  color: #667eea;
}

.nav-item.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.nav-item.back {
  margin-top: auto;
  color: #667eea;
}

.nav-item.back:hover {
  background: #667eea;
  color: white;
}

.icon {
  font-size: 18px;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
  z-index: 1;
}

.content-wrapper {
  flex: 1;
  padding: 30px 40px;
  overflow-y: auto;
}

.course-detail {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.course-header {
  position: relative;
  margin-bottom: 30px;
}

.course-banner {
  width: 100%;
  height: 300px;
  overflow: hidden;
  border-radius: 15px 15px 0 0;
}

.course-banner img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.course-title-section {
  padding: 30px 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.course-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.course-meta {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
}

.meta-icon {
  font-size: 1.3rem;
}

.tab-content {
  padding: 30px 40px;
}

.overview-section,
.details-section,
.reviews-section,
.register-section {
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.overview-section h2,
.details-section h2,
.reviews-section h2,
.register-section h2 {
  font-size: 1.8rem;
  color: #2c3e50;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 3px solid #667eea;
}

.course-description {
  line-height: 1.8;
  color: #555;
}

.description-paragraph {
  margin-bottom: 1.5rem;
  text-indent: 2em;
}

.course-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.detail-card {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 2rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.detail-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.2);
}

.card-icon {
  font-size: 3rem;
  flex-shrink: 0;
}

.card-content {
  flex: 1;
}

.card-content label {
  display: block;
  font-weight: 600;
  color: #7f8c8d;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.card-content .value {
  font-size: 1.2rem;
  color: #2c3e50;
  font-weight: 500;
}

.evaluation-form {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 2rem;
  border-radius: 12px;
  margin-bottom: 3rem;
}

.evaluation-form h3 {
  font-size: 1.5rem;
  color: #2c3e50;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #2c3e50;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 0.8rem;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #667eea;
}

.rating-stars {
  display: flex;
  gap: 0.5rem;
}

.star {
  font-size: 2rem;
  color: #ddd;
  cursor: pointer;
  transition: color 0.2s ease;
}

.star:hover {
  color: #f1c40f;
}

.star.active {
  color: #f1c40f;
}

.btn-submit {
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.btn-submit:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.evaluations-list {
  margin-top: 3rem;
}

.evaluations-list h3 {
  font-size: 1.5rem;
  color: #2c3e50;
  margin-bottom: 2rem;
}

.reviews-container {
  display: grid;
  gap: 1.5rem;
}

.review-card {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 1.5rem;
  border-radius: 12px;
  transition: box-shadow 0.3s ease;
}

.review-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.review-user {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.2rem;
}

.user-name {
  font-weight: 600;
  color: #2c3e50;
}

.review-rating .star {
  font-size: 1.2rem;
}

.review-content {
  color: #555;
  line-height: 1.6;
  margin-bottom: 0.8rem;
}

.review-date {
  color: #999;
  font-size: 0.9rem;
}

.no-reviews {
  text-align: center;
  padding: 3rem;
  color: #999;
  font-size: 1.1rem;
}

.login-prompt {
  text-align: center;
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
}

.prompt-icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
}

.login-prompt h3 {
  font-size: 1.8rem;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.login-prompt p {
  color: #7f8c8d;
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

.btn-login {
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.btn-login:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.registration-form {
  max-width: 800px;
  margin: 0 auto;
}

.course-summary {
  display: flex;
  gap: 2rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 2rem;
  border-radius: 12px;
  margin-bottom: 2rem;
}

.course-thumbnail {
  width: 200px;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
}

.course-info {
  flex: 1;
}

.course-info h3 {
  font-size: 1.5rem;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.info-row {
  display: flex;
  margin-bottom: 0.5rem;
}

.info-row .label {
  font-weight: 600;
  color: #7f8c8d;
  min-width: 100px;
}

.info-row .value {
  color: #2c3e50;
}

.info-row .value.price {
  color: #e74c3c;
  font-weight: 700;
  font-size: 1.2rem;
}

.payment-section {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 2rem;
  border-radius: 12px;
  margin-bottom: 2rem;
}

.payment-section h4 {
  font-size: 1.2rem;
  color: #2c3e50;
  margin-bottom: 1.5rem;
}

.payment-methods {
  display: grid;
  gap: 1rem;
}

.payment-method {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.payment-method:hover {
  border-color: #667eea;
}

.payment-method.active {
  border-color: #667eea;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
}

.payment-method input[type="radio"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.method-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.method-name {
  font-weight: 600;
  color: #2c3e50;
}

.method-desc {
  font-size: 0.9rem;
  color: #7f8c8d;
}

.total-price {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
  margin-bottom: 2rem;
  font-size: 1.2rem;
  color: #2c3e50;
}

.total-price .price {
  color: #e74c3c;
  font-weight: 700;
  font-size: 1.8rem;
}

.course-not-found {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.course-not-found h2 {
  font-size: 2rem;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.course-not-found p {
  color: #7f8c8d;
  margin-bottom: 2rem;
}

.btn-back {
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.btn-back:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

@media (max-width: 768px) {
  .page-container {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    height: auto;
    position: relative;
    top: 0;
  }

  .main-content {
    min-width: 100%;
  }

  .content-wrapper {
    padding: 20px;
  }

  .course-banner {
    height: 200px;
  }

  .course-title {
    font-size: 1.8rem;
  }

  .course-meta {
    gap: 1rem;
  }

  .meta-item {
    font-size: 1rem;
  }

  .tab-content {
    padding: 20px;
  }

  .course-details {
    grid-template-columns: 1fr;
  }

  .review-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>
