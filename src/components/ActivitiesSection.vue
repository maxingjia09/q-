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
                <p class="route-description">{{ route.description }}</p>
                <div class="route-details">
                  <span class="detail-item">{{ route.difficulty }}</span>
                  <span class="detail-item">{{ route.duration }}</span>
                </div>
                <button class="btn-join" @click="showJoinModal(route)">立即报名</button>
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
                  <p class="route-description">{{ spot.description }}</p>
                  <div class="route-details">
                    <span class="detail-item">{{ spot.difficulty }}</span>
                    <span class="detail-item">{{ spot.height }}</span>
                  </div>
                  <button class="btn-join" @click="showJoinModal(spot)">立即报名</button>
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
                  <p class="route-description">{{ expedition.description }}</p>
                  <div class="route-details">
                    <span class="detail-item">{{ expedition.altitude }}</span>
                    <span class="detail-item">{{ expedition.duration }}</span>
                  </div>
                  <button class="btn-join" @click="showJoinModal(expedition)">立即报名</button>
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
          <div class="activity-info">
            <img :src="selectedActivity?.image" :alt="selectedActivity?.name" class="activity-image">
            <div class="info-details">
              <p><strong>地点：</strong>{{ selectedActivity?.location }}</p>
              <p><strong>描述：</strong>{{ selectedActivity?.description }}</p>
              <div v-if="selectedActivity?.difficulty">
                <p><strong>难度：</strong>{{ selectedActivity?.difficulty }}</p>
              </div>
              <div v-if="selectedActivity?.duration">
                <p><strong>时长：</strong>{{ selectedActivity?.duration }}</p>
              </div>
              <div v-if="selectedActivity?.height">
                <p><strong>高度：</strong>{{ selectedActivity?.height }}</p>
              </div>
              <div v-if="selectedActivity?.altitude">
                <p><strong>海拔：</strong>{{ selectedActivity?.altitude }}</p>
              </div>
            </div>
          </div>
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
  </section>
</template>

<script setup>
import { ref } from 'vue';
// 导入雪山攀登活动的图片
import peak3Image from '@/assets/3.jpg';
import peak4Image from '@/assets/4.jpg';
import peak5Image from '@/assets/5.jpg';
import peak2Image from '@/assets/2.jpg';

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

// 徒步路线数据
const hikingRoutes = [
  {
    id: 1,
    name: '虎跳峡徒步',
    location: '云南丽江',
    description: '世界十大经典徒步路线之一，沿途可欣赏金沙江壮丽景色和哈巴雪山风光。',
    difficulty: '中等',
    duration: '2-3天',
    image: 'https://picsum.photos/id/29/600/400'
  },
  {
    id: 2,
    name: '雨崩徒步',
    location: '云南迪庆',
    description: '梅里雪山脚下的秘境，徒步穿越原始森林，感受雪山冰川的震撼。',
    difficulty: '较高',
    duration: '4-5天',
    image: 'https://picsum.photos/id/30/600/400'
  },
  {
    id: 3,
    name: '贡嘎西南坡徒步',
    location: '四川甘孜',
    description: '近距离接触蜀山之王，欣赏贡嘎雪山群峰和冰川的壮丽景观。',
    difficulty: '高',
    duration: '6-7天',
    image: 'https://picsum.photos/id/31/600/400'
  },
  {
    id: 4,
    name: '喀纳斯徒步',
    location: '新疆阿勒泰',
    description: '穿越中国最美秋色，感受童话般的森林、湖泊和白桦林。',
    difficulty: '中等',
    duration: '3-4天',
    image: 'https://picsum.photos/id/32/600/400'
  }
];

// 攀岩场地数据
const rockClimbingSpots = [
  {
    id: 1,
    name: '阳朔攀岩基地',
    location: '广西桂林',
    description: '世界闻名的攀岩胜地，拥有数百条不同难度的攀岩线路。',
    difficulty: '初级到高级',
    height: '10-50米',
    image: 'https://picsum.photos/id/33/600/400'
  },
  {
    id: 2,
    name: '白河攀岩场',
    location: '北京密云',
    description: '北京周边最著名的攀岩场地，线路丰富，适合不同水平的攀岩者。',
    difficulty: '初级到中级',
    height: '5-30米',
    image: 'https://picsum.photos/id/34/600/400'
  },
  {
    id: 3,
    name: '石鼓攀岩基地',
    location: '云南丽江',
    description: '金沙江畔的天然攀岩场，风景优美，线路独特。',
    difficulty: '中级到高级',
    height: '15-40米',
    image: 'https://picsum.photos/id/35/600/400'
  },
  {
    id: 4,
    name: '马山攀岩公园',
    location: '广西南宁',
    description: '南方地区最大的室外攀岩公园，设施完善，适合家庭和团队活动。',
    difficulty: '初级到高级',
    height: '8-45米',
    image: 'https://picsum.photos/id/39/600/400'
  }
];

// 雪山攀登数据
const mountainExpeditions = [
  {
    id: 1,
    name: '四姑娘山二峰',
    location: '四川阿坝',
    description: '入门级雪山，适合有一定徒步经验的登山爱好者。',
    altitude: '5276米',
    duration: '5-6天',
    image: peak3Image
  },
  {
    id: 2,
    name: '玉珠峰',
    location: '青海格尔木',
    description: '昆仑山脉东段最高峰，6000米级雪山的经典入门之选。',
    altitude: '6178米',
    duration: '10-12天',
    image: peak4Image
  },
  {
    id: 3,
    name: '慕士塔格峰',
    location: '新疆喀什',
    description: '帕米尔高原上的"冰山之父"，7000米级雪山的理想选择。',
    altitude: '7546米',
    duration: '20-25天',
    image: peak5Image
  },
  {
    id: 4,
    name: '岗什卡雪山',
    location: '青海海北',
    description: '祁连山脉东段最高峰，适合有一定经验的登山者挑战。',
    altitude: '5254.5米',
    duration: '7-9天',
    image: peak2Image
  }
];

// 报名弹窗相关
const showModal = ref(false);
const selectedActivity = ref(null);
const formData = ref({
  name: '',
  phone: '',
  email: '',
  experience: ''
});

// 显示报名弹窗
const showJoinModal = (activity) => {
  selectedActivity.value = activity;
  showModal.value = true;
  // 重置表单
  formData.value = {
    name: '',
    phone: '',
    email: '',
    experience: ''
  };
};

// 关闭报名弹窗
const closeModal = () => {
  showModal.value = false;
  selectedActivity.value = null;
};

// 提交报名表单
const submitForm = () => {
  // 这里可以添加表单验证逻辑
  if (!formData.value.name || !formData.value.phone) {
    alert('请填写姓名和手机号');
    return;
  }
  
  // 模拟表单提交
  console.log('提交报名信息:', {
    activity: selectedActivity.value,
    formData: formData.value
  });
  
  // 显示提交成功提示
  alert('报名成功！我们将尽快与您联系。');
  closeModal();
};
</script>

<style scoped>
.activities-section {
  padding: 5rem 0;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
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
  height: 2px;
  background-color: #3498db;
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
  background-color: #3498db;
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
  color: #666;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  font-weight: 500;
}

.tab-button:hover {
  color: #3498db;
}

.tab-button.active {
  color: #3498db;
}

.tab-button.active::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
  width: 50%;
  height: 3px;
  background-color: #3498db;
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
  border: 2px solid #e0e0e0;
  background-color: transparent;
  color: #666;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 25px;
}

.climbing-tab-button:hover {
  border-color: #3498db;
  color: #3498db;
}

.climbing-tab-button.active {
  background-color: #3498db;
  color: white;
  border-color: #3498db;
}

/* 分类标题 */
.category-title {
  font-size: 1.8rem;
  color: #2c3e50;
  margin-bottom: 2rem;
  text-align: center;
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
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
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
}
</style>