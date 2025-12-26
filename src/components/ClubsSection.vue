<template>
  <section id="clubs-section" class="clubs-section">
    <div class="container">
      <h2 class="section-title">探索俱乐部</h2>
      <p class="section-description">选择专业的户外俱乐部，开启精彩的户外冒险之旅</p>
      
      <!-- 俱乐部并列展示 -->
      <div class="clubs-grid">
        <div v-for="club in clubs" :key="club.id" class="club-card">
          <!-- 俱乐部图片 -->
          <div class="club-image">
            <img :src="club.image" :alt="club.name" class="club-photo">
          </div>
          
          <!-- 俱乐部基本信息 -->
          <div class="club-info">
            <h3 class="club-name">{{ club.name }}</h3>
            
            <!-- 评分 -->
            <div class="club-rating">
              <span class="stars">{{ '★'.repeat(Math.floor(club.rating)) }}</span>
              <span class="rating-number">{{ club.rating }}</span>
              <span class="review-count">({{ club.reviewCount }}条评价)</span>
            </div>
            
            <!-- 主要优势 -->
            <div class="club-highlights">
              <h4 class="highlight-title">主要优势</h4>
              <ul class="advantages-list">
                <li v-for="(advantage, index) in club.highlights" :key="index" class="advantage-item">
                  <span class="advantage-icon">✓</span>
                  {{ advantage }}
                </li>
              </ul>
            </div>
            
            <!-- 热门路线价格 -->
            <div class="club-prices">
              <h4 class="price-title">热门路线</h4>
              <div class="routes-prices">
                <div v-for="(route, index) in club.routes" :key="index" class="route-price-item">
                  <span class="route-name">{{ route.name }}</span>
                  <span class="route-price">¥{{ route.price }}</span>
                </div>
              </div>
            </div>
            
            <!-- 客户评价摘要 -->
            <div class="club-reviews-summary">
              <div v-for="(review, index) in club.topReviews" :key="index" class="review-summary-item">
                <p class="review-text">{{ review.content }}</p>
                <div class="reviewer-info">
                  <span class="reviewer-name">{{ review.name }}</span>
                  <span class="reviewer-rating">
                    {{ '★'.repeat(Math.floor(review.rating)) }}
                  </span>
                </div>
              </div>
            </div>
            
            <!-- 操作按钮 -->
            <div class="club-actions">
              <router-link :to="`/clubs/${club.id}`" class="view-details-btn">查看详情</router-link>
              <button class="contact-btn" @click="contactClub(club.id)">联系我们</button>
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
            <div 
              v-for="(message, index) in chatMessages" 
              :key="index"
              :class="['message', message.type]"
            >
              <div class="message-content">
                <div class="message-text">{{ message.content }}</div>
                <div class="message-time">{{ message.time }}</div>
              </div>
            </div>
          </div>

          <div class="quick-replies">
            <div 
              v-for="(reply, index) in [
                '请问有哪些路线可以推荐？',
                '价格是多少？',
                '需要准备什么装备？',
                '如何报名？'
              ]"
              :key="index"
              class="quick-reply-item"
              @click="quickReply(reply)"
            >
              {{ reply }}
            </div>
          </div>

          <div class="chat-input-area">
            <textarea 
              v-model="messageInput"
              class="message-input"
              placeholder="请输入您的问题..."
              @keydown.enter.prevent="sendMessage"
              rows="3"
            ></textarea>
            <button class="send-btn" @click="sendMessage">
              <span class="send-icon">📤</span>
              发送
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
// 导入俱乐部logo
import peakClubLogo from '@/assets/peak-club-logo.svg';
import explorerClubLogo from '@/assets/explorer-club-logo.svg';
import braveClubLogo from '@/assets/brave-club-logo.svg';
import { ref } from 'vue';

export default {
  name: 'ClubsSection',
  setup() {
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
          const routes = club.routes.map(route => 
            `• ${route.name}（${route.difficulty}，${route.duration}）- ¥${route.price}`
          ).join('\n');
          responseContent = `我们为您推荐以下路线：\n\n${routes}\n\n您可以根据自己的经验和体力选择合适的路线。需要了解更多详情吗？`;
        } else if (userQuestion.includes('价格') || userQuestion.includes('多少钱') || userQuestion.includes('费用')) {
          const prices = club.routes.map(route => 
            `• ${route.name}：¥${route.price}`
          ).join('\n');
          responseContent = `我们的路线价格如下：\n\n${prices}\n\n价格包含：专业向导、基础装备、保险等。如需升级装备或定制服务，价格会有所调整。`;
        } else if (userQuestion.includes('装备') || userQuestion.includes('准备') || userQuestion.includes('需要')) {
          responseContent = `根据不同的路线，我们提供以下装备建议：\n\n🎒 基础装备（我们提供）：\n• 登山杖、安全帽、安全带\n• 通讯设备、急救包\n• 防护眼镜、手套\n\n👕 个人装备（需自备）：\n• 速干衣裤、防风外套\n• 登山鞋、运动袜\n• 防晒用品、个人药品\n\n我们会根据具体路线提供详细的装备清单，确保您的安全！`;
        } else if (userQuestion.includes('报名') || userQuestion.includes('如何') || userQuestion.includes('参加')) {
          responseContent = `报名流程非常简单：\n\n📝 第一步：选择您感兴趣的路线\n\n💳 第二步：在线支付定金或全款\n\n📋 第三步：填写个人信息和紧急联系人\n\n✅ 第四步：收到确认短信后，报名成功！\n\n📞 温馨提示：\n• 出发前3天会收到集合通知\n• 如需改期，请提前7天联系我们\n• 如有疑问，随时咨询客服`;
        } else {
          responseContent = `感谢您的咨询！关于"${userMessage.content}"这个问题，我们的专业客服会尽快为您详细解答。您也可以先了解一下我们的热门路线和服务。请问还有其他问题吗？`;
        }

        const serviceResponse = {
          type: 'service',
          content: responseContent,
          time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
        };
        chatMessages.value.push(serviceResponse);
      }, 1000);
    };

    const quickReply = (question) => {
      messageInput.value = question;
      sendMessage();
    };

    return {
      showCustomerService,
      selectedClub,
      messageInput,
      chatMessages,
      openCustomerService,
      closeCustomerService,
      sendMessage,
      quickReply
    };
  },
  data() {
    return {
      clubs: [
        {
          id: 1,
          name: '巅峰户外俱乐部',
          rating: 4.8,
          reviewCount: 236,
          image: peakClubLogo,
          founded: '2014年3月',
          experience: '10年',
          guides: '28名专业向导',
          highlights: [
            '10年专业登山经验',
            '国家级教练团队',
            '进口专业装备'
          ],
          routes: [
            { name: '初级登山', price: 398 },
            { name: '中级挑战', price: 698 },
            { name: '高级攀登', price: 1298 }
          ],
          allRoutes: [
            {
              name: '初级登山',
              price: 398,
              description: '适合户外初学者，体验登山的乐趣，欣赏沿途风景',
              difficulty: '简单',
              duration: '1天'
            },
            {
              name: '中级挑战',
              price: 698,
              description: '有一定登山经验者选择，挑战更高海拔，提升体能',
              difficulty: '中等',
              duration: '2天'
            },
            {
              name: '高级攀登',
              price: 1298,
              description: '专业级登山路线，需要丰富经验和良好体能',
              difficulty: '困难',
              duration: '3-4天'
            }
          ],
          goldGuides: [
            {
              name: '张伟',
              experience: '12年登山向导经验，曾带领团队成功攀登珠穆朗玛峰、乞力马扎罗山等世界著名山峰',
              specialties: ['高山攀登', '雪山救援', '野外生存'],
              rating: 5.0,
              activities: 580,
              certifications: '国家一级登山教练'
            },
            {
              name: '李明',
              experience: '10年专业登山经验，精通各类登山技巧，擅长高海拔攀登和团队协作',
              specialties: ['高海拔攀登', '团队训练', '安全指导'],
              rating: 4.9,
              activities: 450,
              certifications: '国际登山联盟认证'
            }
          ],
          topReviews: [
            {
              name: '张先生',
              content: '教练非常专业，讲解细致，第一次登山体验很棒！',
              rating: 5
            }
          ],
          reviews: [
            {
              name: '张先生',
              content: '教练非常专业，讲解细致，第一次登山体验很棒！全程都有安全保障，装备也很新。强烈推荐给想尝试登山的朋友！',
              rating: 5,
              date: '2024-11-20'
            },
            {
              name: '李女士',
              content: '组织得很好，向导经验丰富，对路线非常熟悉。虽然第一次登山有点紧张，但在专业指导下顺利完成。',
              rating: 5,
              date: '2024-10-15'
            },
            {
              name: '王先生',
              content: '性价比很高，装备齐全，服务周到。中级路线很有挑战性，风景绝美！',
              rating: 4,
              date: '2024-09-28'
            }
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
          highlights: [
            '野外生存技能培训',
            '多样化探险活动',
            '定制团队建设'
          ],
          routes: [
            { name: '森林探险', price: 498 },
            { name: '山地露营', price: 898 },
            { name: '峡谷漂流', price: 598 }
          ],
          allRoutes: [
            {
              name: '森林探险',
              price: 498,
              description: '深入原始森林，学习野外生存技能，探索自然奥秘',
              difficulty: '简单',
              duration: '1天'
            },
            {
              name: '山地露营',
              price: 898,
              description: '在山顶露营，欣赏星空日出，体验野外生活',
              difficulty: '中等',
              duration: '2天'
            },
            {
              name: '峡谷漂流',
              price: 598,
              description: '刺激的峡谷漂流体验，感受大自然的磅礴力量',
              difficulty: '中等',
              duration: '1天'
            }
          ],
          goldGuides: [
            {
              name: '王芳',
              experience: '9年野外生存专家，曾在特种部队服役，精通各类野外生存技能和急救知识',
              specialties: ['野外生存', '急救医疗', '丛林探险'],
              rating: 4.9,
              activities: 420,
              certifications: '国家野外生存教练'
            },
            {
              name: '陈强',
              experience: '8年探险向导经验，擅长森林探险和山地露营，安全记录零事故',
              specialties: ['森林探险', '露营指导', '生态保护'],
              rating: 4.8,
              activities: 380,
              certifications: '国际探险协会认证'
            }
          ],
          topReviews: [
            {
              name: '李女士',
              content: '装备很新很专业，全程都很安全，风景也很美！',
              rating: 4
            }
          ],
          reviews: [
            {
              name: '李女士',
              content: '装备很新很专业，全程都很安全，风景也很美！森林探险路线设计得很好，学到了很多野外生存知识。',
              rating: 4,
              date: '2024-11-10'
            },
            {
              name: '陈先生',
              content: '露营体验太棒了！山顶的星空和日出让人终生难忘。向导很负责，照顾得很周到。',
              rating: 5,
              date: '2024-10-05'
            },
            {
              name: '赵女士',
              content: '峡谷漂流非常刺激，安全措施做得很好。团队建设活动组织得很成功！',
              rating: 4,
              date: '2024-09-18'
            }
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
          highlights: [
            '全季节户外活动',
            '青少年训练营',
            '企业团建专家'
          ],
          routes: [
            { name: '周末徒步', price: 298 },
            { name: '攀岩体验', price: 498 },
            { name: '雪山攀登', price: 1698 }
          ],
          allRoutes: [
            {
              name: '周末徒步',
              price: 298,
              description: '轻松的周末徒步路线，适合家庭和初学者',
              difficulty: '简单',
              duration: '1天'
            },
            {
              name: '攀岩体验',
              price: 498,
              description: '专业攀岩场地，提供全套装备和教练指导',
              difficulty: '中等',
              duration: '1天'
            },
            {
              name: '雪山攀登',
              price: 1698,
              description: '挑战雪山之巅，需要良好的体能和登山经验',
              difficulty: '困难',
              duration: '4-5天'
            }
          ],
          goldGuides: [
            {
              name: '刘洋',
              experience: '11年攀岩教练经验，国家攀岩队退役运动员，多次获得全国攀岩比赛冠军',
              specialties: ['攀岩教学', '青少年培训', '团队建设'],
              rating: 5.0,
              activities: 520,
              certifications: '国家攀岩一级教练'
            },
            {
              name: '赵雪',
              experience: '9年雪山攀登经验，成功攀登过多座5000米以上雪山，擅长高海拔攀登',
              specialties: ['雪山攀登', '高海拔适应', '安全指导'],
              rating: 4.9,
              activities: 390,
              certifications: '国际登山向导认证'
            }
          ],
          topReviews: [
            {
              name: '王先生',
              content: '组织有序，教练经验丰富，会推荐朋友来参加！',
              rating: 5
            }
          ],
          reviews: [
            {
              name: '王先生',
              content: '组织有序，教练经验丰富，会推荐朋友来参加！周末徒步路线风景优美，强度适中，非常适合放松心情。',
              rating: 5,
              date: '2024-11-25'
            },
            {
              name: '刘女士',
              content: '攀岩体验太棒了！教练很有耐心，从零开始教学，让我克服了恐惧。强烈推荐！',
              rating: 5,
              date: '2024-10-20'
            },
            {
              name: '周先生',
              content: '企业团建活动组织得非常好，团队凝聚力提升了很多。勇者团队很专业！',
              rating: 4,
              date: '2024-09-30'
            }
          ]
        }
      ]
    }
  },
  methods: {
    contactClub(clubId) {
      const club = this.clubs.find(c => c.id === clubId);
      if (club) {
        this.openCustomerService(club);
      }
    }
  }
}
</script>

<style scoped>
.clubs-section {
  padding: 5rem 0;
  background-color: #f8f9fa;
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

/* 俱乐部并列网格布局 */
.clubs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2.5rem;
  margin-bottom: 3rem;
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
}

.club-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}

.club-card:hover .club-photo {
  transform: scale(1.05);
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

.route-name {
  color: #34495e;
}

.route-price {
  font-weight: 600;
  color: #e74c3c;
}

/* 客户评价摘要 */
.club-reviews-summary {
  margin-bottom: 1.5rem;
}

.review-summary-item {
  background-color: #f9f9f9;
  padding: 1rem;
  border-radius: 6px;
  position: relative;
}

.review-summary-item::before {
  content: '"';
  font-size: 3rem;
  color: rgba(52, 152, 219, 0.1);
  position: absolute;
  top: -10px;
  left: 5px;
}

.review-text {
  color: #34495e;
  font-size: 0.95rem;
  line-height: 1.6;
  margin: 0 0 0.8rem 0;
  padding-left: 0.5rem;
  border-left: 3px solid #3498db;
}

.reviewer-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.reviewer-name {
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.9rem;
}

.reviewer-rating {
  color: #f1c40f;
  font-size: 0.9rem;
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
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.view-details-btn:hover {
  background-color: #2980b9;
  transform: translateY(-2px);
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

/* 查看全部按钮 */
.view-all-section {
  text-align: center;
  margin-top: 3rem;
}

.view-all-btn {
  padding: 1rem 2.5rem;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.view-all-btn:hover {
  background-color: #c0392b;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(231, 76, 60, 0.3);
}

/* 响应式设计 */
@media (max-width: 992px) {
  .clubs-grid {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  }
}

@media (max-width: 768px) {
  .section-title {
    font-size: 1.8rem;
  }
  
  .section-description {
    font-size: 1rem;
  }
  
  .clubs-grid {
    grid-template-columns: 1fr;
  }
  
  .club-image {
    height: 180px;
  }
  
  .club-actions {
    flex-direction: column;
  }
}

/* 俱乐部详情弹窗样式 */
.club-detail-modal-overlay {
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
  padding: 20px;
}

.club-detail-modal {
  background: white;
  border-radius: 15px;
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px 30px;
  border-bottom: 1px solid #e9ecef;
  position: sticky;
  top: 0;
  background: white;
  z-index: 10;
}

.modal-header h3 {
  margin: 0;
  font-size: 24px;
  color: #2c3e50;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  font-size: 32px;
  color: #6c757d;
  cursor: pointer;
  padding: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s;
}

.close-btn:hover {
  background: #f8f9fa;
  color: #dc3545;
}

.modal-body {
  padding: 30px;
}

/* 俱乐部基本信息 */
.club-basic-info {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 30px;
  padding: 20px;
  background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
  border-radius: 10px;
  color: white;
}

.info-item {
  text-align: center;
}

.info-label {
  display: block;
  font-size: 14px;
  opacity: 0.9;
  margin-bottom: 8px;
}

.info-value {
  display: block;
  font-size: 20px;
  font-weight: 700;
}

/* 金牌向导 */
.club-guides-section {
  margin-bottom: 30px;
}

.club-guides-section h4 {
  font-size: 20px;
  color: #2c3e50;
  margin: 0 0 20px 0;
  font-weight: 600;
}

.guides-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
}

.guide-card {
  background: #f8f9fa;
  padding: 25px;
  border-radius: 12px;
  display: flex;
  gap: 20px;
  border: 2px solid #e9ecef;
  transition: all 0.3s;
}

.guide-card:hover {
  border-color: #2196F3;
  box-shadow: 0 4px 15px rgba(33, 150, 243, 0.2);
  transform: translateY(-3px);
}

.guide-avatar {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 24px;
  flex-shrink: 0;
}

.guide-info {
  flex: 1;
}

.guide-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.guide-name {
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
}

.guide-badge {
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  color: white;
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: 600;
}

.guide-experience {
  margin: 10px 0;
  color: #555;
  line-height: 1.5;
  font-size: 14px;
}

.guide-specialties {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 15px;
}

.specialty-tag {
  background: #E3F2FD;
  color: #1976D2;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.guide-stats {
  display: flex;
  gap: 20px;
  padding-top: 15px;
  border-top: 1px solid #e9ecef;
}

.guide-stats .stat {
  text-align: center;
}

.guide-stats .stat-value {
  display: block;
  font-size: 18px;
  font-weight: 700;
  color: #2196F3;
}

.guide-stats .stat-label {
  display: block;
  font-size: 12px;
  color: #6c757d;
  margin-top: 3px;
}

/* 承接路线 */
.club-routes-section {
  margin-bottom: 30px;
}

.club-routes-section h4,
.club-reviews-section h4 {
  font-size: 20px;
  color: #2c3e50;
  margin: 0 0 20px 0;
  font-weight: 600;
}

.routes-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.route-detail-item {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  border-left: 4px solid #2196F3;
}

.route-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.route-name {
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
}

.route-price {
  font-size: 20px;
  font-weight: 700;
  color: #e74c3c;
}

.route-description {
  margin: 10px 0;
  color: #6c757d;
  line-height: 1.6;
}

.route-meta {
  display: flex;
  gap: 20px;
  margin-top: 10px;
}

.route-difficulty,
.route-duration {
  font-size: 14px;
  color: #495057;
  padding: 5px 12px;
  background: white;
  border-radius: 15px;
  font-weight: 500;
}

/* 客户评价 */
.club-reviews-section {
  margin-bottom: 20px;
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.review-item {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
}

.review-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}

.reviewer-avatar {
  width: 45px;
  height: 45px;
  background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 18px;
  flex-shrink: 0;
}

.reviewer-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.reviewer-name {
  font-weight: 600;
  color: #2c3e50;
  font-size: 15px;
}

.review-date {
  font-size: 13px;
  color: #999;
}

.review-rating {
  color: #f1c40f;
  font-size: 16px;
}

.review-content {
  margin: 0;
  color: #555;
  line-height: 1.6;
  font-size: 14px;
}

.modal-footer {
  padding: 20px 30px;
  border-top: 1px solid #e9ecef;
  text-align: right;
  position: sticky;
  bottom: 0;
  background: white;
}

.close-modal-btn {
  padding: 12px 30px;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s;
}

.close-modal-btn:hover {
  background: #5a6268;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .club-basic-info {
    grid-template-columns: 1fr;
  }
  
  .guides-list {
    grid-template-columns: 1fr;
  }
  
  .guide-card {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .guide-stats {
    justify-content: center;
  }
  
  .club-detail-modal {
    max-height: 95vh;
  }
  
  .modal-body {
    padding: 20px;
  }
  
  .modal-header {
    padding: 20px;
  }
  
  .modal-footer {
    padding: 15px 20px;
  }
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
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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

.cs-club-info .club-name {
  font-size: 16px;
  font-weight: 500;
  opacity: 0.95;
}

.cs-close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  font-size: 32px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  line-height: 1;
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

.message.service .message-content {
  align-items: flex-start;
}

.message.user .message-content {
  align-items: flex-end;
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
  border: 1px solid transparent;
}

.quick-reply-item:hover {
  background: #667eea;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
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
  transition: all 0.3s;
  font-family: inherit;
}

.message-input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.message-input::placeholder {
  color: #95a5a6;
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
  white-space: nowrap;
}

.send-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.send-btn:active {
  transform: translateY(0);
}

.send-icon {
  font-size: 16px;
}

@media (max-width: 768px) {
  .customer-service-overlay {
    padding: 10px;
  }

  .customer-service-modal {
    max-height: 90vh;
  }

  .cs-header {
    padding: 15px 20px;
  }

  .cs-text {
    font-size: 16px;
  }

  .cs-club-info .club-name {
    font-size: 14px;
  }

  .chat-messages {
    padding: 15px;
    min-height: 250px;
    max-height: 350px;
  }

  .message-text {
    font-size: 13px;
  }

  .quick-replies {
    padding: 12px 15px;
  }

  .quick-reply-item {
    font-size: 12px;
    padding: 6px 12px;
  }

  .chat-input-area {
    padding: 12px 15px;
  }

  .message-input {
    font-size: 13px;
    padding: 8px 10px;
  }

  .send-btn {
    padding: 8px 16px;
    font-size: 13px;
  }
}
</style>