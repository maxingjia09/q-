<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '../stores/authStore';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const user = computed(() => authStore.user);
const points = computed(() => authStore.points);
const isAuthenticated = computed(() => authStore.isAuthenticated);

const activeTab = ref('profile');
const rechargeAmount = ref('');
const showPaymentModal = ref(false);
const selectedPaymentMethod = ref('');

const quickAmounts = [100, 200, 500, 1000];

const paymentMethods = [
  { id: 'wechat', name: '微信支付', icon: '💚' },
  { id: 'alipay', name: '支付宝', icon: '💙' },
  { id: 'card', name: '银行卡', icon: '💳' }
];

const joinedActivities = ref([
  {
    id: 1,
    name: '周末登山活动',
    location: '北京香山',
    date: '2024-01-20',
    status: '已完成',
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400'
  },
  {
    id: 2,
    name: '野外露营体验',
    location: '怀柔雁栖湖',
    date: '2024-02-15',
    status: '进行中',
    image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400'
  }
]);

const handleRecharge = () => {
  if (!rechargeAmount.value || rechargeAmount.value <= 0) {
    alert('请输入有效的充值金额');
    return;
  }
  showPaymentModal.value = true;
};

const confirmPayment = () => {
  if (!selectedPaymentMethod.value) {
    alert('请选择支付方式');
    return;
  }
  const amount = parseInt(rechargeAmount.value);
  authStore.updatePoints(authStore.points + amount);
  alert(`充值成功！${amount} 积分已到账`);
  showPaymentModal.value = false;
  rechargeAmount.value = '';
  selectedPaymentMethod.value = '';
};

const handleLogout = () => {
  if (confirm('确定要退出登录吗？')) {
    authStore.logout();
    router.push('/login');
  }
};

const browseActivities = () => {
  router.push('/');
};

onMounted(() => {
  if (!isAuthenticated.value) {
    router.push('/login');
  }
});
</script>

<template>
  <div class="personal-page">
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
              { id: 'profile', label: '个人信息', icon: '👤' },
              { id: 'activities', label: '参与活动', icon: '🏃' },
              { id: 'recharge', label: '账户充值', icon: '💰' }
            ]"
            :key="tab.id"
            :class="['nav-item', { active: activeTab === tab.id }]"
            @click="activeTab = tab.id"
          >
            <span class="icon">{{ tab.icon }}</span>
            <span>{{ tab.label }}</span>
          </div>
          <div class="nav-item logout" @click="handleLogout">
            <span class="icon">🚪</span>
            <span>退出登录</span>
          </div>
        </nav>
      </aside>

      <main class="main-content">
        <div class="content-wrapper">
          <header class="user-header">
            <div class="user-avatar">
              <img src="../assets/logo.svg" alt="用户头像">
            </div>
            <div class="user-info">
              <h1>{{ user?.username || '访客用户' }}</h1>
              <p>{{ user?.email || '未登录' }}</p>
            </div>
            <div class="user-stats">
              <div class="stat-item">
                <span class="stat-label">积分</span>
                <span class="stat-value">{{ points }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">活动数</span>
                <span class="stat-value">{{ joinedActivities.length }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">会员等级</span>
                <span class="stat-value">普通会员</span>
              </div>
            </div>
          </header>

          <div class="tab-content">
            <div v-if="activeTab === 'profile'" class="profile-section">
              <h2>个人信息</h2>
              <div class="info-grid">
                <div class="info-card">
                  <div class="card-icon">👤</div>
                  <div class="card-content">
                    <label>用户名</label>
                    <div class="value">{{ user?.username || '访客用户' }}</div>
                  </div>
                </div>
                <div class="info-card">
                  <div class="card-icon">📧</div>
                  <div class="card-content">
                    <label>邮箱</label>
                    <div class="value">{{ user?.email || '未设置' }}</div>
                  </div>
                </div>
                <div class="info-card">
                  <div class="card-icon">📅</div>
                  <div class="card-content">
                    <label>注册时间</label>
                    <div class="value">2024-01-01</div>
                  </div>
                </div>
                <div class="info-card">
                  <div class="card-icon">⭐</div>
                  <div class="card-content">
                    <label>会员等级</label>
                    <div class="value">普通会员</div>
                  </div>
                </div>
                <div class="info-card highlight">
                  <div class="card-icon">💎</div>
                  <div class="card-content">
                    <label>积分余额</label>
                    <div class="value points">{{ points }}</div>
                  </div>
                </div>
                <div class="info-card">
                  <div class="card-icon">🎯</div>
                  <div class="card-content">
                    <label>参与活动数</label>
                    <div class="value">{{ joinedActivities.length }}</div>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="activeTab === 'activities'" class="activities-section">
              <h2>参与的活动</h2>
              <div v-if="joinedActivities.length === 0" class="empty-state">
                <div class="empty-icon">📋</div>
                <p>暂无参与的活动</p>
                <button class="action-btn" @click="browseActivities">去浏览活动</button>
              </div>
              <div v-else class="activities-list">
                <div v-for="activity in joinedActivities" :key="activity.id" class="activity-card">
                  <img :src="activity.image" :alt="activity.name" class="activity-image">
                  <div class="activity-info">
                    <h3>{{ activity.name }}</h3>
                    <p class="location">📍 {{ activity.location }}</p>
                    <p class="date">📅 {{ activity.date }}</p>
                    <span :class="['status', activity.status]">{{ activity.status }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="activeTab === 'recharge'" class="recharge-section">
              <h2>账户充值</h2>
              <div class="recharge-container">
                <div class="balance-card">
                  <div class="balance-label">当前积分</div>
                  <div class="balance-amount">{{ points }}</div>
                </div>
                
                <div class="recharge-form">
                  <h3>选择充值金额</h3>
                  <div class="quick-amounts">
                    <button 
                      v-for="amount in quickAmounts"
                      :key="amount"
                      :class="['amount-btn', { active: rechargeAmount === amount }]"
                      @click="rechargeAmount = amount"
                    >
                      {{ amount }}
                    </button>
                  </div>
                  
                  <div class="custom-amount">
                    <label>自定义金额</label>
                    <input 
                      v-model="rechargeAmount" 
                      type="number" 
                      placeholder="请输入充值金额"
                      min="1"
                    >
                  </div>
                  
                  <button class="recharge-btn" @click="handleRecharge">
                    立即充值
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <div v-if="showPaymentModal" class="modal-overlay" @click.self="showPaymentModal = false">
      <div class="payment-modal">
        <h3>选择支付方式</h3>
        <p class="amount-display">充值金额: {{ rechargeAmount }} 积分</p>
        <div class="payment-methods">
          <div 
            v-for="method in paymentMethods"
            :key="method.id"
            :class="['payment-method', { selected: selectedPaymentMethod === method.id }]"
            @click="selectedPaymentMethod = method.id"
          >
            <span class="method-icon">{{ method.icon }}</span>
            <span class="method-name">{{ method.name }}</span>
          </div>
        </div>
        <div class="modal-actions">
          <button class="cancel-btn" @click="showPaymentModal = false">取消</button>
          <button class="confirm-btn" @click="confirmPayment">确认支付</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.personal-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding-top: 80px;
}

.page-container {
  display: flex;
  min-height: calc(100vh - 80px);
  max-width: 1800px;
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

.nav-item.logout {
  margin-top: auto;
  color: #dc3545;
}

.nav-item.logout:hover {
  background: #dc3545;
  color: white;
}

.icon {
  font-size: 18px;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 1200px;
  max-width: 1920px;
}

.content-wrapper {
  flex: 1;
  padding: 30px 40px;
  overflow-y: auto;
}

.user-header {
  background: white;
  border-radius: 15px;
  padding: 30px 40px;
  display: flex;
  align-items: center;
  gap: 30px;
  margin-bottom: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.user-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 4px;
  flex-shrink: 0;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  background: white;
}

.user-info h1 {
  margin: 0 0 8px 0;
  font-size: 24px;
  color: #2c3e50;
  font-weight: 600;
}

.user-info p {
  margin: 0;
  color: #6c757d;
  font-size: 14px;
}

.user-stats {
  margin-left: auto;
  display: flex;
  gap: 30px;
}

.stat-item {
  text-align: center;
  padding: 15px 25px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
  color: white;
}

.stat-label {
  display: block;
  font-size: 12px;
  opacity: 0.9;
  margin-bottom: 5px;
}

.stat-value {
  display: block;
  font-size: 20px;
  font-weight: 700;
}

.tab-content h2 {
  margin: 0 0 25px 0;
  font-size: 24px;
  color: #2c3e50;
  font-weight: 600;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.info-card {
  background: white;
  padding: 25px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
}

.info-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.info-card.highlight {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.card-icon {
  font-size: 36px;
  flex-shrink: 0;
}

.card-content label {
  display: block;
  font-size: 12px;
  opacity: 0.8;
  margin-bottom: 5px;
}

.card-content .value {
  font-size: 18px;
  font-weight: 600;
}

.info-card.highlight .card-content label {
  color: rgba(255, 255, 255, 0.9);
}

.info-card.highlight .card-content .value {
  color: white;
}

.info-card .card-content .value.points {
  color: #667eea;
}

.info-card.highlight .card-content .value.points {
  color: white;
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 15px;
  color: #6c757d;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.action-btn {
  margin-top: 20px;
  padding: 12px 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.activities-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 25px;
}

.activity-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
}

.activity-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.activity-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.activity-info {
  padding: 20px;
}

.activity-info h3 {
  margin: 0 0 12px 0;
  font-size: 18px;
  color: #2c3e50;
  font-weight: 600;
}

.activity-info p {
  margin: 8px 0;
  color: #6c757d;
  font-size: 14px;
}

.status {
  display: inline-block;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  margin-top: 10px;
}

.status.已完成 {
  background: #d4edda;
  color: #155724;
}

.status.进行中 {
  background: #cce5ff;
  color: #004085;
}

.recharge-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.balance-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 40px;
  border-radius: 15px;
  text-align: center;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.balance-label {
  font-size: 18px;
  opacity: 0.9;
  margin-bottom: 15px;
}

.balance-amount {
  font-size: 56px;
  font-weight: 700;
}

.recharge-form {
  background: white;
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.recharge-form h3 {
  margin: 0 0 25px 0;
  font-size: 20px;
  color: #2c3e50;
  font-weight: 600;
}

.quick-amounts {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-bottom: 25px;
}

.amount-btn {
  padding: 18px;
  border: 2px solid #e9ecef;
  background: white;
  border-radius: 10px;
  cursor: pointer;
  font-size: 20px;
  font-weight: 600;
  color: #495057;
  transition: all 0.3s;
}

.amount-btn:hover {
  border-color: #667eea;
  color: #667eea;
}

.amount-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
  color: white;
}

.custom-amount {
  margin-bottom: 25px;
}

.custom-amount label {
  display: block;
  margin-bottom: 10px;
  font-size: 14px;
  color: #495057;
  font-weight: 500;
}

.custom-amount input {
  width: 100%;
  padding: 15px;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  font-size: 16px;
  transition: all 0.3s;
}

.custom-amount input:focus {
  outline: none;
  border-color: #667eea;
}

.recharge-btn {
  width: 100%;
  padding: 18px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.recharge-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.payment-modal {
  background: white;
  padding: 40px;
  border-radius: 20px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.payment-modal h3 {
  margin: 0 0 10px 0;
  font-size: 24px;
  color: #2c3e50;
}

.amount-display {
  margin: 10px 0 30px 0;
  font-size: 18px;
  color: #667eea;
  font-weight: 600;
}

.payment-methods {
  display: grid;
  gap: 15px;
  margin-bottom: 30px;
}

.payment-method {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px 20px;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;
}

.payment-method:hover {
  border-color: #667eea;
}

.payment-method.selected {
  border-color: #667eea;
  background: rgba(102, 126, 234, 0.1);
}

.method-icon {
  font-size: 24px;
}

.method-name {
  font-size: 16px;
  font-weight: 600;
  color: #495057;
}

.modal-actions {
  display: flex;
  gap: 15px;
}

.cancel-btn,
.confirm-btn {
  flex: 1;
  padding: 15px;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.cancel-btn {
  background: #f8f9fa;
  color: #6c757d;
}

.cancel-btn:hover {
  background: #e9ecef;
}

.confirm-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.confirm-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
}

@media (max-width: 1600px) {
  .recharge-container {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 1400px) {
  .info-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
