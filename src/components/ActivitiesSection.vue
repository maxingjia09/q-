<template>
  <section id="activities" class="activities-section">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">活动报名</h2>
        <div class="section-divider"></div>
      </div>

      <!-- 活动类型切换 -->
      <div class="activity-tabs">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          :class="['tab-button', { active: activeTab === tab.id }]"
          @click="activeTab = tab.id"
        >
          {{ tab.name }}
        </button>
      </div>

      <!-- 徒步活动内容 -->
      <div v-if="activeTab === 'hiking'" class="activity-content">
        <div class="hiking-routes">
          <h3 class="category-title">国内经典徒步路线</h3>
          <div class="route-grid">
            <div v-for="route in hikingRoutes" :key="route.id" class="route-card">
            <div class="route-image">
              <img :src="route.image" :alt="route.name">
            </div>
            <div class="route-content">
              <h4 class="route-name">{{ route.name }}</h4>
              <p class="route-location">{{ route.location }}</p>
              <p class="route-description">{{ route.description.substring(0, 100) }}...</p>
              <div class="route-details">
                <span class="detail-item">{{ route.difficulty }}</span>
                <span class="detail-item">{{ route.duration }}</span>
              </div>
              <div class="activity-buttons">
                <button class="detail-btn" @click="showActivityDetail(route)">了解详情</button>
                <button class="btn-join" @click="showJoinModal(route)">立即报名</button>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>

      <!-- 攀登活动内容 -->
      <div v-else-if="activeTab === 'climbing'" class="activity-content">
        <div class="climbing-tabs">
          <button 
            v-for="tab in climbingTabs" 
            :key="tab.id"
            :class="['climbing-tab-button', { active: activeClimbingTab === tab.id }]"
            @click="activeClimbingTab = tab.id"
          >
            {{ tab.name }}
          </button>
        </div>

        <!-- 攀岩活动 -->
        <div v-if="activeClimbingTab === 'rock'" class="climbing-content">
          <div class="rock-climbing-spots">
            <h3 class="category-title">攀岩场地与活动</h3>
            <div class="route-grid">
             <div v-for="spot in rockClimbingSpots" :key="spot.id" class="route-card">
               <div class="route-image">
                 <img :src="spot.image" :alt="spot.name">
               </div>
               <div class="route-content">
                 <h4 class="route-name">{{ spot.name }}</h4>
                 <p class="route-location">{{ spot.location }}</p>
                 <p class="route-description">{{ spot.description.substring(0, 100) }}...</p>
                 <div class="route-details">
                   <span class="detail-item">{{ spot.difficulty }}</span>
                   <span class="detail-item">{{ spot.height }}</span>
                 </div>
                 <div class="activity-buttons">
                   <button class="detail-btn" @click="showActivityDetail(spot)">了解详情</button>
                   <button class="btn-join" @click="showJoinModal(spot)">立即报名</button>
                 </div>
               </div>
             </div>
            </div>
          </div>
        </div>

        <!-- 雪山攀登活动 -->
        <div v-else-if="activeClimbingTab === 'mountain'" class="climbing-content">
          <div class="mountain-expeditions">
            <h3 class="category-title">雪山攀登探险</h3>
            <div class="route-grid">
             <div v-for="expedition in mountainExpeditions" :key="expedition.id" class="route-card">
               <div class="route-image">
                 <img :src="expedition.image" :alt="expedition.name">
               </div>
               <div class="route-content">
                 <h4 class="route-name">{{ expedition.name }}</h4>
                 <p class="route-location">{{ expedition.location }}</p>
                 <p class="route-description">{{ expedition.description.substring(0, 100) }}...</p>
                 <div class="route-details">
                   <span class="detail-item">{{ expedition.altitude }}</span>
                   <span class="detail-item">{{ expedition.duration }}</span>
                 </div>
                 <div class="activity-buttons">
                   <button class="detail-btn" @click="showActivityDetail(expedition)">了解详情</button>
                   <button class="btn-join" @click="showJoinModal(expedition)">立即报名</button>
                 </div>
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
        <div class="modal-header">
          <h3>报名参加：{{ selectedActivity?.name }}</h3>
          <button class="close-button" @click="closeModal">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="name">姓名：</label>
            <input type="text" id="name" v-model="formData.name" placeholder="请输入您的姓名">
          </div>
          <div class="form-group">
            <label for="phone">手机号：</label>
            <input type="tel" id="phone" v-model="formData.phone" placeholder="请输入您的手机号">
          </div>
          <div class="form-group">
            <label for="email">邮箱：</label>
            <input type="email" id="email" v-model="formData.email" placeholder="请输入您的邮箱">
          </div>
          <div class="form-group">
            <label for="club">选择俱乐部：</label>
            <select id="club" v-model="formData.club">
              <option value="">请选择俱乐部</option>
              <option v-for="club in availableClubs" :key="club.id" :value="club.name">
                {{ club.name }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label for="experience">经验描述：</label>
            <textarea id="experience" v-model="formData.experience" placeholder="请描述您的相关经验"></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="closeModal">取消</button>
          <button class="btn-submit" @click="submitForm">提交报名</button>
        </div>
      </div>
    </div>

    <!-- 支付方式选择弹窗 -->
    <div v-if="showPaymentModal" class="join-modal" @click="closePaymentModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>选择支付方式</h3>
          <button class="close-button" @click="closePaymentModal">×</button>
        </div>
        <div class="modal-body">
          <div class="payment-options">
            <!-- 积分抵扣选项 -->
            <div class="payment-option">
              <input type="checkbox" id="use-points" v-model="usePoints">
              <label for="use-points">使用积分抵扣</label>
              <div v-if="usePoints" class="points-input-group">
                <span>可用积分：{{ authStore.points }}</span>
                <input type="number" v-model.number="pointsToUse" min="0" :max="authStore.points" placeholder="输入抵扣积分">
              </div>
            </div>

            <!-- 支付方式选择 -->
            <div class="payment-methods">
              <h4>支付方式</h4>
              <div class="payment-method">
                <input type="radio" id="wechat" name="payment-method" value="wechat" v-model="selectedPaymentMethod">
                <label for="wechat">微信支付</label>
              </div>
              <div class="payment-method">
                <input type="radio" id="alipay" name="payment-method" value="alipay" v-model="selectedPaymentMethod">
                <label for="alipay">支付宝支付</label>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
            <button class="btn-cancel" @click="closePaymentModal" :disabled="isProcessingPayment">取消</button>
            <button class="btn-submit" @click="confirmPayment" :disabled="!selectedPaymentMethod || isProcessingPayment">
              {{ isProcessingPayment ? '处理中...' : '确认支付' }}
            </button>
          </div>
      </div>
    </div>
    
    <!-- 活动详情弹窗 -->
    <div v-if="showDetailModal && selectedActivity" class="join-modal" @click="closeDetailModal">
      <div class="modal-content detail-modal-content" @click.stop style="max-width: 700px; width: 90%; background: white; color: black; padding: 20px; border-radius: 8px;">
        <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <h3 style="margin: 0;">{{ selectedActivity?.name }}</h3>
          <button class="close-button" @click="closeDetailModal" style="background: none; border: none; font-size: 24px; cursor: pointer;">×</button>
        </div>
        <div class="modal-body detail-modal-body">
          <div class="detail-image" style="margin-bottom: 20px;">
            <img :src="selectedActivity?.image" :alt="selectedActivity?.name" class="activity-image" style="width: 100%; height: auto; border-radius: 8px;">
          </div>
          <div class="detail-info" style="display: flex; flex-direction: column; gap: 15px;">
            <p class="detail-location" style="font-size: 18px; margin: 0;"><strong>地点：</strong>{{ selectedActivity?.location }}</p>
            <div class="detail-description" style="font-size: 16px; line-height: 1.6; margin: 0;">
                <strong>描述：</strong><br>
                <div v-html="selectedActivity?.description"></div>
              </div>
            <div class="detail-specifics" style="margin-top: 10px;">
              <!-- 根据活动类型显示不同的具体信息 -->
              <div v-if="selectedActivity?.difficulty" class="detail-item" style="margin-right: 20px; margin-bottom: 10px;">
                <strong>难度：</strong>{{ selectedActivity?.difficulty }}
              </div>
              <div v-if="selectedActivity?.duration" class="detail-item" style="margin-right: 20px; margin-bottom: 10px;">
                <strong>时长：</strong>{{ selectedActivity?.duration }}
              </div>
              <div v-if="selectedActivity?.height" class="detail-item" style="margin-right: 20px; margin-bottom: 10px;">
                <strong>高度：</strong>{{ selectedActivity?.height }}
              </div>
              <div v-if="selectedActivity?.altitude" class="detail-item" style="margin-right: 20px; margin-bottom: 10px;">
                <strong>海拔：</strong>{{ selectedActivity?.altitude }}
              </div>
            </div>
            <div class="reviews-section" style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
              <h4 style="margin: 0 0 20px 0; font-size: 18px; color: #2c3e50;">游客评价</h4>
              <div v-if="selectedActivity?.reviews && selectedActivity.reviews.length > 0" class="reviews-list">
                <div v-for="(review, index) in selectedActivity.reviews" :key="index" class="review-item" style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                  <div class="review-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <div class="review-user" style="display: flex; align-items: center; gap: 10px;">
                      <div class="user-avatar" style="width: 40px; height: 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 14px;">
                        {{ review.user.charAt(0) }}
                      </div>
                      <div class="user-info">
                        <div class="user-name" style="font-weight: bold; color: #2c3e50; font-size: 14px;">{{ review.user }}</div>
                        <div class="review-date" style="font-size: 12px; color: #999;">{{ review.date }}</div>
                      </div>
                    </div>
                    <div class="review-rating" style="display: flex; gap: 2px;">
                      <span v-for="star in 5" :key="star" :style="{ color: star <= review.rating ? '#ffc107' : '#e0e0e0', fontSize: '16px' }">★</span>
                    </div>
                  </div>
                  <div class="review-content" style="color: #555; line-height: 1.6; font-size: 14px;">{{ review.content }}</div>
                </div>
              </div>
              <div v-else class="no-reviews" style="text-align: center; color: #999; padding: 30px;">
                暂无评价
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer" style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px;">
          <button class="btn-cancel" @click="closeDetailModal" style="padding: 10px 20px; background: #ccc; border: none; border-radius: 4px; cursor: pointer;">关闭</button>
          <button class="btn-join" @click="() => { closeDetailModal(); showJoinModal(selectedActivity); }" style="padding: 10px 20px; background: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer;">立即报名</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAuthStore } from '../stores/authStore';
// 导入活动数据
import { hikingRoutes, rockClimbingSpots, mountainExpeditions } from '../data/activityData.js';
// 导入俱乐部数据
import { clubs } from '../data/clubData.js';

const authStore = useAuthStore();

// 活动类型切换
const activeTab = ref('hiking');
const tabs = [
  { id: 'hiking', name: '徒步活动' },
  { id: 'climbing', name: '攀登活动' }
];

// 攀登活动子类型切换
const activeClimbingTab = ref('rock');
const climbingTabs = [
  { id: 'rock', name: '攀岩' },
  { id: 'mountain', name: '雪山' }
];

// 报名弹窗相关
const showModal = ref(false);
const showPaymentModal = ref(false);
const showDetailModal = ref(false); // 详情弹窗状态
const selectedActivity = ref(null);
const formData = ref({
  name: '',
  phone: '',
  email: '',
  experience: '',
  club: ''
});

// 根据选中的活动筛选出承接该活动的俱乐部
const availableClubs = computed(() => {
  if (!selectedActivity.value) return [];
  
  const activityName = selectedActivity.value.name;
  
  return clubs.filter(club => 
    club.allRoutes.some(route => route.name === activityName)
  );
});
const selectedPaymentMethod = ref('');
const usePoints = ref(false);
const pointsToUse = ref(0);
const isProcessingPayment = ref(false); // 支付处理状态

// 显示报名弹窗
const showJoinModal = (activity) => {
  selectedActivity.value = activity;
  showModal.value = true;
  // 自动填充个人资料
  const info = authStore.personalInfo;
  formData.value = {
    name: info.name || '',
    phone: info.phone || '',
    email: info.email || '',
    experience: info.experience || '',
    club: ''
  };
};

// 显示活动详情弹窗
const showActivityDetail = (activity) => {
  selectedActivity.value = activity;
  showDetailModal.value = true;
};

// 关闭报名弹窗
const closeModal = () => {
  showModal.value = false;
  selectedActivity.value = null;
};

// 关闭详情弹窗
const closeDetailModal = () => {
  showDetailModal.value = false;
  selectedActivity.value = null;
};

// 关闭支付弹窗
const closePaymentModal = () => {
  showPaymentModal.value = false;
  selectedPaymentMethod.value = '';
  usePoints.value = false;
  pointsToUse.value = 0;
};

// 打开支付弹窗
const openPaymentModal = () => {
  // 表单验证
  if (!formData.value.name || !formData.value.phone) {
    alert('请填写姓名和手机号');
    return;
  }
  showPaymentModal.value = true;
  // 初始化积分抵扣信息
  pointsToUse.value = authStore.points;
};

// 确认支付并完成报名
const confirmPayment = async () => {
  try {
    isProcessingPayment.value = true;
    
    // 模拟支付处理延迟
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    let pointsDeducted = 0;
    
    // 如果使用积分抵扣
    if (usePoints.value && pointsToUse.value > 0) {
      // 调用积分抵扣的方法
      pointsDeducted = authStore.deductPoints(pointsToUse.value);
      console.log(`使用积分抵扣: ${pointsToUse.value}，抵扣后剩余积分: ${pointsDeducted}`);
    }
    
    // 调用authStore的joinActivity方法
    authStore.joinActivity(selectedActivity.value, {
      ...formData.value,
      paymentMethod: selectedPaymentMethod.value,
      usePoints: usePoints.value,
      pointsToUse: pointsToUse.value
    });
    
    // 显示提交成功提示
    alert(`报名成功！您的活动已添加到个人中心。\n支付方式：${selectedPaymentMethod.value === 'wechat' ? '微信支付' : '支付宝支付'}${usePoints.value ? `，积分抵扣：${pointsToUse.value}` : ''}`);
    closePaymentModal();
    closeModal();
  } catch (error) {
    alert(error.message);
  } finally {
    isProcessingPayment.value = false;
  }
};

// 提交报名表单 - 打开支付选择弹窗
const submitForm = () => {
  // 检查用户是否已登录
  if (!authStore.isAuthenticated) {
    alert('请先登录后再报名活动');
    return;
  }
  
  // 打开支付方式选择弹窗
  openPaymentModal();
};
</script>

<style scoped>
.activities-section {
  padding: 5rem 0;
  background-color: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(5px);
  color: #ffffff;
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-title {
  font-size: 2.5rem;
  color: #ffffff;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.8);
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
  height: 2px;
  background-color: #ffffff;
}

.section-title::before {
  left: 0;
}

.section-title::after {
  right: 0;
}

.section-divider {
  width: 100px;
  height: 4px;
  background-color: #ffffff;
  margin: 0 auto;
  border-radius: 2px;
}

/* 活动类型切换 */
.activity-tabs {
  display: flex;
  justify-content: center;
  margin-bottom: 3rem;
  gap: 2rem;
}

.tab-button {
  padding: 1rem 2rem;
  border: none;
  background-color: transparent;
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  font-weight: 500;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
}

.tab-button:hover {
  color: #ffffff;
}

.tab-button.active {
  color: #ffffff;
}

.tab-button.active::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
  width: 50%;
  height: 3px;
  background-color: #ffffff;
  border-radius: 3px;
}

/* 活动内容容器 */
.activity-content {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 攀登活动子类型切换 */
.climbing-tabs {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  gap: 1.5rem;
}

.climbing-tab-button {
  padding: 0.8rem 1.5rem;
  border: 2px solid rgba(255, 255, 255, 0.5);
  background-color: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.9);
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 25px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
}

.climbing-tab-button:hover {
  border-color: #ffffff;
  color: #ffffff;
  background-color: rgba(255, 255, 255, 0.2);
}

.climbing-tab-button.active {
  background-color: rgba(255, 255, 255, 0.8);
  color: #2c3e50;
  border-color: #ffffff;
  text-shadow: none;
}

/* 分类标题 */
.category-title {
  font-size: 1.8rem;
  color: #ffffff;
  margin-bottom: 2rem;
  text-align: center;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.8);
}

/* 路线卡片网格 */
.route-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  margin-top: 2rem;
}

/* 路线卡片 */
.route-card {
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

/* 活动按钮样式 */
.activity-buttons {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.detail-btn {
  flex: 1;
  background-color: #e0e0e0;
  color: #333;
  border: none;
  padding: 10px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.detail-btn:hover {
  background-color: #d0d0d0;
}

.route-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.15);
}

.route-image {
  height: 200px;
  overflow: hidden;
}

.route-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.route-card:hover .route-image img {
  transform: scale(1.05);
}

.route-content {
  padding: 1.5rem;
}

.route-name {
  font-size: 1.4rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.route-location {
  color: #3498db;
  font-size: 1rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.route-description {
  color: #666;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.route-details {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.detail-item {
  background-color: #f0f8ff;
  color: #3498db;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.9rem;
}

.btn-join {
  width: 100%;
  padding: 0.8rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-join:hover {
  background-color: #2980b9;
}

/* 报名弹窗样式 */
.join-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.modal-content {
  background-color: white;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  color: #2c3e50;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #999;
  transition: color 0.3s ease;
}

.close-button:hover {
  color: #2c3e50;
}

.modal-body {
  padding: 1.5rem;
}

.activity-info {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.activity-image {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
}

.info-details {
  flex: 1;
}

.info-details p {
  margin-bottom: 0.5rem;
  color: #666;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #2c3e50;
  font-weight: 500;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #3498db;
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

.modal-footer {
  padding: 1.5rem;
  border-top: 1px solid #e0e0e0;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.btn-cancel,
.btn-submit {
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-cancel {
  background-color: #e0e0e0;
  color: #666;
}

.btn-cancel:hover {
  background-color: #d0d0d0;
}

.btn-submit {
  background-color: #3498db;
  color: white;
}

.btn-submit:hover {
  background-color: #2980b9;
}

/* 支付选项样式 */
.payment-options {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.payment-option {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.payment-option label {
  font-size: 1.1rem;
  font-weight: 500;
  color: #2c3e50;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.points-input-group {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 0;
}

.points-input-group span {
  color: #3498db;
  font-weight: 500;
}

.points-input-group input {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 100px;
}

.payment-methods h4 {
  margin-bottom: 1rem;
  color: #2c3e50;
}

.payment-method {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.payment-method:hover {
  background-color: #f0f8ff;
}

.payment-method label {
  font-size: 1rem;
  color: #2c3e50;
  cursor: pointer;
}

/* 活动详情弹窗样式 */
.detail-modal-content {
  max-width: 700px;
  width: 90%;
}

.detail-modal-body {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.detail-image {
  width: 100%;
  height: auto;
  border-radius: 8px;
  overflow: hidden;
}

.detail-image img {
  width: 100%;
  height: auto;
  object-fit: cover;
}

.detail-info {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.detail-location {
  font-size: 18px;
  color: #666;
}

.detail-description {
  font-size: 16px;
  line-height: 1.6;
}

.detail-specifics {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 10px;
}

.detail-specifics .detail-item {
  background-color: #f5f5f5;
  padding: 8px 15px;
  border-radius: 20px;
  font-size: 14px;
  color: #333;
  background-color: #f0f8ff;
  color: #3498db;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .route-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 900px) {
  .route-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .section-title {
    font-size: 2rem;
    padding: 0 1.5rem;
  }
  
  .section-title::before,
  .section-title::after {
    width: 40px;
  }
  
  .activity-tabs {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
  
  .route-grid {
    grid-template-columns: 1fr;
  }
  
  .activity-info {
    flex-direction: column;
  }
  
  .activity-image {
    width: 100%;
    height: 200px;
  }
  
  .points-input-group {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>