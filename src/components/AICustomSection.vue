<template>
  <section id="ai-custom-section" class="ai-custom-section">
    <div class="container">
      <h2 class="section-title">AI 路线定制</h2>
      <p class="section-description">根据您的个人信息和运动偏好，获取个性化的户外路线推荐</p>
      
      <div class="ai-custom-container">
        <!-- 输入表单 -->
        <div class="input-form">
          <h3 class="form-title">个人信息与偏好</h3>
          
          <!-- 个人基本信息 -->
          <div class="form-section">
            <h4 class="section-subtitle">基本信息</h4>
            
            <div class="form-group">
              <label for="name">姓名</label>
              <input 
                type="text" 
                id="name" 
                v-model="userInfo.name"
                placeholder="请输入您的姓名"
              >
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="age">年龄</label>
                <input 
                  type="number" 
                  id="age" 
                  v-model="userInfo.age"
                  min="1" 
                  max="120"
                  placeholder="请输入您的年龄"
                >
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
                <input 
                  type="number" 
                  id="height" 
                  v-model="userInfo.height"
                  min="50" 
                  max="250"
                  placeholder="请输入您的身高"
                >
              </div>
              
              <div class="form-group">
                <label for="weight">体重 (kg)</label>
                <input 
                  type="number" 
                  id="weight" 
                  v-model="userInfo.weight"
                  min="10" 
                  max="300"
                  placeholder="请输入您的体重"
                >
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
          
          <!-- 体检报告（选填） -->
          <div class="form-section">
            <h4 class="section-subtitle">健康状况（选填）</h4>
            
            <div class="form-group">
              <label for="healthConditions">健康状况说明</label>
              <textarea 
                id="healthConditions" 
                v-model="userInfo.healthConditions"
                rows="4"
                placeholder="如有特殊健康状况请说明，如心脏病、高血压、关节问题等（选填）"
              ></textarea>
            </div>
            
            <div class="form-group">
              <label for="fitnessLevel">自我评估体能水平</label>
              <select id="fitnessLevel" v-model="userInfo.fitnessLevel">
                <option value="">请选择</option>
                <option value="low">较弱</option>
                <option value="medium">一般</option>
                <option value="good">良好</option>
                <option value="excellent">优秀</option>
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
            <div 
              v-for="(route, index) in recommendedRoutes" 
              :key="index" 
              class="route-card"
              :class="{ 'top-recommendation': index === 0 }"
            >
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
  </section>
</template>

<script>
// 导入活动数据
import { hikingRoutes, rockClimbingSpots, mountainExpeditions } from '../data/activityData.js';

export default {
  name: 'AICustomSection',
  data() {
    return {
      // 用户输入信息
      userInfo: {
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
      },
      // 是否正在生成推荐
      isGenerating: false,
      // 是否有推荐结果
      hasRecommendations: false,
      // 推荐路线列表
      recommendedRoutes: []
    }
  },
  computed: {
    // 计算表单是否有效
    isFormValid() {
      return this.userInfo.name && 
             this.userInfo.age && 
             this.userInfo.gender && 
             this.userInfo.sportType && 
             this.userInfo.experience && 
             this.userInfo.intensity && 
             this.userInfo.duration
    }
  },
  methods: {
    // 生成路线推荐
    generateRecommendations() {
      this.isGenerating = true
      this.hasRecommendations = true
      
      // 模拟AI分析延迟
      setTimeout(() => {
        this.recommendedRoutes = this.generateRouteSuggestions()
        this.isGenerating = false
      }, 2000)
    },
    
    // 根据用户信息生成路线推荐
    generateRouteSuggestions() {
      // 基于用户输入从活动报名中选择推荐路线
      const routes = []
      const userAge = parseInt(this.userInfo.age)
      const isBeginner = this.userInfo.experience === 'beginner'
      const isEasyIntensity = this.userInfo.intensity === 'easy'
      const isMediumIntensity = this.userInfo.intensity === 'medium'
      const isHighIntensity = this.userInfo.intensity === 'high'
      
      // 根据运动类型选择对应的活动数据
      let availableRoutes = []
      switch (this.userInfo.sportType) {
        case 'hiking':
          availableRoutes = hikingRoutes
          break
        case 'mountainClimbing':
          availableRoutes = mountainExpeditions
          break
        case 'rockClimbing':
          availableRoutes = rockClimbingSpots
          break
        default:
          // 如果是其他运动类型，合并所有路线
          availableRoutes = [...hikingRoutes, ...mountainExpeditions, ...rockClimbingSpots]
      }
      
      // 根据用户经验和强度偏好筛选路线
      let filteredRoutes = []
      
      // 为不同难度的路线分配难度等级数字
      const assignDifficultyLevel = (route) => {
        const difficultyText = route.difficulty
        if (difficultyText.includes('初级') || difficultyText === '中等' || difficultyText === '入门级') {
          return 2
        } else if (difficultyText.includes('中级') || difficultyText === '较高') {
          return 3
        } else if (difficultyText.includes('高级') || difficultyText === '高') {
          return 4
        } else {
          return 2 // 默认中等难度
        }
      }
      
      // 筛选路线
      for (const route of availableRoutes) {
        const difficultyLevel = assignDifficultyLevel(route)
        
        // 根据用户经验和强度偏好匹配路线
        if ((isBeginner && difficultyLevel <= 2) || 
            (!isBeginner && isEasyIntensity && difficultyLevel <= 2) || 
            (!isBeginner && isMediumIntensity && difficultyLevel <= 3) || 
            (!isBeginner && isHighIntensity)) {
          
          // 将活动数据转换为推荐路线格式
          const recommendedRoute = {
            id: route.id,
            name: route.name,
            image: route.image,
            location: route.location,
            duration: route.duration,
            intensity: difficultyLevel <= 2 ? '轻松' : (difficultyLevel === 3 ? '中等' : '具挑战性'),
            difficulty: difficultyLevel.toString(),
            description: route.description,
            reason: this.generateReason(route, difficultyLevel),
            suitableFor: this.generateSuitableFor(route, difficultyLevel)
          }
          
          routes.push(recommendedRoute)
        }
      }
      
      // 如果筛选后的路线不足3个，添加更多路线
      while (routes.length < 3 && availableRoutes.length > routes.length) {
        // 从可用路线中随机选择未添加的路线
        const remainingRoutes = availableRoutes.filter(r => !routes.some(rec => rec.id === r.id))
        if (remainingRoutes.length === 0) break
        
        const randomRoute = remainingRoutes[Math.floor(Math.random() * remainingRoutes.length)]
        const difficultyLevel = assignDifficultyLevel(randomRoute)
        
        const recommendedRoute = {
          id: randomRoute.id,
          name: randomRoute.name,
          image: randomRoute.image,
          location: randomRoute.location,
          duration: randomRoute.duration,
          intensity: difficultyLevel <= 2 ? '轻松' : (difficultyLevel === 3 ? '中等' : '具挑战性'),
          difficulty: difficultyLevel.toString(),
          description: randomRoute.description,
          reason: this.generateReason(randomRoute, difficultyLevel),
          suitableFor: this.generateSuitableFor(randomRoute, difficultyLevel)
        }
        
        routes.push(recommendedRoute)
      }
      
      return routes
    },
    
    // 生成推荐理由
    generateReason(route, difficultyLevel) {
      const userAge = parseInt(this.userInfo.age)
      const isBeginner = this.userInfo.experience === 'beginner'
      
      if (isBeginner) {
        return `基于您的初学者经验，为您推荐${route.name}。这条路线难度适中，适合${userAge}岁的户外运动初学者，能够在安全的环境中享受户外活动的乐趣。`
      } else if (difficultyLevel === 2 || difficultyLevel === 3) {
        return `根据您的运动经验和强度偏好，为您推荐${route.name}。这条路线提供了适度的挑战，能够让您在欣赏美景的同时提升运动能力。`
      } else {
        return `作为有经验的户外运动爱好者，${route.name}能够为您提供足够的挑战，让您充分体验户外运动的刺激与乐趣。`
      }
    },
    
    // 生成适合人群
    generateSuitableFor(route, difficultyLevel) {
      const suitableFor = []
      
      if (difficultyLevel <= 2) {
        suitableFor.push('初学者')
        suitableFor.push('周末休闲')
      }
      
      if (difficultyLevel <= 3) {
        suitableFor.push('有经验爱好者')
        suitableFor.push('摄影爱好者')
      }
      
      if (difficultyLevel >= 3) {
        suitableFor.push('挑战自我')
      }
      
      if (route.duration && route.duration.includes('天')) {
        suitableFor.push('多日行程')
      } else {
        suitableFor.push('单日活动')
      }
      
      return suitableFor
    },
    
    // 查看路线详情
    viewRouteDetails(route) {
      alert(`查看路线详情: ${route.name}`)
      // 这里可以添加跳转到路线详情页面的逻辑
    },
    
    // 收藏路线
    saveRoute(route) {
      alert(`已收藏路线: ${route.name}`)
      // 这里可以添加保存到用户收藏夹的逻辑
    }
  }
}
</script>

<style scoped>
.ai-custom-section {
  padding: 5rem 0;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.section-title {
  font-size: 2.2rem;
  color: #2c3e50;
  text-align: center;
  margin-bottom: 1rem;
  font-weight: 700;
}

.section-description {
  font-size: 1.1rem;
  color: #7f8c8d;
  text-align: center;
  margin-bottom: 4rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

/* 主容器布局 */
.ai-custom-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
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
  font-size: 1.2rem;
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

textarea {
  resize: vertical;
  min-height: 80px;
}

/* 生成按钮 */
.form-actions {
  margin-top: 2rem;
}

.generate-btn {
  width: 100%;
  padding: 1rem;
  background-color: #27ae60;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.generate-btn:hover:not(:disabled) {
  background-color: #229954;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(39, 174, 96, 0.3);
}

.generate-btn:disabled {
  background-color: #95a5a6;
  cursor: not-allowed;
  transform: none;
}

.loading {
  display: inline-flex;
  align-items: center;
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

/* 无推荐时的提示 */
.no-recommendations {
  text-align: center;
  padding: 3rem 1rem;
  color: #7f8c8d;
}

.ai-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

/* 加载状态 */
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

/* 推荐列表 */
.recommendations-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.route-card {
  background-color: #f8f9fa;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
  position: relative;
}

.route-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.top-recommendation {
  border: 2px solid #f1c40f;
}

.top-badge {
  position: absolute;
  top: 0;
  right: 0;
  background-color: #f1c40f;
  color: white;
  padding: 0.3rem 1rem;
  font-size: 0.8rem;
  font-weight: 600;
  border-bottom-left-radius: 8px;
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

.meta-icon {
  font-size: 1rem;
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

.route-reason p {
  color: #34495e;
  font-size: 0.9rem;
  line-height: 1.5;
}

.suitable-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.suitable-tag {
  background-color: #ecf0f1;
  color: #7f8c8d;
  padding: 0.2rem 0.8rem;
  border-radius: 16px;
  font-size: 0.85rem;
}

.route-actions {
  display: flex;
  gap: 1rem;
}

.detail-btn,
.save-btn {
  flex: 1;
  padding: 0.6rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s;
}

.detail-btn {
  background-color: #3498db;
  color: white;
}

.detail-btn:hover {
  background-color: #2980b9;
}

.save-btn {
  background-color: white;
  border: 1px solid #3498db;
  color: #3498db;
}

.save-btn:hover {
  background-color: #3498db;
  color: white;
}

/* 响应式设计 */
@media (max-width: 992px) {
  .ai-custom-container {
    grid-template-columns: 1fr;
  }
  
  .form-row {
    grid-template-columns: 1fr;
    gap: 1.2rem;
  }
}

@media (max-width: 768px) {
  .ai-custom-section {
    padding: 3rem 0;
  }
  
  .input-form,
  .recommendations {
    padding: 1.5rem;
  }
  
  .section-title {
    font-size: 1.8rem;
  }
  
  .section-description {
    font-size: 1rem;
  }
  
  .route-image {
    height: 140px;
  }
  
  .route-actions {
    flex-direction: column;
  }
}
</style>