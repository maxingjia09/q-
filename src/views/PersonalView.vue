<template>
  <div class="personal-container">
    <!-- 移除个人页面内部的背景，使用全局背景 -->
    
    <!-- 未登录提示弹窗 -->
    <div v-if="showLoginPrompt" class="prompt-modal-overlay" @click="handlePromptClick">
      <div class="prompt-modal-content" @click.stop>
        <h3 class="prompt-title">提示</h3>
        <p class="prompt-message">请先进行登录</p>
        <div class="prompt-buttons">
          <button class="btn-primary" @click="goToLogin">立即登录</button>
          <button class="btn-secondary" @click="showLoginPrompt = false">返回</button>
        </div>
      </div>
    </div>
    
    <!-- 支付方式选择模态框 -->
    <div v-if="showPaymentModal" class="payment-modal-overlay" @click="closePaymentModal">
      <div class="payment-modal-content" @click.stop>
        <h3 class="payment-modal-title">选择支付方式</h3>
        <div class="payment-options">
          <div class="payment-option" @click="selectPaymentMethod('wechat')">
            <div class="payment-icon">
              <!-- 微信支付图标 -->
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="19" fill="#07C160"/>
                <path d="M13.35 17.5C13.35 14.76 15.56 12.5 18.25 12.5C20.94 12.5 23.15 14.76 23.15 17.5C23.15 20.24 20.94 22.5 18.25 22.5C15.56 22.5 13.35 20.24 13.35 17.5ZM18.25 14C16.16 14 14.5 15.66 14.5 17.75C14.5 19.84 16.16 21.5 18.25 21.5C20.34 21.5 22 19.84 22 17.75C22 15.66 20.34 14 18.25 14Z" fill="white"/>
                <path d="M25.83 19.5C25.83 16.76 23.62 14.5 20.93 14.5C20.16 14.5 19.42 14.7 18.74 15.06C18.57 13.38 17.12 12 15.39 12C12.21 12 9.8 14.4 9.8 17.58C9.8 20.76 12.21 23.16 15.39 23.16C17.12 23.16 18.57 21.84 18.74 20.16C19.42 20.52 20.16 20.72 20.93 20.72C23.62 20.72 25.83 18.46 25.83 15.72V19.5Z" fill="white"/>
                <path d="M23.45 25.5H13.05C11.95 25.5 11.1 24.65 11.1 23.55V13.15C11.1 12.05 11.95 11.2 13.05 11.2H23.45C24.55 11.2 25.4 12.05 25.4 13.15V23.55C25.4 24.65 24.55 25.5 23.45 25.5Z" fill="white" stroke="#E5E5E5" stroke-width="0.5"/>
                <path d="M25.4 18.35C25.4 19.91 24.11 21.2 22.55 21.2C20.99 21.2 19.7 19.91 19.7 18.35C19.7 16.79 20.99 15.5 22.55 15.5C24.11 15.5 25.4 16.79 25.4 18.35Z" fill="white"/>
              </svg>
            </div>
            <span class="payment-name">微信支付</span>
          </div>
          <div class="payment-option" @click="selectPaymentMethod('alipay')">
            <div class="payment-icon">
              <!-- 支付宝图标 -->
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="19" fill="#1677FF"/>
                <path d="M26.35 13.8L23.3 17.15L20.15 13.8L17.1 17.15L14.05 13.8C12.4 15.6 11.5 17.95 11.6 20.45C11.7 22.95 12.85 25.3 14.65 27L17.7 23.7L20.85 27L23.9 23.7L26.95 27C28.75 25.3 29.9 22.95 30 20.45C30.1 17.95 29.2 15.6 27.55 13.8H26.35Z" fill="white"/>
                <path d="M27.75 12.95L24.9 16.1L22.05 12.95L19.2 16.1L16.35 12.95C14.55 14.95 13.5 17.5 13.4 20.2C13.3 22.9 14.25 25.55 15.95 27.35L18.8 24.2L21.65 27.35L24.5 24.2L27.35 27.35C29.05 25.55 30 22.9 29.9 20.2C29.8 17.5 28.75 14.95 26.95 12.95H27.75Z" fill="white"/>
              </svg>
            </div>
            <span class="payment-name">支付宝支付</span>
          </div>
        </div>
        <button class="payment-modal-close" @click="closePaymentModal">取消</button>
      </div>
    </div>
    <div class="personal-content">
      <div class="content-header">
        <h2 class="content-title">个人中心</h2>
      </div>

      <div class="content-section" id="profile">
        <h3 class="section-title">个人信息</h3>
        <div class="info-card">
          <div class="info-item">
            <span class="info-label">用户名</span>
            <span class="info-value">{{ user?.username || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">邮箱</span>
            <span class="info-value">{{ user?.email || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">注册时间</span>
            <span class="info-value">{{ formattedRegisterTime }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">会员等级</span>
            <span class="info-value">普通会员</span>
          </div>
          <div class="info-item">
            <span class="info-label"></span>
            <button class="btn-logout" @click="handleLogout">退出登录</button>
          </div>
        </div>
      </div>

      <div class="content-section" id="points">
        <h3 class="section-title">我的积分</h3>
        <div class="points-card">
          <div class="points-display">
            <span class="points-label">当前积分</span>
            <span class="points-value">{{ points || 0 }}</span>
          </div>

          <div class="recharge-section">
            <h4 class="recharge-title">积分充值</h4>
            <form class="recharge-form" @submit.prevent="handleRecharge">
              <div class="form-group">
                <label for="amount" class="form-label">充值金额</label>
                <input
                  type="number"
                  id="amount"
                  v-model.number="rechargeAmount"
                  class="form-input"
                  min="1"
                  placeholder="请输入充值金额"
                  required
                >
                <div class="note-text">1元 = 1积分，充值金额不低于1元</div>
              </div>

              <div v-if="rechargeError" class="error-message">{{ rechargeError }}</div>

              <button type="submit" class="btn-recharge" :disabled="isRecharging">
                <span v-if="!isRecharging">立即充值</span>
                <span v-if="isRecharging">充值中...</span>
              </button>
            </form>
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
  
  // 检查登录状态
  if (!authStore.isAuthenticated) {
    console.log('Not authenticated, showing login prompt');
    showLoginPrompt.value = true;
    return;
  }

  console.log('Already authenticated, initializing user info');
  // 初始化用户信息
  await authStore.initAuth();
  console.log('After initAuth, user:', authStore.user);
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
</script>

<style scoped>
.personal-container {
  min-height: 100vh;
  position: relative;
  max-width: 1600px;
  margin: 0 auto;
  width: 100%;
}

/* 移除个人页面内部的侧边栏样式 */

.user-profile {
  text-align: center;
  padding: 0 1.5rem 1.5rem;
  border-bottom: 1px solid #f0f0f0;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto 1rem;
  border: 3px solid #f0f0f0;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.username {
  font-size: 1.2rem;
  color: #2c3e50;
  margin-bottom: 0.3rem;
}

.user-role {
  color: #666;
  font-size: 0.9rem;
}

.sidebar-nav {
  padding: 1.5rem;
}

.nav-item {
  display: block;
  padding: 0.8rem 1rem;
  color: #666;
  text-decoration: none;
  border-radius: 6px;
  margin-bottom: 0.3rem;
  transition: all 0.2s;
}

.nav-item:hover,
.nav-item.active {
  background-color: rgba(52, 152, 219, 0.1);
  color: #3498db;
}

.btn-logout {
  width: 100%;
  padding: 0.8rem;
  background-color: transparent;
  border: 1px solid #e74c3c;
  color: #e74c3c;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 1rem;
}

.btn-logout:hover {
  background-color: rgba(231, 76, 60, 0.1);
}

.personal-content {
  padding: 2rem;
  margin: 2rem 1rem;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  max-width: 1600px;
  width: calc(100% - 2rem);
}

.content-header {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f0f0f0;
}

.content-title {
  font-size: 1.8rem;
  color: #2c3e50;
}

.content-section {
  margin-bottom: 3rem;
}

.section-title {
  font-size: 1.3rem;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  padding-left: 0.5rem;
  border-left: 3px solid #3498db;
}

.info-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
}

.info-item {
  display: flex;
  padding: 1rem 0;
  border-bottom: 1px solid #f0f0f0;
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  flex: 0 0 120px;
  color: #666;
  font-weight: 500;
}

.info-value {
  flex: 1;
  color: #2c3e50;
}

.points-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  align-items: center;
}

.points-display {
  text-align: center;
  padding: 1.5rem;
  background-color: rgba(52, 152, 219, 0.05);
  border-radius: 8px;
}

.points-label {
  display: block;
  color: #666;
  margin-bottom: 0.5rem;
}

.points-value {
  font-size: 3rem;
  font-weight: bold;
  color: #3498db;
}

.recharge-section {
  padding: 1rem;
}

.recharge-title {
  font-size: 1.1rem;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.recharge-form {
  padding: 1rem 0;
}

.note-text {
  font-size: 0.875rem;
  color: #999;
  margin-top: 0.5rem;
}

.btn-recharge {
  width: 100%;
  padding: 0.9rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 1rem;
}

.btn-recharge:hover:not(:disabled) {
  background-color: #2980b9;
}

.btn-recharge:disabled {
  background-color: #95a5a6;
  cursor: not-allowed;
}

@media (max-width: 992px) {
  .personal-container {
    flex-direction: column;
  }

  .personal-sidebar {
    width: calc(100% - 4rem);
    margin: 2rem;
    margin-bottom: 0;
  }

  .personal-content {
    margin: 2rem;
    margin-top: 1rem;
  }

  .points-card {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .personal-content {
    padding: 1rem;
  }

  .info-item {
    flex-direction: column;
  }

  .info-label {
    margin-bottom: 0.5rem;
  }
}

/* 支付方式模态框样式 */
.payment-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.payment-modal-content {
  background-color: white;
  border-radius: 8px;
  padding: 2rem;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.payment-modal-title {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #2c3e50;
}

.payment-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.payment-option {
  display: flex;
  align-items: center;
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.payment-option:hover {
  border-color: #3498db;
  background-color: rgba(52, 152, 219, 0.05);
}

.payment-icon {
  margin-right: 1rem;
}

.payment-name {
  font-size: 1.1rem;
  color: #2c3e50;
}

.payment-modal-close {
  width: 100%;
  padding: 0.9rem;
  background-color: #f5f7fa;
  color: #666;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.payment-modal-close:hover {
  background-color: #e0e6ed;
}

/* 未登录提示弹窗样式 */
.prompt-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.prompt-modal-content {
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  text-align: center;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.prompt-title {
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: #2c3e50;
}

.prompt-message {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 30px;
}

.prompt-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.btn-primary,
.btn-secondary {
  padding: 10px 25px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: #3498db;
  color: white;
}

.btn-primary:hover {
  background-color: #2980b9;
  transform: translateY(-1px);
}

.btn-secondary {
  background-color: #f5f5f5;
  color: #666;
}

.btn-secondary:hover {
  background-color: #e0e0e0;
}
</style>