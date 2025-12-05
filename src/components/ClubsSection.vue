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
              <button class="view-details-btn" @click="viewClubDetails(club.id)">查看详情</button>
              <button class="contact-btn" @click="contactClub(club.id)">联系我们</button>
            </div>
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

export default {
  name: 'ClubsSection',
  data() {
    return {
      clubs: [
        {
          id: 1,
          name: '巅峰户外俱乐部',
          rating: 4.8,
          reviewCount: 236,
          image: peakClubLogo,
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
          topReviews: [
            {
              name: '张先生',
              content: '教练非常专业，讲解细致，第一次登山体验很棒！',
              rating: 5
            }
          ]
        },
        {
          id: 2,
          name: '探索者户外联盟',
          rating: 4.6,
          reviewCount: 189,
          image: explorerClubLogo,
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
          topReviews: [
            {
              name: '李女士',
              content: '装备很新很专业，全程都很安全，风景也很美！',
              rating: 4
            }
          ]
        },
        {
          id: 3,
          name: '勇者户外团队',
          rating: 4.7,
          reviewCount: 156,
          image: braveClubLogo,
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
          topReviews: [
            {
              name: '王先生',
              content: '组织有序，教练经验丰富，会推荐朋友来参加！',
              rating: 5
            }
          ]
        }
      ]
    }
  },
  methods: {
    viewClubDetails(clubId) {
      // 导航到俱乐部详情页
      this.$router.push(`/clubs?id=${clubId}`)
    },
    contactClub(clubId) {
      // 联系俱乐部的逻辑
      alert(`联系俱乐部 ${this.clubs.find(c => c.id === clubId)?.name}`)
    },

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
</style>