<script setup>
import { ref, computed, onMounted } from 'vue';
import { hikingRoutes, rockClimbingSpots, mountainExpeditions } from '../data/activityData.js';
import { useAuthStore } from '../stores/authStore';

const authStore = useAuthStore();

const userInfo = ref({
  name: '',
  age: '',
  gender: '',
  height: '',
  weight: '',
  sportType: '',
  experience: '',
  intensity: '',
  duration: '',
  healthConditions: '',
  fitnessLevel: ''
});

onMounted(() => {
  if (authStore.isAuthenticated) {
    const info = authStore.personalInfo;
    userInfo.value.name = info.name || '';
    userInfo.value.age = info.age || '';
    userInfo.value.gender = info.gender || '';
    userInfo.value.height = info.height || '';
    userInfo.value.weight = info.weight || '';
    userInfo.value.experience = info.experience || '';
    userInfo.value.healthConditions = info.healthConditions || '';
    userInfo.value.fitnessLevel = info.fitnessLevel || '';
  }
});

const isGenerating = ref(false);
const hasRecommendations = ref(false);
const recommendedRoutes = ref([]);

const isFormValid = computed(() => {
  return userInfo.value.name &&
         userInfo.value.age &&
         userInfo.value.gender &&
         userInfo.value.sportType &&
         userInfo.value.experience &&
         userInfo.value.intensity &&
         userInfo.value.duration;
});

const generateRecommendations = () => {
  isGenerating.value = true;
  hasRecommendations.value = true;

  setTimeout(() => {
    recommendedRoutes.value = generateRouteSuggestions();
    isGenerating.value = false;
  }, 2000);
};

const generateRouteSuggestions = () => {
  const routes = [];
  const isBeginner = userInfo.value.experience === 'beginner';
  const isEasyIntensity = userInfo.value.intensity === 'easy';
  const isMediumIntensity = userInfo.value.intensity === 'moderate';
  const isHighIntensity = userInfo.value.intensity === 'challenging';

  let availableRoutes = [];
  switch (userInfo.value.sportType) {
    case 'hiking':
      availableRoutes = hikingRoutes;
      break;
    case 'mountainClimbing':
      availableRoutes = mountainExpeditions;
      break;
    case 'rockClimbing':
      availableRoutes = rockClimbingSpots;
      break;
    default:
      availableRoutes = [...hikingRoutes, ...mountainExpeditions, ...rockClimbingSpots];
  }

  const assignDifficultyLevel = (route) => {
    const difficultyText = route.difficulty;
    if (difficultyText.includes('初级') || difficultyText === '中等' || difficultyText === '入门级') {
      return 2;
    } else if (difficultyText.includes('中级') || difficultyText === '较高') {
      return 3;
    } else if (difficultyText.includes('高级') || difficultyText === '高') {
      return 4;
    } else {
      return 2;
    }
  };

  for (const route of availableRoutes) {
    const difficultyLevel = assignDifficultyLevel(route);

    if ((isBeginner && difficultyLevel <= 2) ||
        (!isBeginner && isEasyIntensity && difficultyLevel <= 2) ||
        (!isBeginner && isMediumIntensity && difficultyLevel <= 3) ||
        (!isBeginner && isHighIntensity)) {

      const recommendedRoute = {
        id: route.id,
        name: route.name,
        image: route.image,
        location: route.location,
        duration: route.duration,
        intensity: difficultyLevel <= 2 ? '轻松' : (difficultyLevel === 3 ? '中等' : '具挑战性'),
        difficulty: difficultyLevel.toString(),
        description: route.description,
        reason: generateReason(route, difficultyLevel),
        suitableFor: generateSuitableFor(route, difficultyLevel)
      };

      routes.push(recommendedRoute);
    }
  }

  while (routes.length < 3 && availableRoutes.length > routes.length) {
    const remainingRoutes = availableRoutes.filter(r => !routes.some(rec => rec.id === r.id));
    if (remainingRoutes.length === 0) break;

    const randomRoute = remainingRoutes[Math.floor(Math.random() * remainingRoutes.length)];
    const difficultyLevel = assignDifficultyLevel(randomRoute);

    const recommendedRoute = {
      id: randomRoute.id,
      name: randomRoute.name,
      image: randomRoute.image,
      location: randomRoute.location,
      duration: randomRoute.duration,
      intensity: difficultyLevel <= 2 ? '轻松' : (difficultyLevel === 3 ? '中等' : '具挑战性'),
      difficulty: difficultyLevel.toString(),
      description: randomRoute.description,
      reason: generateReason(randomRoute, difficultyLevel),
      suitableFor: generateSuitableFor(randomRoute, difficultyLevel)
    };

    routes.push(recommendedRoute);
  }

  return routes;
};

const generateReason = (route, difficultyLevel) => {
  const isBeginner = userInfo.value.experience === 'beginner';

  if (isBeginner) {
    return `基于您的初学者经验，为您推荐${route.name}。这条路线难度适中，适合户外运动初学者，能够在安全的环境中享受户外活动的乐趣。`;
  } else if (difficultyLevel === 2 || difficultyLevel === 3) {
    return `根据您的运动经验和强度偏好，为您推荐${route.name}。这条路线提供了适度的挑战，能够让您在欣赏美景的同时提升运动能力。`;
  } else {
    return `作为有经验的户外运动爱好者，${route.name}能够为您提供足够的挑战，让您充分体验户外运动的刺激与乐趣。`;
  }
};

const generateSuitableFor = (route, difficultyLevel) => {
  const suitableFor = [];

  if (difficultyLevel <= 2) {
    suitableFor.push('初学者');
    suitableFor.push('周末休闲');
  }

  if (difficultyLevel <= 3) {
    suitableFor.push('有经验爱好者');
    suitableFor.push('摄影爱好者');
  }

  if (difficultyLevel >= 3) {
    suitableFor.push('挑战自我');
  }

  if (route.duration && route.duration.includes('天')) {
    suitableFor.push('多日行程');
  } else {
    suitableFor.push('单日活动');
  }

  return suitableFor;
};

const viewRouteDetails = (route) => {
  alert(`查看路线详情: ${route.name}`);
};

const saveRoute = (route) => {
  alert(`已收藏路线: ${route.name}`);
};
</script>

<template>
  <div class="ai-custom-page">
    <!-- 页面标题区域 -->
    <div class="page-header">
      <div class="container">
        <h1 class="page-title">AI 路线定制</h1>
        <p class="page-description">根据您的个人信息和运动偏好，获取个性化的户外路线推荐</p>
      </div>
    </div>

    <div class="container">
      <div class="ai-custom-container">
        <!-- 输入表单 -->
        <div class="input-form">
          <h3 class="form-title">个人信息与偏好</h3>

          <!-- 个人基本信息 -->
          <div class="form-section">
            <h4 class="section-subtitle">基本信息</h4>

            <div class="form-group">
              <label for="name">姓名</label>
              <input type="text" id="name" v-model="userInfo.name" placeholder="请输入您的姓名">
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="age">年龄</label>
                <input type="number" id="age" v-model="userInfo.age" min="1" max="120" placeholder="请输入您的年龄">
              </div>

              <div class="form-group">
                <label for="gender">性别</label>
                <select id="gender" v-model="userInfo.gender">
                  <option value="">请选择</option>
                  <option value="male">男</option>
                  <option value="female">女</option>
                  <option value="other">其他</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="height">身高 (cm)</label>
                <input type="number" id="height" v-model="userInfo.height" min="50" max="250" placeholder="请输入您的身高">
              </div>

              <div class="form-group">
                <label for="weight">体重 (kg)</label>
                <input type="number" id="weight" v-model="userInfo.weight" min="10" max="300" placeholder="请输入您的体重">
              </div>
            </div>
          </div>

          <!-- 运动偏好 -->
          <div class="form-section">
            <h4 class="section-subtitle">运动偏好</h4>

            <div class="form-group">
              <label for="sportType">运动类型</label>
              <select id="sportType" v-model="userInfo.sportType">
                <option value="">请选择您想参加的运动类型</option>
                <option value="hiking">徒步旅行</option>
                <option value="mountainClimbing">登山</option>
                <option value="cycling">骑行</option>
                <option value="trailRunning">越野跑</option>
                <option value="camping">露营</option>
                <option value="rockClimbing">攀岩</option>
                <option value="waterSports">水上运动</option>
                <option value="generalOutdoor">综合户外</option>
              </select>
            </div>

            <div class="form-group">
              <label for="experience">运动经验</label>
              <select id="experience" v-model="userInfo.experience">
                <option value="">请选择您的运动经验</option>
                <option value="beginner">初学者 (0-1年)</option>
                <option value="intermediate">中级 (1-3年)</option>
                <option value="advanced">高级 (3年以上)</option>
                <option value="professional">专业水平</option>
              </select>
            </div>

            <div class="form-group">
              <label for="intensity">偏好强度</label>
              <select id="intensity" v-model="userInfo.intensity">
                <option value="">请选择您偏好的运动强度</option>
                <option value="easy">轻松休闲</option>
                <option value="moderate">中等强度</option>
                <option value="challenging">具挑战性</option>
                <option value="extreme">极限挑战</option>
              </select>
            </div>

            <div class="form-group">
              <label for="duration">预计时长</label>
              <select id="duration" v-model="userInfo.duration">
                <option value="">请选择您的运动时长</option>
                <option value="halfDay">半天 (4小时以内)</option>
                <option value="fullDay">一天 (4-8小时)</option>
                <option value="weekend">周末 (1-2天)</option>
                <option value="weekLong">多日 (3天以上)</option>
              </select>
            </div>
          </div>

          <!-- 生成推荐按钮 -->
          <div class="form-actions">
            <button class="generate-btn" @click="generateRecommendations" :disabled="isGenerating || !isFormValid">
              <span v-if="!isGenerating">生成推荐路线</span>
              <span v-else class="loading">正在生成...</span>
            </button>
          </div>
        </div>

        <!-- 推荐结果 -->
        <div class="recommendations">
          <h3 class="recommendations-title">推荐路线</h3>

          <!-- 未生成推荐时的提示 -->
          <div v-if="!hasRecommendations" class="no-recommendations">
            <div class="ai-icon">🤖</div>
            <p>请填写您的信息并点击生成按钮，获取个性化的路线推荐</p>
          </div>

          <!-- 生成推荐时的加载状态 -->
          <div v-else-if="isGenerating" class="loading-state">
            <div class="loading-spinner"></div>
            <p>AI正在为您分析和定制最佳路线...</p>
          </div>

          <!-- 推荐结果列表 -->
          <div v-else class="recommendations-list">
            <div v-for="(route, index) in recommendedRoutes" :key="index" class="route-card" :class="{ 'top-recommendation': index === 0 }">
              <div v-if="index === 0" class="top-badge">最佳推荐</div>

              <div class="route-image">
                <img :src="route.image" :alt="route.name" class="route-photo">
              </div>

              <div class="route-info">
                <h4 class="route-name">{{ route.name }}</h4>

                <div class="route-meta">
                  <div class="meta-item">
                    <span class="meta-icon">🏔️</span>
                    {{ route.location }}
                  </div>
                  <div class="meta-item">
                    <span class="meta-icon">⏱️</span>
                    {{ route.duration }}
                  </div>
                  <div class="meta-item">
                    <span class="meta-icon">⚡</span>
                    {{ route.intensity }}
                  </div>
                  <div class="meta-item">
                    <span class="meta-icon">⭐</span>
                    {{ route.difficulty }}级
                  </div>
                </div>

                <p class="route-description">{{ route.description }}</p>

                <div class="route-reason">
                  <h5 class="reason-title">推荐理由</h5>
                  <p>{{ route.reason }}</p>
                </div>

                <div class="route-suitable">
                  <h5 class="suitable-title">适合人群</h5>
                  <div class="suitable-tags">
                    <span v-for="(tag, tagIndex) in route.suitableFor" :key="tagIndex" class="suitable-tag">
                      {{ tag }}
                    </span>
                  </div>
                </div>

                <div class="route-actions">
                  <button class="detail-btn" @click="viewRouteDetails(route)">查看详情</button>
                  <button class="save-btn" @click="saveRoute(route)">收藏路线</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ai-custom-page {
  min-height: 100vh;
  padding-bottom: 5rem;
}

.page-header {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.9), rgba(118, 75, 162, 0.9)),
              url('https://images.unsplash.com/photo-1551632811-561732d1e306?w=1920&h=600&fit=crop');
  background-size: cover;
  background-position: center;
  padding: 6rem 0 4rem;
  text-align: center;
  color: white;
}

.page-title {
  font-size: 3rem;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.page-description {
  font-size: 1.2rem;
  opacity: 0.9;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* 主容器布局 */
.ai-custom-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  background-color: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  margin-top: 3rem;
}

/* 输入表单样式 */
.input-form {
  padding: 2.5rem;
  background-color: #f8f9fa;
}

.form-title {
  font-size: 1.5rem;
  color: #2c3e50;
  margin-bottom: 2rem;
  font-weight: 600;
}

.form-section {
  margin-bottom: 2rem;
}

.section-subtitle {
  font-size: 1.1rem;
  color: #34495e;
  margin-bottom: 1rem;
  font-weight: 500;
  border-left: 3px solid #3498db;
  padding-left: 0.8rem;
}

.form-group {
  margin-bottom: 1.2rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #2c3e50;
  font-size: 0.95rem;
}

input[type="text"],
input[type="number"],
select,
textarea {
  width: 100%;
  padding: 0.8rem 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.95rem;
  transition: border-color 0.2s;
}

input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

/* 生成按钮 */
.form-actions {
  margin-top: 2rem;
}

.generate-btn {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.generate-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.generate-btn:disabled {
  background: #95a5a6;
  cursor: not-allowed;
}

.loading::after {
  content: '';
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
  margin-left: 8px;
  display: inline-block;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 推荐结果样式 */
.recommendations {
  padding: 2.5rem;
  background-color: white;
  overflow-y: auto;
  max-height: 800px;
}

.recommendations-title {
  font-size: 1.5rem;
  color: #2c3e50;
  margin-bottom: 2rem;
  font-weight: 600;
}

.no-recommendations {
  text-align: center;
  padding: 3rem 1rem;
  color: #7f8c8d;
}

.ai-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.loading-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #3498db;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(52, 152, 219, 0.1);
  border-radius: 50%;
  border-top-color: #3498db;
  animation: spin 1s ease-in-out infinite;
  margin: 0 auto 1rem;
}

.recommendations-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.route-card {
  background-color: #f8f9fa;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.2s;
  position: relative;
}

.route-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

.top-recommendation {
  border: 2px solid #f1c40f;
}

.top-badge {
  position: absolute;
  top: 0;
  right: 0;
  background: linear-gradient(135deg, #f1c40f 0%, #f39c12 100%);
  color: white;
  padding: 0.4rem 1rem;
  font-size: 0.85rem;
  font-weight: 600;
  border-bottom-left-radius: 12px;
  z-index: 1;
}

.route-image {
  height: 160px;
  overflow: hidden;
}

.route-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}

.route-card:hover .route-photo {
  transform: scale(1.05);
}

.route-info {
  padding: 1.5rem;
}

.route-name {
  font-size: 1.2rem;
  color: #2c3e50;
  margin: 0 0 1rem 0;
  font-weight: 600;
}

.route-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.9rem;
  color: #7f8c8d;
}

.route-description {
  color: #34495e;
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.route-reason,
.route-suitable {
  margin-bottom: 1rem;
}

.reason-title,
.suitable-title {
  font-size: 1rem;
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
  font-weight: 500;
}

.suitable-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.suitable-tag {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 16px;
  font-size: 0.85rem;
}

.route-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.detail-btn,
.save-btn {
  flex: 1;
  padding: 0.7rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s;
}

.detail-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.detail-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.save-btn {
  background-color: white;
  border: 1px solid #667eea;
  color: #667eea;
}

.save-btn:hover {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

/* 响应式设计 */
@media (max-width: 992px) {
  .ai-custom-container {
    grid-template-columns: 1fr;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 0;
  }

  .recommendations {
    max-height: none;
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }

  .input-form,
  .recommendations {
    padding: 1.5rem;
  }
}
</style>
