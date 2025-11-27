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
      // 基于用户输入生成推荐路线
      const routes = []
      const userAge = parseInt(this.userInfo.age)
      const isBeginner = this.userInfo.experience === 'beginner'
      const isEasyIntensity = this.userInfo.intensity === 'easy'
      
      // 根据运动类型和用户信息生成不同的推荐
      switch (this.userInfo.sportType) {
        case 'hiking':
          if (isBeginner || isEasyIntensity || userAge > 50) {
            routes.push(
              {
                id: 1,
                name: '城市周边轻松徒步',
                image: '/mount-everest.jpg',
                location: '北京香山',
                duration: '3-4小时',
                intensity: '轻松',
                difficulty: '1',
                description: '适合初学者的平缓山路，沿途风景优美，空气清新，海拔上升适中，全程约8公里。',
                reason: `基于您的运动经验和偏好，为您推荐这条轻松的徒步路线。路线难度适中，适合${this.userInfo.age}岁${this.userInfo.gender === 'male' ? '男性' : '女性'}的初学者，能够在享受自然的同时，逐步提升体能。`,
                suitableFor: ['初学者', '周末休闲', '家庭出游', '摄影爱好者']
              },
              {
                id: 2,
                name: '森林公园漫步',
                image: '/new-mount-everest.jpg',
                location: '奥林匹克森林公园',
                duration: '2-3小时',
                intensity: '非常轻松',
                difficulty: '1',
                description: '平坦的步道，茂密的树林，适合散步和轻度徒步，全程约6公里，有休息区和卫生间。',
                reason: '这条路线完全平坦，适合各种年龄段的户外活动爱好者，特别是如果您希望以轻松的方式开始户外活动。',
                suitableFor: ['所有人', '休闲散步', '晨练', '带宠物']
              }
            )
          } else {
            routes.push(
              {
                id: 3,
                name: '高山草甸徒步',
                image: '/mount-everest.jpg',
                location: '河北小五台',
                duration: '1天',
                intensity: '中等',
                difficulty: '3',
                description: '高山草甸景观，视野开阔，全程约15公里，有一定的爬升，需要良好的体力。',
                reason: '对于有一定经验的徒步爱好者，这条路线提供了壮丽的高山景色和适度的挑战，符合您的运动强度偏好。',
                suitableFor: ['有经验徒步者', '摄影爱好者', '自然探索']
              },
              {
                id: 4,
                name: '长城徒步',
                image: '/new-mount-everest.jpg',
                location: '箭扣长城',
                duration: '1天',
                intensity: '具挑战性',
                difficulty: '4',
                description: '未修复的野长城，部分路段需要攀爬，景色壮观，全程约12公里，需要专业装备。',
                reason: '这条路线提供了历史文化体验和户外挑战的完美结合，适合寻求刺激的有经验徒步者。',
                suitableFor: ['高级徒步者', '摄影爱好者', '历史文化爱好者']
              }
            )
          }
          break
          
        case 'mountainClimbing':
          if (isBeginner || isEasyIntensity) {
            routes.push(
              {
                id: 5,
                name: '初级登山体验',
                image: '/mount-everest.jpg',
                location: '北京妙峰山',
                duration: '1天',
                intensity: '中等',
                difficulty: '2',
                description: '适合初级登山者的路线，有明确的步道，海拔上升约800米，全程约10公里。',
                reason: '作为初学者的登山起点，这条路线安全系数高，同时能够体验登山的乐趣和成就感。',
                suitableFor: ['初级登山者', '周末活动', '团队建设']
              }
            )
          } else {
            routes.push(
              {
                id: 6,
                name: '高山攀登',
                image: '/new-mount-everest.jpg',
                location: '北京灵山',
                duration: '2天',
                intensity: '高',
                difficulty: '4',
                description: '北京地区最高峰，海拔2303米，需要两天时间，有一定的技术要求，需要专业指导。',
                reason: '对于有经验的登山者，这条路线提供了足够的挑战和成就感，能够测试您的体能和技巧。',
                suitableFor: ['有经验登山者', '挑战自我', '高山摄影']
              }
            )
          }
          break
          
        case 'cycling':
          routes.push(
            {
              id: 7,
              name: isBeginner ? '城市周边骑行' : '山地自行车越野',
              image: '/mount-everest.jpg',
              location: isBeginner ? '温榆河绿道' : '昌平山地车公园',
              duration: isBeginner ? '3-4小时' : '1天',
              intensity: isBeginner ? '轻松' : '中等',
              difficulty: isBeginner ? '1' : '3',
              description: isBeginner ? 
                '平坦的自行车专用道，沿途风景优美，距离适中，适合休闲骑行。' : 
                '专业的山地车赛道，有起伏和障碍，适合有经验的骑行爱好者。',
              reason: isBeginner ? 
                '这条路线为骑行初学者提供了安全舒适的环境，能够享受骑行的乐趣同时锻炼体能。' : 
                '根据您的骑行经验，这条山地路线能够提供足够的挑战和刺激，同时风景优美。',
              suitableFor: isBeginner ? 
                ['骑行初学者', '家庭出游', '休闲健身'] : 
                ['山地车爱好者', '越野骑行', '技巧提升']
            }
          )
          break
          
        default:
          // 综合户外推荐
          routes.push(
            {
              id: 8,
              name: '综合户外体验',
              image: '/mount-everest.jpg',
              location: '北京怀柔户外基地',
              duration: '1天',
              intensity: '中等',
              difficulty: '2',
              description: '结合徒步、攀岩、绳索等多种户外活动，一站式体验户外运动的乐趣。',
              reason: `根据您的综合信息，为您推荐这个户外基地，可以尝试多种活动，找到最适合您的户外运动方式。`,
              suitableFor: ['户外爱好者', '团队建设', '初次体验', '周末出游']
            }
          )
      }
      
      // 如果推荐太少，补充一些通用推荐
      while (routes.length < 3) {
        routes.push({
          id: 10 + routes.length,
          name: `通用户外路线${routes.length + 1}`,
          image: routes.length % 2 === 0 ? '/mount-everest.jpg' : '/new-mount-everest.jpg',
          location: ['北京西山', '密云水库', '延庆八达岭'][routes.length % 3],
          duration: ['半天', '一天', '两天'][routes.length % 3],
          intensity: ['轻松', '中等', '有挑战'][routes.length % 3],
          difficulty: (routes.length % 3) + 1,
          description: `这是一条适合${this.userInfo.experience === 'beginner' ? '初学者' : '有经验者'}的路线，风景优美，环境舒适。`,
          reason: `基于您的信息，我们推荐这条路线，它能够满足您的户外运动需求。`,
          suitableFor: ['户外爱好者', '摄影', '休闲', '健身']
        })
      }
      
      return routes
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