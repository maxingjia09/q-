<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '../stores/authStore';
import { useRouter } from 'vue-router';
import LoginView from './LoginView.vue';
import RegisterView from './RegisterView.vue';

const authStore = useAuthStore();
const router = useRouter();

const user = computed(() => authStore.user);
const points = computed(() => authStore.points);
const avatar = computed(() => authStore.avatar);
const isAuthenticated = computed(() => authStore.isAuthenticated);
const joinedActivities = computed(() => authStore.joinedActivities);
const joinedCourses = computed(() => authStore.joinedCourses);

// 使用本地ref控制认证视图的显示，避免登录成功后isAuthenticated变化导致动画被中断
const showAuthView = ref(!authStore.isAuthenticated);

// 监听认证状态：用户登出或token失效时显示认证视图
watch(() => authStore.isAuthenticated, (newVal) => {
  if (!newVal) {
    showAuthView.value = true;
  }
});

const activeTab = ref('profile');
const authTab = ref('login');
const registerSuccessMessage = ref('');
const rechargeAmount = ref('');
const showPaymentModal = ref(false);
const selectedPaymentMethod = ref('');

const isEditing = ref(false);
const editForm = ref({
  username: '',
  email: '',
  phone: ''
});

// 个人资料表单（用于自动填充）
const personalInfo = computed(() => authStore.personalInfo);
const personalInfoForm = ref({
  name: '',
  phone: '',
  email: '',
  idCard: '',
  gender: '',
  age: '',
  emergencyContact: '',
  emergencyPhone: '',
  experience: '',
  healthConditions: '',
  fitnessLevel: '',
  height: '',
  weight: ''
});
const isEditingPersonalInfo = ref(false);

// 初始化个人资料表单
const initPersonalInfoForm = () => {
  personalInfoForm.value = { ...authStore.personalInfo };
  // 自动填充邮箱
  if (!personalInfoForm.value.email && user.value?.email) {
    personalInfoForm.value.email = user.value.email;
  }
};

// 编辑个人资料
const startEditingPersonalInfo = () => {
  initPersonalInfoForm();
  isEditingPersonalInfo.value = true;
};

// 取消编辑个人资料
const cancelEditingPersonalInfo = () => {
  isEditingPersonalInfo.value = false;
};

// 保存个人资料
const savePersonalInfo = () => {
  // 基础验证
  if (personalInfoForm.value.phone && !/^1[3-9]\d{9}$/.test(personalInfoForm.value.phone)) {
    alert('请输入正确的手机号');
    return;
  }
  if (personalInfoForm.value.idCard && !/^\d{17}[\dXx]$/.test(personalInfoForm.value.idCard)) {
    alert('请输入正确的身份证号');
    return;
  }
  if (personalInfoForm.value.emergencyPhone && !/^1[3-9]\d{9}$/.test(personalInfoForm.value.emergencyPhone)) {
    alert('请输入正确的紧急联系人电话');
    return;
  }

  authStore.updatePersonalInfo(personalInfoForm.value);
  alert('个人资料保存成功！');
  isEditingPersonalInfo.value = false;
};

// 登录/注册相关处理
const handleLoginSuccess = () => {
  // 登录成功，动画播放完毕，切换到个人中心视图
  showAuthView.value = false;
  refreshUserData();
};

const handleRegisterSuccess = () => {
  registerSuccessMessage.value = '注册成功！请使用您的账号登录';
  authTab.value = 'login';
};

const handleSwitchToRegister = () => {
  authTab.value = 'register';
  registerSuccessMessage.value = '';
};

const handleSwitchToLogin = () => {
  authTab.value = 'login';
};

const quickAmounts = [100, 200, 500, 1000];

const paymentMethods = [
  { id: 'wechat', name: '微信支付', icon: '💚' },
  { id: 'alipay', name: '支付宝', icon: '💙' },
  { id: 'card', name: '银行卡', icon: '💳' }
];

const startEditing = () => {
  editForm.value = {
    username: user.value?.username || '',
    email: user.value?.email || '',
    phone: user.value?.phone || ''
  };
  isEditing.value = true;
};

const cancelEditing = () => {
  isEditing.value = false;
  editForm.value = {
    username: '',
    email: '',
    phone: ''
  };
};

const saveProfile = async () => {
  try {
    await authStore.updateUserProfile(editForm.value);
    alert('个人信息更新成功！');
    isEditing.value = false;
  } catch (error) {
    alert(error.message || '更新失败，请重试');
  }
};

const handleAvatarUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  if (file.size > 2 * 1024 * 1024) {
    alert('图片大小不能超过2MB');
    return;
  }

  const reader = new FileReader();
  reader.onload = async (e) => {
    try {
      await authStore.updateAvatar(e.target.result);
      alert('头像更新成功！');
    } catch (error) {
      alert(error.message || '头像更新失败，请重试');
    }
  };
  reader.readAsDataURL(file);
};

const handleRecharge = () => {
  if (!rechargeAmount.value || rechargeAmount.value <= 0) {
    alert('请输入有效的充值金额');
    return;
  }
  showPaymentModal.value = true;
};

const confirmPayment = async () => {
  if (!selectedPaymentMethod.value) {
    alert('请选择支付方式');
    return;
  }
  const amount = parseInt(rechargeAmount.value);
  await authStore.rechargePoints(amount);
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

const refreshUserData = async () => {
  try {
    await authStore.initAuth();
  } catch (error) {
    console.error('刷新用户数据失败:', error);
  }
};

let refreshInterval = null;

onMounted(async () => {
  await refreshUserData();
  
  refreshInterval = setInterval(async () => {
    await refreshUserData();
  }, 30000);
});

onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
  }
});
</script>

<template>
  <!-- 未登录状态：显示登录/注册页面 -->
  <div v-if="showAuthView" class="personal-auth-page">
    <div class="auth-tabs">
      <button :class="['auth-tab', { active: authTab === 'login' }]" @click="authTab = 'login'">登录</button>
      <button :class="['auth-tab', { active: authTab === 'register' }]" @click="authTab = 'register'">注册</button>
    </div>
    <div v-if="registerSuccessMessage" class="register-success-msg">{{ registerSuccessMessage }}</div>
    <div class="auth-form-wrapper">
      <LoginView
        v-if="authTab === 'login'"
        @switch-to-register="handleSwitchToRegister"
        @login-success="handleLoginSuccess"
      />
      <RegisterView
        v-if="authTab === 'register'"
        @switch-to-login="handleSwitchToLogin"
        @register-success="handleRegisterSuccess"
      />
    </div>
  </div>

  <!-- 已登录状态：显示个人中心 -->
  <div v-else class="personal-page">
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
              { id: 'personalInfo', label: '个人资料', icon: '📋' },
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
            <div class="user-avatar-wrapper">
              <div class="user-avatar">
                <img :src="avatar || '../assets/logo.svg'" alt="用户头像">
              </div>
              <label class="avatar-upload-btn">
                <input type="file" accept="image/*" @change="handleAvatarUpload" style="display: none;">
                <span>更换头像</span>
              </label>
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
                  <span class="stat-value">{{ joinedActivities.length + joinedCourses.length }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">会员等级</span>
                  <span class="stat-value">普通会员</span>
                </div>
              </div>
          </header>

          <div class="tab-content">
            <div v-if="activeTab === 'profile'" class="profile-section">
              <div class="section-header">
                <h2>个人信息</h2>
                <button v-if="!isEditing" class="edit-btn" @click="startEditing">编辑</button>
                <div v-else class="edit-actions">
                  <button class="cancel-btn" @click="cancelEditing">取消</button>
                  <button class="save-btn" @click="saveProfile">保存</button>
                </div>
              </div>
              <div class="info-grid">
                <div class="info-card">
                  <div class="card-icon">👤</div>
                  <div class="card-content">
                    <label>用户名</label>
                    <div v-if="!isEditing" class="value">{{ user?.username || '访客用户' }}</div>
                    <input v-else v-model="editForm.username" class="edit-input" placeholder="请输入用户名">
                  </div>
                </div>
                <div class="info-card">
                  <div class="card-icon">📧</div>
                  <div class="card-content">
                    <label>邮箱</label>
                    <div v-if="!isEditing" class="value">{{ user?.email || '未设置' }}</div>
                    <input v-else v-model="editForm.email" type="email" class="edit-input" placeholder="请输入邮箱">
                  </div>
                </div>
                <div class="info-card">
                  <div class="card-icon">📱</div>
                  <div class="card-content">
                    <label>联系电话</label>
                    <div v-if="!isEditing" class="value">{{ user?.phone || '未设置' }}</div>
                    <input v-else v-model="editForm.phone" type="tel" class="edit-input" placeholder="请输入联系电话">
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
                    <div class="value">{{ joinedActivities.length + joinedCourses.length }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 个人资料板块（用于报名时自动填充） -->
            <div v-if="activeTab === 'personalInfo'" class="personal-info-section">
              <div class="section-header">
                <h2>个人资料</h2>
                <p class="section-desc">填写以下资料后，报名活动或申请认证时将自动填充</p>
                <button v-if="!isEditingPersonalInfo" class="edit-btn" @click="startEditingPersonalInfo">编辑资料</button>
                <div v-else class="edit-actions">
                  <button class="cancel-btn" @click="cancelEditingPersonalInfo">取消</button>
                  <button class="save-btn" @click="savePersonalInfo">保存</button>
                </div>
              </div>

              <div class="info-grid">
                <div class="info-card">
                  <div class="card-icon">👤</div>
                  <div class="card-content">
                    <label>姓名 *</label>
                    <div v-if="!isEditingPersonalInfo" class="value">{{ personalInfo.name || '未填写' }}</div>
                    <input v-else v-model="personalInfoForm.name" class="edit-input" placeholder="请输入真实姓名">
                  </div>
                </div>
                <div class="info-card">
                  <div class="card-icon">📱</div>
                  <div class="card-content">
                    <label>手机号 *</label>
                    <div v-if="!isEditingPersonalInfo" class="value">{{ personalInfo.phone || '未填写' }}</div>
                    <input v-else v-model="personalInfoForm.phone" type="tel" class="edit-input" placeholder="请输入手机号">
                  </div>
                </div>
                <div class="info-card">
                  <div class="card-icon">📧</div>
                  <div class="card-content">
                    <label>邮箱</label>
                    <div v-if="!isEditingPersonalInfo" class="value">{{ personalInfo.email || '未填写' }}</div>
                    <input v-else v-model="personalInfoForm.email" type="email" class="edit-input" placeholder="请输入邮箱">
                  </div>
                </div>
                <div class="info-card">
                  <div class="card-icon">🪪</div>
                  <div class="card-content">
                    <label>身份证号</label>
                    <div v-if="!isEditingPersonalInfo" class="value">{{ personalInfo.idCard || '未填写' }}</div>
                    <input v-else v-model="personalInfoForm.idCard" class="edit-input" placeholder="请输入身份证号">
                  </div>
                </div>
                <div class="info-card">
                  <div class="card-icon">🚻</div>
                  <div class="card-content">
                    <label>性别</label>
                    <div v-if="!isEditingPersonalInfo" class="value">{{ personalInfo.gender || '未填写' }}</div>
                    <select v-else v-model="personalInfoForm.gender" class="edit-input">
                      <option value="">请选择</option>
                      <option value="男">男</option>
                      <option value="女">女</option>
                    </select>
                  </div>
                </div>
                <div class="info-card">
                  <div class="card-icon">🎂</div>
                  <div class="card-content">
                    <label>年龄</label>
                    <div v-if="!isEditingPersonalInfo" class="value">{{ personalInfo.age || '未填写' }}</div>
                    <input v-else v-model="personalInfoForm.age" type="number" min="1" max="120" class="edit-input" placeholder="请输入年龄">
                  </div>
                </div>
                <div class="info-card">
                  <div class="card-icon">📏</div>
                  <div class="card-content">
                    <label>身高 (cm)</label>
                    <div v-if="!isEditingPersonalInfo" class="value">{{ personalInfo.height || '未填写' }}</div>
                    <input v-else v-model="personalInfoForm.height" type="number" min="50" max="250" class="edit-input" placeholder="请输入身高">
                  </div>
                </div>
                <div class="info-card">
                  <div class="card-icon">⚖️</div>
                  <div class="card-content">
                    <label>体重 (kg)</label>
                    <div v-if="!isEditingPersonalInfo" class="value">{{ personalInfo.weight || '未填写' }}</div>
                    <input v-else v-model="personalInfoForm.weight" type="number" min="20" max="300" class="edit-input" placeholder="请输入体重">
                  </div>
                </div>
                <div class="info-card">
                  <div class="card-icon">🚑</div>
                  <div class="card-content">
                    <label>紧急联系人</label>
                    <div v-if="!isEditingPersonalInfo" class="value">{{ personalInfo.emergencyContact || '未填写' }}</div>
                    <input v-else v-model="personalInfoForm.emergencyContact" class="edit-input" placeholder="请输入紧急联系人姓名">
                  </div>
                </div>
                <div class="info-card">
                  <div class="card-icon">📞</div>
                  <div class="card-content">
                    <label>紧急联系人电话</label>
                    <div v-if="!isEditingPersonalInfo" class="value">{{ personalInfo.emergencyPhone || '未填写' }}</div>
                    <input v-else v-model="personalInfoForm.emergencyPhone" type="tel" class="edit-input" placeholder="请输入紧急联系人电话">
                  </div>
                </div>
                <div class="info-card">
                  <div class="card-icon">🏋️</div>
                  <div class="card-content">
                    <label>体能水平</label>
                    <div v-if="!isEditingPersonalInfo" class="value">{{ personalInfo.fitnessLevel || '未填写' }}</div>
                    <select v-else v-model="personalInfoForm.fitnessLevel" class="edit-input">
                      <option value="">请选择</option>
                      <option value="初级">初级</option>
                      <option value="中级">中级</option>
                      <option value="高级">高级</option>
                      <option value="专业">专业</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- 经验与健康状况（全宽卡片） -->
              <div class="info-grid full-width-section" style="grid-template-columns: 1fr 1fr;">
                <div class="info-card tall-card">
                  <div class="card-icon">📝</div>
                  <div class="card-content">
                    <label>户外经验</label>
                    <div v-if="!isEditingPersonalInfo" class="value">{{ personalInfo.experience || '未填写' }}</div>
                    <textarea v-else v-model="personalInfoForm.experience" class="edit-input edit-textarea" placeholder="请描述您的户外运动经验，如攀岩、徒步、登山等经历" rows="4"></textarea>
                  </div>
                </div>
                <div class="info-card tall-card">
                  <div class="card-icon">❤️</div>
                  <div class="card-content">
                    <label>健康状况</label>
                    <div v-if="!isEditingPersonalInfo" class="value">{{ personalInfo.healthConditions || '未填写' }}</div>
                    <textarea v-else v-model="personalInfoForm.healthConditions" class="edit-input edit-textarea" placeholder="请说明您的健康状况，如有特殊疾病或过敏史请注明（选填）" rows="4"></textarea>
                  </div>
                </div>
              </div>

              <div class="auto-fill-notice">
                💡 保存以上资料后，在报名活动、申请课程或认证时，表单将自动填充您的个人信息。
              </div>
            </div>

            <div v-if="activeTab === 'activities'" class="activities-section">
              <h2>参与的活动</h2>
              <div v-if="joinedActivities.length === 0 && joinedCourses.length === 0" class="empty-state">
                <div class="empty-icon">📋</div>
                <p>暂无参与的活动和课程</p>
                <button class="action-btn" @click="browseActivities">去浏览活动</button>
              </div>
              <div v-else class="activities-list">
                <div v-for="activity in joinedActivities" :key="'activity-' + activity.id" class="activity-card">
                  <img :src="activity.image" :alt="activity.name" class="activity-image">
                  <div class="activity-info">
                    <h3>{{ activity.name }}</h3>
                    <p class="location">📍 {{ activity.location }}</p>
                    <p class="date">📅 {{ activity.date }}</p>
                    <p v-if="activity.club" class="club">🏔️ {{ activity.club }}</p>
                    <span :class="['status', activity.status]">{{ activity.status }}</span>
                  </div>
                </div>
                <div v-for="course in joinedCourses" :key="'course-' + course.id" class="activity-card course-card">
                  <img :src="course.image" :alt="course.name" class="activity-image">
                  <div class="activity-info">
                    <h3>{{ course.name }}</h3>
                    <p class="location">📚 {{ course.category }}</p>
                    <p class="date">📅 {{ course.date }}</p>
                    <p class="duration">⏱️ {{ course.duration }}</p>
                    <p class="price">💰 ¥{{ course.price }}</p>
                    <span :class="['status', course.status]">{{ course.status }}</span>
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
/* 未登录时的认证页面 */
.personal-auth-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding-top: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.auth-tabs {
  display: flex;
  gap: 0;
  margin-bottom: 1.5rem;
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.auth-tab {
  padding: 12px 40px;
  border: none;
  background: white;
  font-size: 16px;
  font-weight: 500;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;
}

.auth-tab.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.auth-tab:hover:not(.active) {
  color: #667eea;
  background: #f8f9fa;
}

.register-success-msg {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
  border-radius: 8px;
  padding: 12px 24px;
  margin-bottom: 1rem;
  font-weight: 500;
  max-width: 480px;
  width: 100%;
  text-align: center;
}

.auth-form-wrapper {
  width: 100%;
  max-width: 480px;
}

/* 隐藏嵌入的LoginView/RegisterView的容器背景，因为外层已有背景 */
.auth-form-wrapper :deep(.auth-container) {
  min-height: auto;
  background: transparent;
  padding: 0;
}

.personal-page {
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
  z-index: 100;
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
  position: relative;
  z-index: 101;
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
  width: 100%;
  position: relative;
  z-index: 1;
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

.user-avatar-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.avatar-upload-btn {
  padding: 6px 16px;
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  border: 1px solid #667eea;
  border-radius: 20px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.avatar-upload-btn:hover {
  background: #667eea;
  color: white;
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

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.edit-btn {
  padding: 8px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s;
}

.edit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.edit-actions {
  display: flex;
  gap: 10px;
}

.cancel-btn,
.save-btn {
  padding: 8px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s;
}

.cancel-btn {
  background: #f8f9fa;
  color: #6c757d;
}

.cancel-btn:hover {
  background: #e9ecef;
}

.save-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.save-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.edit-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s;
}

.edit-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
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

.activity-info p.club {
  color: #667eea;
  font-weight: 500;
}

.course-card {
  border: 2px solid #667eea;
}

.course-card .activity-info h3 {
  color: #667eea;
}

.activity-info p.duration {
  color: #28a745;
  font-weight: 500;
}

.activity-info p.price {
  color: #dc3545;
  font-weight: 600;
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

/* 个人资料板块 */
.personal-info-section .section-desc {
  flex: 1;
  margin: 0 20px;
  color: #6c757d;
  font-size: 14px;
}

.personal-info-section .section-header {
  flex-wrap: wrap;
  gap: 10px;
}

.tall-card {
  min-height: 160px;
  align-items: flex-start;
}

.tall-card .card-content {
  flex: 1;
}

.edit-textarea {
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
}

.full-width-section {
  margin-top: 20px;
}

.auto-fill-notice {
  margin-top: 25px;
  padding: 16px 20px;
  background: rgba(102, 126, 234, 0.08);
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: 10px;
  color: #667eea;
  font-size: 14px;
  text-align: center;
}

@media (max-width: 768px) {
  .full-width-section {
    grid-template-columns: 1fr !important;
  }
}
</style>
