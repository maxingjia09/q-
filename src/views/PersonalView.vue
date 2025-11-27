<template>
  <div class="personal-container">
    <!-- 页面标题 -->
    <h1 class="page-title">个人中心</h1>
    
    <!-- 主要内容区域 - 使用flex布局确保左右两栏正常显示 -->
    <div class="personal-content-wrapper">
      <!-- 左侧个人信息卡片 -->
      <div class="user-info-card">
        <h2 class="section-title">个人信息</h2>
        <div class="info-content">
          <div class="info-row">
            <span class="info-label">用户名:</span>
            <span class="info-value">{{ user?.username || '访客用户' }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">邮箱:</span>
            <span class="info-value">{{ user?.email || '未登录' }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">注册时间:</span>
            <span class="info-value">{{ formattedRegisterTime }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">会员等级:</span>
            <span class="info-value">普通会员</span>
          </div>
        </div>
      </div>
      
      <!-- 右侧活动列表 -->
      <div class="activities-card">
        <h2 class="section-title">我参与的活动</h2>
        <div class="activities-container">
          <div v-for="activity in joinedActivities" :key="activity.id" class="activity-item">
            <img :src="activity.image" :alt="activity.name" class="activity-image">
            <div class="activity-text">
              <h4 class="activity-title">{{ activity.name }}</h4>
              <p class="activity-location">{{ activity.location }}</p>
              <p class="activity-date">{{ activity.date }}</p>
              <span class="status-badge" :class="activity.status">{{ activity.status }}</span>
              <div class="activity-buttons">
                <button class="view-btn" @click="viewActivityDetails(activity.id)">查看详情</button>
                <button v-if="activity.status === '进行中'" class="cancel-btn" @click="cancelActivity(activity.id)">取消参与</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';

const router = useRouter();
const authStore = useAuthStore();

// 状态
const user = computed(() => authStore.user);
const points = computed(() => authStore.points);
const rechargeAmount = ref(0);
const isRecharging = ref(false);
const rechargeError = ref('');
const showPaymentModal = ref(false);
const selectedPaymentMethod = ref('');
const showLoginPrompt = ref(false);

// 模拟用户参与的活动数据 - 确保始终有数据显示
const joinedActivities = ref([
  {
    id: 1,
    name: '四姑娘山徒步穿越',
    location: '四川阿坝',
    date: '2023-10-15 至 2023-10-20',
    status: '已完成',
    image: 'https://picsum.photos/id/29/400/300'
  },
  {
    id: 2,
    name: '阳朔攀岩基地体验',
    location: '广西桂林',
    date: '2024-01-20 至 2024-01-22',
    status: '进行中',
    image: 'https://picsum.photos/id/33/400/300'
  },
  {
    id: 3,
    name: '岗什卡雪山攀登',
    location: '青海海北',
    date: '2024-03-10 至 2024-03-18',
    status: '进行中',
    image: 'https://picsum.photos/id/40/400/300'
  }
]);

// 格式化注册时间（模拟）
const formattedRegisterTime = computed(() => {
  const now = new Date();
  return now.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// 初始化
onMounted(async () => {
  console.log('PersonalView mounted');
  console.log('isAuthenticated:', authStore.isAuthenticated);
  console.log('Joined activities count:', joinedActivities.value.length);
  
  // 确保模拟数据始终显示
  if (joinedActivities.value.length === 0) {
    console.log('No activities found, adding mock data');
    // 添加模拟活动数据
    joinedActivities.value = [
      {
        id: 1,
        name: '四姑娘山徒步穿越',
        location: '四川阿坝',
        date: '2023-10-15 至 2023-10-20',
        status: '已完成',
        image: 'https://picsum.photos/id/29/400/300'
      }
    ];
  }
  
  // 检查登录状态
  if (!authStore.isAuthenticated) {
    console.log('Not authenticated, allowing access to view structure');
    // 为了调试，不显示登录弹窗，让用户可以看到页面结构
    // showLoginPrompt.value = true;
  } else {
    console.log('Already authenticated, initializing user info');
    try {
      // 初始化用户信息
      await authStore.initAuth();
      console.log('After initAuth, user:', authStore.user);
    } catch (error) {
      console.error('Error initializing auth:', error);
    }
  }
});

// 处理提示弹窗点击
const handlePromptClick = () => {
  // 点击遮罩层不关闭弹窗，必须通过按钮操作
};

// 跳转到登录页
const goToLogin = () => {
  router.push('/login');
};

// 显示支付方式选择模态框
const handleRecharge = () => {
  if (!rechargeAmount.value || rechargeAmount.value < 1) {
    rechargeError.value = '请输入有效的充值金额（不低于1元）';
    return;
  }
  
  rechargeError.value = '';
  showPaymentModal.value = true;
};

// 关闭支付方式选择模态框
const closePaymentModal = () => {
  showPaymentModal.value = false;
  selectedPaymentMethod.value = '';
};

// 选择支付方式并进行充值
const selectPaymentMethod = async (method) => {
  selectedPaymentMethod.value = method;
  showPaymentModal.value = false;
  
  // 执行充值操作
  await processRecharge();
};

// 处理实际的充值操作
const processRecharge = async () => {
  isRecharging.value = true;
  
  try {
    await authStore.rechargePoints(rechargeAmount.value);
    // 充值成功提示，包含支付方式信息
    const paymentMethodText = selectedPaymentMethod.value === 'wechat' ? '微信支付' : '支付宝支付';
    alert(`使用${paymentMethodText}充值成功！获得 ${rechargeAmount.value} 积分，当前总积分：${points.value}`);
    rechargeAmount.value = 0;
  } catch (error) {
    rechargeError.value = error.message || '充值失败，请稍后重试';
  } finally {
    isRecharging.value = false;
  }
};

// 退出登录
const handleLogout = async () => {
  if (confirm('确定要退出登录吗？')) {
    await authStore.logout();
    // 使用window.location.href强制刷新并返回首页
    window.location.href = '/';
  }
};

// 页面内滚动到指定区域
const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
  // 更新活动状态
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });
  event.target.classList.add('active');
};

// 查看活动详情
const viewActivityDetails = (activityId) => {
  // 实际项目中可能会跳转到活动详情页
  alert(`查看活动ID ${activityId} 的详情`);
};

// 取消参与活动
const cancelActivity = (activityId) => {
  if (confirm('确定要取消参与该活动吗？')) {
    // 实际项目中会调用API取消活动
    // 这里仅做模拟：找到活动并将状态改为"已取消"
    const activity = joinedActivities.value.find(act => act.id === activityId);
    if (activity) {
      activity.status = '已取消';
    }
  }
};

// 浏览活动
const browseActivities = () => {
  // 跳转到活动报名页面
  router.push('/');
};
</script>

<style scoped>
/* 基础容器样式 */
.personal-container {
  min-height: 100vh;
  width: 100%;
  padding: 2rem 1rem 2rem 300px; /* 避开固定侧边栏 */
  background-color: #f8f9fa;
  box-sizing: border-box;
}

/* 页面标题 */
.page-title {
  text-align: center;
  font-size: 2rem;
  color: #2c3e50;
  margin-bottom: 2rem;
}

/* 内容包装器 - 使用flex布局 */
.personal-content-wrapper {
  display: flex;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

/* 左侧个人信息卡片 */
.user-info-card {
  flex: 0 0 300px;
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 右侧活动列表卡片 */
.activities-card {
  flex: 1;
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 通用标题样式 */
.section-title {
  font-size: 1.3rem;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #3498db;
}

/* 个人信息内容 */
.info-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 0.8rem 0;
  border-bottom: 1px solid #f0f0f0;
}

.info-row:last-child {
  border-bottom: none;
}

.info-label {
  color: #666;
  font-weight: 500;
}

.info-value {
  color: #2c3e50;
  font-weight: 400;
}

/* 活动容器 */
.activities-container {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

/* 单个活动项 */
.activity-item {
  background-color: #f9f9f9;
  border-radius: 6px;
  padding: 1rem;
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  transition: transform 0.2s, box-shadow 0.2s;
}

.activity-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 活动图片 */
.activity-image {
  width: 120px;
  height: 90px;
  object-fit: cover;
  border-radius: 4px;
  flex-shrink: 0;
}

/* 活动文本内容 */
.activity-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* 活动标题 */
.activity-title {
  font-size: 1.1rem;
  color: #2c3e50;
  margin: 0;
  font-weight: 600;
}

/* 活动地点 */
.activity-location {
  font-size: 0.9rem;
  color: #666;
  margin: 0;
}

/* 活动日期 */
.activity-date {
  font-size: 0.9rem;
  color: #7f8c8d;
  margin: 0;
}

/* 状态标签 */
.status-badge {
  display: inline-block;
  padding: 0.2rem 0.8rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  align-self: flex-start;
}

/* 不同状态的颜色 */
.status-badge.已完成 {
  background-color: #27ae60;
  color: white;
}

.status-badge.进行中 {
  background-color: #3498db;
  color: white;
}

.status-badge.已取消 {
  background-color: #95a5a6;
  color: white;
}

/* 活动按钮容器 */
.activity-buttons {
  margin-top: 0.5rem;
  display: flex;
  gap: 0.8rem;
}

/* 查看详情按钮 */
.view-btn {
  padding: 0.5rem 1rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;
}

.view-btn:hover {
  background-color: #2980b9;
}

/* 取消参与按钮 */
.cancel-btn {
  padding: 0.5rem 1rem;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;
}

.cancel-btn:hover {
  background-color: #c0392b;
}

/* 响应式设计 */
@media (max-width: 992px) {
  .personal-container {
    padding-left: 250px;
  }
  
  .personal-content-wrapper {
    flex-direction: column;
  }
  
  .user-info-card {
    flex: none;
  }
}

@media (max-width: 768px) {
  .personal-container {
    padding-left: 200px;
    padding-right: 0.5rem;
  }
  
  .activity-item {
    flex-direction: column;
  }
  
  .activity-image {
    width: 100%;
    height: 160px;
  }
}
</style>