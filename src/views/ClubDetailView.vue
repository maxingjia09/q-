<template>
  <div class="club-detail-page">
    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>正在加载俱乐部信息...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-container">
      <div class="error-content">
        <h2>加载失败</h2>
        <p>{{ error }}</p>
        <button class="btn-back" @click="retry">重新加载</button>
        <button class="btn-back btn-back-secondary" @click="goBack">返回首页</button>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else class="page-container">
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
              { id: 'overview', label: '俱乐部概览', icon: '🏔️' },
              { id: 'guides', label: '金牌向导', icon: '⭐' },
              { id: 'routes', label: '承接路线', icon: '🗺️' },
              { id: 'reviews', label: '客户评价', icon: '💬' }
            ]"
            :key="tab.id"
            :class="['nav-item', { active: activeTab === tab.id }]"
            @click="handleTabClick(tab.id)"
          >
            <span class="icon">{{ tab.icon }}</span>
            <span>{{ tab.label }}</span>
          </div>
          <div class="nav-item back" @click="goBack">
            <span class="icon">⬅️</span>
            <span>返回首页</span>
          </div>
        </nav>
      </aside>

      <main class="main-content">
        <div class="content-wrapper">
          <div v-if="club" class="club-detail">
            <header class="club-header">
              <div class="club-banner">
                <img :src="resolveImageUrl(club.image)" :alt="club.name">
              </div>
              <div class="club-title-section">
                <h1 class="club-title">{{ club.name }}</h1>
                <div class="club-meta">
                  <span class="meta-item">
                    <i class="meta-icon">⭐</i>
                    评分：{{ club.rating }}
                  </span>
                  <span class="meta-item">
                    <i class="meta-icon">📝</i>
                    评价：{{ club.reviewCount }}条
                  </span>
                  <span class="meta-item">
                    <i class="meta-icon">👥</i>
                    向导：{{ club.guides }}
                  </span>
                </div>
              </div>
            </header>

            <div class="tab-content">
              <div v-if="activeTab === 'overview'" class="overview-section">
                <h2>俱乐部基本信息</h2>
                <div class="club-basic-info">
                  <div class="info-item">
                    <span class="info-label">成立时间</span>
                    <span class="info-value">{{ club.founded }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">从业经验</span>
                    <span class="info-value">{{ club.experience }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">在职向导</span>
                    <span class="info-value">{{ club.guides }}</span>
                  </div>
                </div>

                <div v-if="club.description" class="description-section">
                  <h2>俱乐部简介</h2>
                  <p class="club-description">{{ club.description }}</p>
                </div>

                <h2 v-if="club.highlights && club.highlights.length > 0">主要优势</h2>
                <div v-if="club.highlights && club.highlights.length > 0" class="highlights-section">
                  <ul class="advantages-list">
                    <li v-for="(advantage, index) in club.highlights" :key="index" class="advantage-item">
                      <span class="advantage-icon">✓</span>
                      {{ advantage }}
                    </li>
                  </ul>
                </div>
              </div>

              <div v-if="activeTab === 'guides'" class="guides-section">
                <h2>金牌向导</h2>
                <div v-if="club.goldGuides && club.goldGuides.length > 0" class="guides-list">
                  <div v-for="(guide, index) in club.goldGuides" :key="guide.id || index" class="guide-card">
                    <div class="guide-avatar">
                      {{ guide.name.charAt(0) }}
                    </div>
                    <div class="guide-info">
                      <div class="guide-header">
                        <span class="guide-name">{{ guide.name }}</span>
                        <span class="guide-badge">金牌向导</span>
                      </div>
                      <p class="guide-experience">{{ guide.experience }}</p>
                      <div v-if="guide.specialties && guide.specialties.length > 0" class="guide-specialties">
                        <span v-for="(specialty, idx) in guide.specialties" :key="idx" class="specialty-tag">
                          {{ specialty }}
                        </span>
                      </div>
                      <div class="guide-stats">
                        <div class="stat">
                          <span class="stat-value">{{ guide.rating }}</span>
                          <span class="stat-label">评分</span>
                        </div>
                        <div class="stat">
                          <span class="stat-value">{{ guide.activities }}</span>
                          <span class="stat-label">带队次数</span>
                        </div>
                        <div class="stat">
                          <span class="stat-value">{{ guide.certifications }}</span>
                          <span class="stat-label">认证</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else class="empty-state">
                  <p>暂无向导信息</p>
                </div>
              </div>

              <div v-if="activeTab === 'routes'" class="routes-section">
                <h2>承接路线</h2>
                <div v-if="club.allRoutes && club.allRoutes.length > 0" class="routes-list">
                  <div v-for="(route, index) in club.allRoutes" :key="route.id || index" class="route-detail-item">
                    <div class="route-header">
                      <span class="route-name">{{ route.name }}</span>
                      <span class="route-price">¥{{ route.price }}</span>
                    </div>
                    <p v-if="route.description" class="route-description">{{ route.description }}</p>
                    <div class="route-meta">
                      <span v-if="route.difficulty" class="route-difficulty">难度：{{ route.difficulty }}</span>
                      <span v-if="route.duration" class="route-duration">时长：{{ route.duration }}</span>
                    </div>
                  </div>
                </div>
                <div v-else class="empty-state">
                  <p>暂无路线信息</p>
                </div>
              </div>

              <div v-if="activeTab === 'reviews'" class="reviews-section">
                <h2>客户评价</h2>
                <div v-if="club.reviews && club.reviews.length > 0" class="reviews-list">
                  <div v-for="(review, index) in club.reviews" :key="review.id || index" class="review-item">
                    <div class="review-header">
                      <div class="reviewer-avatar">
                        {{ review.name.charAt(0) }}
                      </div>
                      <div class="reviewer-info">
                        <span class="reviewer-name">{{ review.name }}</span>
                        <span class="review-date">{{ review.date }}</span>
                      </div>
                      <div class="review-rating">
                        <span v-for="star in 5" :key="star" class="star" :class="{ active: star <= review.rating }">
                          ★
                        </span>
                      </div>
                    </div>
                    <p class="review-content">{{ review.content }}</p>
                  </div>
                </div>
                <div v-else class="empty-state">
                  <p>暂无客户评价</p>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="club-not-found">
            <h2>俱乐部未找到</h2>
            <p>抱歉，您查找的俱乐部不存在。</p>
            <button class="btn-back" @click="goBack">返回首页</button>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { apiFetch } from '../utils/api';
import { resolveImageUrl } from '../utils/imageUtils';
import { clubs as fallbackClubs } from '../data/clubData';

const router = useRouter();

const props = defineProps({
  id: {
    type: [String, Number],
    required: true
  }
});

const club = ref(null);
const activeTab = ref('overview');
const loading = ref(true);
const error = ref(null);

/**
 * Extract data from API response, handling both wrapped
 * ({ data: ... }) and unwrapped response formats.
 */
function extractData(response) {
  if (response && typeof response === 'object' && response.data !== undefined) {
    return response.data;
  }
  return response;
}

/**
 * Fetch club detail, routes, and guides from the API.
 * Maps API response fields to the template's expected structure.
 */
async function fetchClubData(clubId) {
  loading.value = true;
  error.value = null;
  club.value = null;

  try {
    const [clubResponse, routesResponse, guidesResponse] = await Promise.all([
      apiFetch(`/clubs/detail/${clubId}`),
      apiFetch(`/club-route/list/${clubId}`),
      apiFetch(`/club-guide/list/${clubId}`)
    ]);

    const clubData = extractData(clubResponse);
    const routesData = extractData(routesResponse);
    const guidesData = extractData(guidesResponse);

    // If the API returned null/undefined for the club, treat as not found
    if (!clubData) {
      loading.value = false;
      return;
    }

    const guideList = Array.isArray(guidesData) ? guidesData : [];
    const routeList = Array.isArray(routesData) ? routesData : [];

    club.value = {
      // Spread original API fields, then override/merge with mapped fields
      ...clubData,
      image: clubData.image || clubData.imageUrl || clubData.logo || clubData.avatar || '',
      name: clubData.name || clubData.clubName || '',
      rating: clubData.rating ?? 0,
      reviewCount: clubData.reviewCount ?? clubData.review_count ?? 0,
      guides: clubData.guides ?? clubData.guideCount ?? clubData.guide_count ?? guideList.length,
      founded: clubData.founded || clubData.foundedYear || clubData.founded_year || clubData.established || '',
      experience: clubData.experience || clubData.experienceYears || clubData.experience_years || '',
      description: clubData.description || clubData.desc || clubData.intro || clubData.introduction || '',
      highlights: clubData.highlights || clubData.advantages || clubData.features || [],
      goldGuides: guideList.map(g => ({
        id: g.id,
        name: g.name || g.fullName || g.realName || '',
        experience: g.experience || g.experienceYears || g.experienceDesc || '',
        specialties: g.specialties || g.skills || g.certifications || [],
        rating: g.rating ?? g.score ?? 0,
        activities: g.activities ?? g.activityCount ?? g.activity_count ?? 0,
        certifications: g.certifications ?? g.certCount ?? g.cert_count ?? 0
      })),
      allRoutes: routeList.map(r => ({
        id: r.id,
        name: r.name || r.title || r.routeName || '',
        price: r.price ?? r.cost ?? 0,
        description: r.description || r.desc || '',
        difficulty: r.difficulty || r.level || '',
        duration: r.duration || r.durationDays || r.duration_days || ''
      })),
      reviews: []
    };
  } catch (err) {
    console.error('[ClubDetailView] fetchClubData error，使用本地数据:', err);
    // 降级为静态数据
    const fb = fallbackClubs.find(c => c.id == clubId);
    if (fb) {
      club.value = {
        ...fb,
        image: fb.image,
        guides: parseInt(fb.guides) || fb.guides || 0,
        goldGuides: fb.goldGuides || [],
        allRoutes: fb.allRoutes || fb.routes || [],
        reviews: fb.reviews || []
      };
    } else {
      error.value = '加载俱乐部数据失败，请稍后重试。';
    }
  } finally {
    loading.value = false;
  }
}

function handleTabClick(tabId) {
  activeTab.value = tabId;
}

function goBack() {
  router.push('/');
  setTimeout(() => {
    window.scrollTo(0, 0);
  }, 100);
}

function retry() {
  if (props.id) {
    fetchClubData(props.id);
  }
}

// Watch for prop changes (handles both initial load and route param updates)
watch(
  () => props.id,
  (newId) => {
    if (newId) {
      fetchClubData(newId);
      window.scrollTo(0, 0);
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.club-detail-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
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
  height: calc(100vh - 80px);
  overflow-y: auto;
  z-index: 1000;
  pointer-events: auto;
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
  color: #2196F3;
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
  z-index: 1001;
  pointer-events: auto;
}

.nav-item:hover {
  background: #f8f9fa;
  color: #2196F3;
}

.nav-item.active {
  background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
  color: white;
}

.nav-item.back {
  margin-top: auto;
  color: #2196F3;
}

.nav-item.back:hover {
  background: #2196F3;
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

.club-detail {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.club-header {
  position: relative;
  margin-bottom: 30px;
}

.club-banner {
  width: 100%;
  height: 300px;
  overflow: hidden;
  border-radius: 15px 15px 0 0;
  background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.club-banner img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: white;
  padding: 10px;
  object-fit: contain;
}

.club-title-section {
  padding: 30px 40px;
  background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
  color: white;
}

.club-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.club-meta {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
}

.meta-icon {
  font-size: 1.3rem;
}

.tab-content {
  padding: 30px 40px;
}

.overview-section,
.guides-section,
.routes-section,
.reviews-section {
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.overview-section h2,
.guides-section h2,
.routes-section h2,
.reviews-section h2 {
  font-size: 1.8rem;
  color: #2c3e50;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 3px solid #2196F3;
}

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

.description-section {
  margin-bottom: 30px;
}

.club-description {
  color: #495057;
  line-height: 1.8;
  font-size: 15px;
  margin: 0;
}

.highlights-section {
  margin-bottom: 30px;
}

.advantages-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.advantage-item {
  padding: 1rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  color: #34495e;
  font-size: 0.95rem;
}

.advantage-icon {
  color: #27ae60;
  font-weight: bold;
  font-size: 1.2rem;
  flex-shrink: 0;
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

.review-rating .star {
  font-size: 1.2rem;
}

.star {
  color: #ddd;
}

.star.active {
  color: #f1c40f;
}

.review-content {
  margin: 0;
  color: #555;
  line-height: 1.6;
  font-size: 14px;
}

.club-not-found {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.club-not-found h2 {
  font-size: 2rem;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.club-not-found p {
  color: #7f8c8d;
  margin-bottom: 2rem;
}

.btn-back {
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.btn-back:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(33, 150, 243, 0.4);
}

.btn-back-secondary {
  background: #6c757d;
  margin-left: 10px;
}

.btn-back-secondary:hover {
  box-shadow: 0 4px 12px rgba(108, 117, 125, 0.4);
}

/* Loading State */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 80px);
  background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-container p {
  color: white;
  font-size: 18px;
  font-weight: 500;
}

/* Error State */
.error-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 80px);
}

.error-content {
  text-align: center;
  background: white;
  padding: 3rem 4rem;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.error-content h2 {
  font-size: 1.8rem;
  color: #e74c3c;
  margin-bottom: 1rem;
}

.error-content p {
  color: #7f8c8d;
  margin-bottom: 2rem;
  font-size: 15px;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #999;
  font-size: 15px;
}

@media (max-width: 768px) {
  .page-container {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    height: auto;
    position: relative;
    top: 0;
  }

  .main-content {
    min-width: 100%;
  }

  .content-wrapper {
    padding: 20px;
  }
}

@media (max-width: 768px) {
  .page-container {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    height: auto;
    position: static;
  }

  .main-content {
    min-width: auto;
  }

  .content-wrapper {
    padding: 20px;
  }

  .club-banner {
    height: 200px;
  }

  .club-title {
    font-size: 1.8rem;
  }

  .club-meta {
    gap: 1rem;
  }

  .meta-item {
    font-size: 1rem;
  }

  .tab-content {
    padding: 20px;
  }

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

  .review-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .error-content {
    padding: 2rem;
    margin: 0 20px;
  }
}
</style>
