<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import peakClubLogo from '@/assets/peak-club-logo.svg';
import explorerClubLogo from '@/assets/explorer-club-logo.svg';
import braveClubLogo from '@/assets/brave-club-logo.svg';

const router = useRouter();

// 俱乐部数据
const clubs = ref([
  {
    id: 1,
    name: '巅峰户外俱乐部',
    rating: 4.8,
    reviewCount: 236,
    image: peakClubLogo,
    founded: '2014年3月',
    experience: '10年',
    guides: '28名专业向导',
    highlights: ['10年专业登山经验', '国家级教练团队', '进口专业装备'],
    routes: [
      { name: '初级登山', price: 398 },
      { name: '中级挑战', price: 698 },
      { name: '高级攀登', price: 1298 }
    ]
  },
  {
    id: 2,
    name: '探索者户外联盟',
    rating: 4.6,
    reviewCount: 189,
    image: explorerClubLogo,
    founded: '2016年8月',
    experience: '8年',
    guides: '22名专业向导',
    highlights: ['野外生存技能培训', '多样化探险活动', '定制团队建设'],
    routes: [
      { name: '森林探险', price: 498 },
      { name: '山地露营', price: 898 },
      { name: '峡谷漂流', price: 598 }
    ]
  },
  {
    id: 3,
    name: '勇者户外团队',
    rating: 4.7,
    reviewCount: 156,
    image: braveClubLogo,
    founded: '2015年5月',
    experience: '9年',
    guides: '25名专业向导',
    highlights: ['全季节户外活动', '青少年训练营', '企业团建专家'],
    routes: [
      { name: '周末徒步', price: 298 },
      { name: '攀岩体验', price: 498 },
      { name: '雪山攀登', price: 1698 }
    ]
  }
]);

const showCustomerService = ref(false);
const selectedClub = ref(null);
const messageInput = ref('');
const chatMessages = ref([]);

const openCustomerService = (club) => {
  selectedClub.value = club;
  showCustomerService.value = true;
  chatMessages.value = [
    {
      type: 'service',
      content: `您好！欢迎咨询${club.name}，我是专属客服，请问有什么可以帮您的？`,
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    }
  ];
};

const closeCustomerService = () => {
  showCustomerService.value = false;
  selectedClub.value = null;
  chatMessages.value = [];
};

const sendMessage = () => {
  if (!messageInput.value.trim()) return;

  const userMessage = {
    type: 'user',
    content: messageInput.value,
    time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  };

  chatMessages.value.push(userMessage);
  const userQuestion = messageInput.value.toLowerCase();
  messageInput.value = '';

  setTimeout(() => {
    let responseContent = '';
    const club = selectedClub.value;

    if (userQuestion.includes('路线') || userQuestion.includes('推荐')) {
      const routes = club.routes.map(route => `• ${route.name} - ¥${route.price}`).join('\n');
      responseContent = `我们为您推荐以下路线：\n\n${routes}\n\n您可以根据自己的经验和体力选择合适的路线。`;
    } else if (userQuestion.includes('价格') || userQuestion.includes('多少钱')) {
      const prices = club.routes.map(route => `• ${route.name}：¥${route.price}`).join('\n');
      responseContent = `我们的路线价格如下：\n\n${prices}\n\n价格包含：专业向导、基础装备、保险等。`;
    } else {
      responseContent = `感谢您的咨询！关于"${userMessage.content}"这个问题，我们的专业客服会尽快为您详细解答。`;
    }

    const serviceResponse = {
      type: 'service',
      content: responseContent,
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    };
    chatMessages.value.push(serviceResponse);
  }, 1000);
};

const viewClubDetails = (clubId) => {
  router.push(`/clubs/${clubId}`);
};
</script>

<template>
  <div class="clubs-page">
    <!-- 页面标题区域 -->
    <div class="page-header">
      <div class="container">
        <h1 class="page-title">探索俱乐部</h1>
        <p class="page-description">选择专业的户外俱乐部，开启精彩的户外冒险之旅</p>
      </div>
    </div>

    <div class="container">
      <!-- 俱乐部网格 -->
      <div class="clubs-grid">
        <div v-for="club in clubs" :key="club.id" class="club-card">
          <div class="club-image">
            <img :src="club.image" :alt="club.name" class="club-photo">
          </div>

          <div class="club-info">
            <h3 class="club-name">{{ club.name }}</h3>

            <div class="club-rating">
              <span class="stars">{{ '★'.repeat(Math.floor(club.rating)) }}</span>
              <span class="rating-number">{{ club.rating }}</span>
              <span class="review-count">({{ club.reviewCount }}条评价)</span>
            </div>

            <div class="club-highlights">
              <h4 class="highlight-title">主要优势</h4>
              <ul class="advantages-list">
                <li v-for="(advantage, index) in club.highlights" :key="index" class="advantage-item">
                  <span class="advantage-icon">✓</span>
                  {{ advantage }}
                </li>
              </ul>
            </div>

            <div class="club-prices">
              <h4 class="price-title">热门路线</h4>
              <div class="routes-prices">
                <div v-for="(route, index) in club.routes" :key="index" class="route-price-item">
                  <span class="route-name">{{ route.name }}</span>
                  <span class="route-price">¥{{ route.price }}</span>
                </div>
              </div>
            </div>

            <div class="club-actions">
              <button class="view-details-btn" @click="viewClubDetails(club.id)">查看详情</button>
              <button class="contact-btn" @click="openCustomerService(club)">联系我们</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 客服服务弹窗 -->
    <div v-if="showCustomerService" class="customer-service-overlay" @click="closeCustomerService">
      <div class="customer-service-modal" @click.stop>
        <div class="cs-header">
          <div class="cs-title">
            <span class="cs-icon">💬</span>
            <span class="cs-text">客服服务</span>
          </div>
          <div class="cs-club-info">
            <span class="club-name">{{ selectedClub?.name }}</span>
          </div>
          <button class="cs-close-btn" @click="closeCustomerService">×</button>
        </div>

        <div class="cs-body">
          <div class="chat-messages" ref="chatContainer">
            <div v-for="(message, index) in chatMessages" :key="index" :class="['message', message.type]">
              <div class="message-content">
                <div class="message-text">{{ message.content }}</div>
                <div class="message-time">{{ message.time }}</div>
              </div>
            </div>
          </div>

          <div class="quick-replies">
            <div v-for="(reply, index) in ['请问有哪些路线可以推荐？', '价格是多少？', '需要准备什么装备？', '如何报名？']"
                 :key="index" class="quick-reply-item" @click="messageInput = reply; sendMessage()">
              {{ reply }}
            </div>
          </div>

          <div class="chat-input-area">
            <textarea v-model="messageInput" class="message-input" placeholder="请输入您的问题..."
                      @keydown.enter.prevent="sendMessage" rows="3"></textarea>
            <button class="send-btn" @click="sendMessage">
              <span class="send-icon">📤</span>
              发送
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.clubs-page {
  min-height: 100vh;
  padding-bottom: 5rem;
}

.page-header {
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.4)),
              url('https://images.unsplash.com/photo-1526772662000-3f88f10405ff?w=1920&h=600&fit=crop');
  background-size: cover;
  background-position: center;
  padding: 6rem 0 4rem;
  text-align: center;
  color: white;
}

.page-title {
  font-size: 3rem;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.page-description {
  font-size: 1.2rem;
  opacity: 0.9;
}

.container {
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* 俱乐部网格 */
.clubs-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2.5rem;
  margin-top: 3rem;
}

/* 俱乐部卡片 */
.club-card {
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.club-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

/* 俱乐部图片 */
.club-image {
  height: 200px;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.club-photo {
  width: 120px;
  height: 120px;
  object-fit: contain;
}

/* 俱乐部信息 */
.club-info {
  padding: 1.5rem;
}

.club-name {
  font-size: 1.4rem;
  color: #2c3e50;
  margin: 0 0 1rem 0;
  font-weight: 600;
}

/* 评分 */
.club-rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.stars {
  color: #f1c40f;
  font-size: 1.1rem;
}

.rating-number {
  font-size: 1rem;
  font-weight: 600;
  color: #2c3e50;
}

.review-count {
  color: #7f8c8d;
  font-size: 0.9rem;
}

/* 主要优势 */
.club-highlights {
  margin-bottom: 1.5rem;
}

.highlight-title,
.price-title {
  font-size: 1.1rem;
  color: #2c3e50;
  margin: 0 0 0.8rem 0;
  font-weight: 600;
}

.advantages-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.advantage-item {
  padding: 0.4rem 0;
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  color: #34495e;
  font-size: 0.95rem;
}

.advantage-icon {
  color: #27ae60;
  font-weight: bold;
  flex-shrink: 0;
  margin-top: 0.1rem;
}

/* 路线价格 */
.club-prices {
  margin-bottom: 1.5rem;
}

.routes-prices {
  background-color: #f9f9f9;
  border-radius: 6px;
  padding: 0.5rem;
}

.route-price-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  font-size: 0.95rem;
}

.route-price {
  font-weight: 600;
  color: #e74c3c;
}

/* 操作按钮 */
.club-actions {
  display: flex;
  gap: 1rem;
}

.view-details-btn,
.contact-btn {
  flex: 1;
  padding: 0.8rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 500;
  transition: all 0.2s;
}

.view-details-btn {
  background-color: #3498db;
  color: white;
}

.view-details-btn:hover {
  background-color: #2980b9;
}

.contact-btn {
  background-color: white;
  border: 1px solid #3498db;
  color: #3498db;
}

.contact-btn:hover {
  background-color: #3498db;
  color: white;
}

/* 客服服务弹窗样式 */
.customer-service-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
  backdrop-filter: blur(5px);
}

.customer-service-modal {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 500px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.cs-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 25px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 16px 16px 0 0;
}

.cs-title {
  display: flex;
  align-items: center;
  gap: 10px;
}

.cs-icon {
  font-size: 24px;
}

.cs-text {
  font-size: 18px;
  font-weight: 600;
}

.cs-club-info {
  flex: 1;
  text-align: center;
}

.cs-close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  font-size: 28px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.cs-close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(90deg);
}

.cs-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: #f8f9fa;
  min-height: 300px;
  max-height: 400px;
}

.message {
  margin-bottom: 15px;
  display: flex;
}

.message.service {
  justify-content: flex-start;
}

.message.user {
  justify-content: flex-end;
}

.message-content {
  max-width: 80%;
  display: flex;
  flex-direction: column;
}

.message-text {
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.6;
  word-wrap: break-word;
  white-space: pre-wrap;
}

.message.service .message-text {
  background: white;
  color: #2c3e50;
  border-bottom-left-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.message.user .message-text {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-bottom-right-radius: 4px;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.message-time {
  font-size: 12px;
  color: #95a5a6;
  margin-top: 4px;
}

.quick-replies {
  padding: 15px 20px;
  background: white;
  border-top: 1px solid #e9ecef;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.quick-reply-item {
  padding: 8px 16px;
  background: #f0f3f8;
  color: #667eea;
  border-radius: 20px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s;
}

.quick-reply-item:hover {
  background: #667eea;
  color: white;
}

.chat-input-area {
  padding: 15px 20px;
  background: white;
  border-top: 1px solid #e9ecef;
  display: flex;
  gap: 10px;
  align-items: flex-end;
}

.message-input {
  flex: 1;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 14px;
  resize: none;
  outline: none;
  font-family: inherit;
}

.send-btn {
  padding: 10px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s;
}

.send-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .clubs-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }

  .clubs-grid {
    grid-template-columns: 1fr;
  }
}
</style>
