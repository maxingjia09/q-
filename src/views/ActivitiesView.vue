<script setup>
import { ref, computed } from 'vue';
import { useAuthStore } from '../stores/authStore';
import { resolveImageUrl } from '../utils/imageUtils';
import { hikingRoutes, mountainExpeditions } from '../data/activityData';
import { clubs } from '../data/clubData';
import headerBgImg from '@/assets/ga.jpg';

const authStore = useAuthStore();
const headerStyle = { backgroundImage: `linear-gradient(135deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.4)), url(${headerBgImg})` };

// 直接使用静态数据，不依赖后端API
const hiking = hikingRoutes.map(a => ({ ...a, type: 'hiking' }));
const mountain = mountainExpeditions.map(a => ({ ...a, type: 'mountain' }));
const activityList = [...hiking, ...mountain];
const clubList = clubs;

// 活动类型切换
const activityTab = ref('hiking');
const tabs = [
  { id: 'hiking', name: '徒步活动' },
  { id: 'mountain', name: '雪山攀登' }
];

const filteredActivities = computed(() => {
  if (activityTab.value === 'hiking') return activityList.filter(a => a.type === 'hiking');
  if (activityTab.value === 'mountain') return activityList.filter(a => a.type === 'mountain');
  return activityList;
});

// 报名弹窗
const showModal = ref(false);
const showPaymentModal = ref(false);
const showDetailModal = ref(false);
const selectedActivity = ref(null);
const formData = ref({ name: '', phone: '', email: '', experience: '', club: '' });

const availableClubs = computed(() => {
  if (!selectedActivity.value) return [];
  const activityName = selectedActivity.value.name;
  return clubList.filter(club =>
    club.allRoutes && club.allRoutes.some(route => route.name === activityName)
  );
});

const selectedPaymentMethod = ref('');
const usePoints = ref(false);
const pointsToUse = ref(0);
const isProcessingPayment = ref(false);

const showJoinModal = (activity) => {
  selectedActivity.value = activity;
  showModal.value = true;
  const info = authStore.personalInfo;
  formData.value = { name: info.name || '', phone: info.phone || '', email: info.email || '', experience: info.experience || '', club: '' };
};
const showActivityDetail = (activity) => { selectedActivity.value = activity; showDetailModal.value = true; };
const closeModal = () => { showModal.value = false; selectedActivity.value = null; };
const closeDetailModal = () => { showDetailModal.value = false; selectedActivity.value = null; };
const closePaymentModal = () => { showPaymentModal.value = false; selectedPaymentMethod.value = ''; usePoints.value = false; pointsToUse.value = 0; };
const openPaymentModal = () => {
  if (!formData.value.name || !formData.value.phone) { alert('请填写姓名和手机号'); return; }
  showPaymentModal.value = true;
  pointsToUse.value = authStore.points;
};
const confirmPayment = async () => {
  try {
    isProcessingPayment.value = true;
    await new Promise(resolve => setTimeout(resolve, 1500));
    if (usePoints.value && pointsToUse.value > 0) authStore.deductPoints(pointsToUse.value);
    authStore.joinActivity(selectedActivity.value, { ...formData.value, paymentMethod: selectedPaymentMethod.value, usePoints: usePoints.value, pointsToUse: pointsToUse.value });
    alert(`报名成功！`);
    closePaymentModal(); closeModal();
  } catch (error) { alert(error.message); }
  finally { isProcessingPayment.value = false; }
};
const submitForm = () => {
  if (!authStore.isAuthenticated) { alert('请先登录后再报名活动'); return; }
  openPaymentModal();
};
</script>

<template>
  <div class="activities-page">
    <div class="page-header" :style="headerStyle">
      <div class="container">
        <h1 class="page-title">活动报名</h1>
        <p class="page-description">探索精彩户外活动，开启您的冒险之旅</p>
      </div>
    </div>
    <div class="container">
      <div class="activity-tabs">
        <button v-for="tab in tabs" :key="tab.id" :class="['tab-button', { active: activityTab === tab.id }]" @click="activityTab = tab.id">{{ tab.name }}</button>
      </div>
      <div class="activity-content">
        <div class="category-section">
          <h3 class="category-title">{{ activityTab === 'hiking' ? '徒步活动' : '雪山攀登' }}</h3>
          <div v-if="filteredActivities.length === 0" class="empty-state"><p>暂无活动数据</p></div>
          <div v-else class="route-grid">
            <div v-for="activity in filteredActivities" :key="activity.id" class="route-card">
              <div class="route-image"><img :src="resolveImageUrl(activity.image)" :alt="activity.name"></div>
              <div class="route-content">
                <h4 class="route-name">{{ activity.name }}</h4>
                <p class="route-location">{{ activity.location }}</p>
                <p class="route-description">{{ (activity.description || '').substring(0, 100) }}...</p>
                <div class="route-details">
                  <span class="detail-item">{{ activity.difficulty }}</span>
                  <span class="detail-item">{{ activity.duration }}</span>
                  <span v-if="activity.price" class="detail-item price-tag">¥{{ activity.price }}</span>
                </div>
                <div class="activity-buttons">
                  <button class="detail-btn" @click="showActivityDetail(activity)">了解详情</button>
                  <button class="btn-join" @click="showJoinModal(activity)">立即报名</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 报名弹窗 -->
    <div v-if="showModal" class="join-modal" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header"><h3>报名参加：{{ selectedActivity?.name }}</h3><button class="close-button" @click="closeModal">×</button></div>
        <div class="modal-body">
          <div class="form-group"><label for="name">姓名：</label><input type="text" id="name" v-model="formData.name" placeholder="请输入您的姓名"></div>
          <div class="form-group"><label for="phone">手机号：</label><input type="tel" id="phone" v-model="formData.phone" placeholder="请输入您的手机号"></div>
          <div class="form-group"><label for="email">邮箱：</label><input type="email" id="email" v-model="formData.email" placeholder="请输入您的邮箱"></div>
          <div class="form-group"><label for="club">选择俱乐部：</label><select id="club" v-model="formData.club"><option value="">请选择俱乐部</option><option v-for="club in availableClubs" :key="club.id" :value="club.name">{{ club.name }}</option></select></div>
          <div class="form-group"><label for="experience">经验描述：</label><textarea id="experience" v-model="formData.experience" placeholder="请描述您的相关经验"></textarea></div>
        </div>
        <div class="modal-footer"><button class="btn-cancel" @click="closeModal">取消</button><button class="btn-submit" @click="submitForm">提交报名</button></div>
      </div>
    </div>

    <!-- 支付弹窗 -->
    <div v-if="showPaymentModal" class="join-modal" @click="closePaymentModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header"><h3>选择支付方式</h3><button class="close-button" @click="closePaymentModal">×</button></div>
        <div class="modal-body">
          <div class="payment-options">
            <div class="payment-option"><input type="checkbox" id="use-points" v-model="usePoints"><label for="use-points">使用积分抵扣</label><div v-if="usePoints" class="points-input-group"><span>可用积分：{{ authStore.points }}</span><input type="number" v-model.number="pointsToUse" min="0" :max="authStore.points" placeholder="输入抵扣积分"></div></div>
            <div class="payment-methods"><h4>支付方式</h4><div class="payment-method"><input type="radio" id="wechat" name="payment-method" value="wechat" v-model="selectedPaymentMethod"><label for="wechat">微信支付</label></div><div class="payment-method"><input type="radio" id="alipay" name="payment-method" value="alipay" v-model="selectedPaymentMethod"><label for="alipay">支付宝支付</label></div></div>
          </div>
        </div>
        <div class="modal-footer"><button class="btn-cancel" @click="closePaymentModal" :disabled="isProcessingPayment">取消</button><button class="btn-submit" @click="confirmPayment" :disabled="!selectedPaymentMethod || isProcessingPayment">{{ isProcessingPayment ? '处理中...' : '确认支付' }}</button></div>
      </div>
    </div>

    <!-- 详情弹窗 -->
    <div v-if="showDetailModal && selectedActivity" class="join-modal" @click="closeDetailModal">
      <div class="modal-content detail-modal-content" @click.stop>
        <div class="modal-header"><h3>{{ selectedActivity?.name }}</h3><button class="close-button" @click="closeDetailModal">×</button></div>
        <div class="modal-body detail-modal-body">
          <div class="detail-image"><img :src="resolveImageUrl(selectedActivity?.image)" :alt="selectedActivity?.name" class="activity-image"></div>
          <div class="detail-info">
            <p class="detail-location"><strong>地点：</strong>{{ selectedActivity?.location }}</p>
            <div class="detail-description"><strong>描述：</strong><br><div v-html="selectedActivity?.description"></div></div>
            <div class="detail-specifics">
              <div v-if="selectedActivity?.difficulty" class="detail-item"><strong>难度：</strong>{{ selectedActivity?.difficulty }}</div>
              <div v-if="selectedActivity?.duration" class="detail-item"><strong>时长：</strong>{{ selectedActivity?.duration }}</div>
              <div v-if="selectedActivity?.price" class="detail-item"><strong>价格：</strong>¥{{ selectedActivity?.price }}</div>
              <div v-if="selectedActivity?.height" class="detail-item"><strong>高度：</strong>{{ selectedActivity?.height }}</div>
              <div v-if="selectedActivity?.altitude" class="detail-item"><strong>海拔：</strong>{{ selectedActivity?.altitude }}</div>
            </div>
            <div class="reviews-section"><h4>游客评价</h4>
              <div v-if="selectedActivity?.reviews && selectedActivity.reviews.length > 0" class="reviews-list">
                <div v-for="(review, index) in selectedActivity.reviews" :key="index" class="review-item">
                  <div class="review-header"><div class="review-user"><div class="user-avatar">{{ review.user.charAt(0) }}</div><div class="user-info"><div class="user-name">{{ review.user }}</div><div class="review-date">{{ review.date }}</div></div></div><div class="review-rating"><span v-for="star in 5" :key="star" :class="{ active: star <= review.rating }">★</span></div></div>
                  <div class="review-content">{{ review.content }}</div>
                </div>
              </div>
              <div v-else class="no-reviews">暂无评价</div>
            </div>
          </div>
        </div>
        <div class="modal-footer"><button class="btn-cancel" @click="closeDetailModal">关闭</button><button class="btn-join" @click="() => { closeDetailModal(); showJoinModal(selectedActivity); }">立即报名</button></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.activities-page { min-height: 100vh; padding-bottom: 5rem; }
.page-header { background-size: cover; background-position: center; padding: 6rem 0 4rem; text-align: center; color: white; }
.page-title { font-size: 3rem; margin-bottom: 1rem; text-shadow: 2px 2px 4px rgba(0,0,0,0.5); }
.page-description { font-size: 1.2rem; opacity: 0.9; }
.container { max-width: 1600px; margin: 0 auto; padding: 0 2rem; }
.empty-state { text-align: center; padding: 4rem 0; color: rgba(255,255,255,0.7); font-size: 1.1rem; }
.price-tag { background-color: #fff3e0; color: #e65100; }
.activity-tabs { display: flex; justify-content: center; margin: 3rem 0; gap: 2rem; }
.tab-button { padding: 1rem 2.5rem; border: none; background-color: rgba(255,255,255,0.9); color: #2c3e50; font-size: 1.2rem; cursor: pointer; border-radius: 30px; font-weight: 500; transition: all 0.3s ease; }
.tab-button:hover { background-color: #3498db; color: white; transform: translateY(-2px); }
.tab-button.active { background-color: #3498db; color: white; box-shadow: 0 4px 15px rgba(52,152,219,0.4); }
.activity-content { animation: fadeIn 0.5s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
.category-title { font-size: 1.8rem; color: #fff; margin-bottom: 2rem; text-align: center; text-shadow: 1px 1px 3px rgba(0,0,0,0.8); }
.route-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2rem; margin-top: 2rem; }
.route-card { background-color: rgba(255,255,255,0.95); border-radius: 12px; overflow: hidden; box-shadow: 0 8px 20px rgba(0,0,0,0.2); transition: transform 0.3s ease, box-shadow 0.3s ease; }
.route-card:hover { transform: translateY(-5px); box-shadow: 0 12px 25px rgba(0,0,0,0.15); }
.route-image { height: 200px; overflow: hidden; }
.route-image img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
.route-card:hover .route-image img { transform: scale(1.05); }
.route-content { padding: 1.5rem; }
.route-name { font-size: 1.4rem; color: #2c3e50; margin-bottom: 0.5rem; }
.route-location { color: #3498db; font-size: 1rem; margin-bottom: 1rem; }
.route-description { color: #666; line-height: 1.6; margin-bottom: 1.5rem; }
.route-details { display: flex; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
.detail-item { background-color: #f0f8ff; color: #3498db; padding: 0.4rem 0.8rem; border-radius: 20px; font-size: 0.9rem; }
.activity-buttons { display: flex; gap: 10px; margin-top: 15px; }
.detail-btn { flex: 1; background-color: #e0e0e0; color: #333; border: none; padding: 10px; border-radius: 4px; cursor: pointer; font-weight: bold; transition: background-color 0.3s ease; }
.detail-btn:hover { background-color: #d0d0d0; }
.btn-join { width: 100%; padding: 0.8rem; background-color: #3498db; color: white; border: none; border-radius: 6px; font-size: 1rem; font-weight: 500; cursor: pointer; transition: background-color 0.3s ease; }
.btn-join:hover { background-color: #2980b9; }
.join-modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.7); display: flex; justify-content: center; align-items: center; z-index: 1000; animation: fadeIn 0.3s ease; }
.modal-content { background-color: white; border-radius: 12px; width: 90%; max-width: 600px; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 40px rgba(0,0,0,0.2); animation: slideIn 0.3s ease; }
@keyframes slideIn { from { opacity: 0; transform: translateY(-30px); } to { opacity: 1; transform: translateY(0); } }
.modal-header { padding: 1.5rem; border-bottom: 1px solid #e0e0e0; display: flex; justify-content: space-between; align-items: center; }
.modal-header h3 { margin: 0; color: #2c3e50; }
.close-button { background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #999; }
.close-button:hover { color: #2c3e50; }
.modal-body { padding: 1.5rem; }
.form-group { margin-bottom: 1.5rem; }
.form-group label { display: block; margin-bottom: 0.5rem; color: #2c3e50; font-weight: 500; }
.form-group input, .form-group textarea, .form-group select { width: 100%; padding: 0.8rem; border: 1px solid #e0e0e0; border-radius: 6px; font-size: 1rem; }
.form-group input:focus, .form-group textarea:focus, .form-group select:focus { outline: none; border-color: #3498db; }
.form-group textarea { resize: vertical; min-height: 100px; }
.modal-footer { padding: 1.5rem; border-top: 1px solid #e0e0e0; display: flex; justify-content: flex-end; gap: 1rem; }
.btn-cancel, .btn-submit { padding: 0.8rem 1.5rem; border: none; border-radius: 6px; font-size: 1rem; cursor: pointer; }
.btn-cancel { background-color: #e0e0e0; color: #666; }
.btn-submit { background-color: #3498db; color: white; }
.payment-options { display: flex; flex-direction: column; gap: 2rem; }
.payment-option { display: flex; flex-direction: column; gap: 1rem; padding: 1rem; background-color: #f9f9f9; border-radius: 8px; }
.points-input-group { display: flex; align-items: center; gap: 1rem; padding: 0.5rem 0; }
.points-input-group span { color: #3498db; font-weight: 500; }
.points-input-group input { padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px; width: 100px; }
.payment-methods h4 { margin-bottom: 1rem; color: #2c3e50; }
.payment-method { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem; padding: 0.5rem; border-radius: 4px; }
.payment-method:hover { background-color: #f0f8ff; }
.detail-modal-content { max-width: 700px; }
.detail-modal-body { display: flex; flex-direction: column; gap: 20px; }
.detail-image { width: 100%; border-radius: 8px; overflow: hidden; }
.detail-image img { width: 100%; height: auto; object-fit: cover; border-radius: 8px; }
.detail-info { display: flex; flex-direction: column; gap: 15px; }
.detail-location { font-size: 18px; color: #666; }
.detail-description { font-size: 16px; line-height: 1.6; }
.detail-specifics { display: flex; flex-wrap: wrap; gap: 20px; margin-top: 10px; }
.detail-specifics .detail-item { background-color: #f0f8ff; color: #3498db; padding: 8px 15px; border-radius: 20px; font-size: 14px; }
.reviews-section { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; }
.reviews-section h4 { margin: 0 0 20px 0; font-size: 18px; color: #2c3e50; }
.reviews-list { display: flex; flex-direction: column; gap: 15px; }
.review-item { background: #f8f9fa; padding: 15px; border-radius: 8px; }
.review-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.review-user { display: flex; align-items: center; gap: 10px; }
.user-avatar { width: 40px; height: 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 14px; }
.user-info .user-name { font-weight: bold; color: #2c3e50; font-size: 14px; }
.user-info .review-date { font-size: 12px; color: #999; }
.review-rating { display: flex; gap: 2px; }
.review-rating span { color: #e0e0e0; font-size: 16px; }
.review-rating span.active { color: #ffc107; }
.review-content { color: #555; line-height: 1.6; font-size: 14px; }
.no-reviews { text-align: center; color: #999; padding: 30px; }
@media (max-width: 1200px) { .route-grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 900px) { .route-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 768px) { .page-title { font-size: 2rem; } .activity-tabs { flex-direction: column; align-items: center; gap: 1rem; } .route-grid { grid-template-columns: 1fr; } }
</style>
