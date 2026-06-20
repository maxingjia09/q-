<template>
  <div class="courses-page">
    <!-- 页面标题区域 -->
    <div class="page-header">
      <div class="container">
        <h1 class="page-title">课程体系</h1>
        <p class="page-description">专业的户外技能培训，从入门到精通，助您成为户外达人</p>
      </div>
    </div>

    <div class="container">
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-state">
        <p>加载课程中...</p>
      </div>

      <!-- 错误状态 -->
      <div v-else-if="error" class="error-state">
        <p>{{ error }}</p>
        <button @click="fetchCourses" class="retry-btn">重新加载</button>
      </div>

      <!-- 课程列表 -->
      <div v-else class="course-grid">
        <div class="course-card" v-for="course in courses" :key="course.id">
          <div class="course-image">
            <img :src="resolveImageUrl(course.image)" :alt="course.name">
          </div>
          <div class="course-content">
            <h3 class="course-title">{{ course.name }}</h3>
            <p class="course-description">{{ course.shortDescription }}</p>
            <div class="course-meta">
              <span class="meta-item">
                <span class="meta-icon">⏱️</span>
                {{ course.duration }}
              </span>
              <span class="meta-item">
                <span class="meta-icon">👥</span>
                {{ course.capacity || '待定' }}
              </span>
              <span class="meta-item">
                <span class="meta-icon">📊</span>
                {{ difficultyLabel(course.difficulty) }}
              </span>
            </div>
            <div class="course-footer">
              <span class="course-price">¥{{ course.price?.toLocaleString?.() || course.price }}</span>
              <div class="course-actions">
                <button @click="openJoinModal(course)" class="course-join-btn">立即报名</button>
                <router-link :to="'/courses/' + course.id" class="course-link">了解详情 →</router-link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="!loading && !error && courses.length === 0" class="empty-state">
        <p>暂无课程数据</p>
      </div>
    </div>

    <!-- 立即报名弹窗 -->
    <div v-if="showJoinModal" class="modal-overlay" @click.self="closeJoinModal">
      <div class="modal-content">
        <h3>课程报名</h3>
        <p>您正在报名：<strong>{{ selectedCourse?.name }}</strong></p>
        <div class="modal-actions">
          <button @click="confirmJoin" class="modal-confirm-btn">确认报名</button>
          <button @click="closeJoinModal" class="modal-cancel-btn">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { apiFetch } from '../utils/api'
import { resolveImageUrl } from '../utils/imageUtils'

const courses = ref([])
const loading = ref(true)
const error = ref(null)
const showJoinModal = ref(false)
const selectedCourse = ref(null)

const difficultyMap = {
  beginner: '入门级',
  intermediate: '中级',
  advanced: '进阶级'
}

function difficultyLabel(difficulty) {
  return difficultyMap[difficulty] || difficulty || '未知'
}

async function fetchCourses() {
  loading.value = true
  error.value = null
  try {
    const data = await apiFetch('/course/list')
    courses.value = Array.isArray(data) ? data : (data.data || [])
  } catch (e) {
    error.value = '课程加载失败，请检查网络连接后重试。'
    console.error('Failed to fetch courses:', e)
  } finally {
    loading.value = false
  }
}

function openJoinModal(course) {
  selectedCourse.value = course
  showJoinModal.value = true
}

function closeJoinModal() {
  showJoinModal.value = false
  selectedCourse.value = null
}

function confirmJoin() {
  alert('报名成功！')
  closeJoinModal()
}

onMounted(() => {
  fetchCourses()
})
</script>

<style scoped>
.courses-page {
  min-height: 100vh;
  padding-bottom: 5rem;
}

.page-header {
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.4)),
              url('https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1920&h=600&fit=crop');
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

/* 状态提示 */
.loading-state,
.error-state,
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #666;
  font-size: 1.1rem;
  margin-top: 3rem;
}

.error-state p {
  color: #e74c3c;
  margin-bottom: 1rem;
}

.retry-btn {
  padding: 0.6rem 1.5rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
}

.retry-btn:hover {
  background-color: #2980b9;
}

.course-grid {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-top: 3rem;
}

.course-card {
  display: flex;
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.course-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.course-image {
  width: 350px;
  height: 250px;
  overflow: hidden;
  flex-shrink: 0;
}

.course-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.course-card:hover .course-image img {
  transform: scale(1.05);
}

.course-content {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
}

.course-title {
  font-size: 1.5rem;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.course-description {
  color: #666;
  line-height: 1.8;
  margin-bottom: 1.5rem;
  font-size: 1rem;
}

.course-meta {
  display: flex;
  gap: 2rem;
  margin-bottom: 1.5rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #7f8c8d;
  font-size: 0.95rem;
}

.meta-icon {
  font-size: 1.1rem;
}

.course-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.course-price {
  font-size: 1.8rem;
  font-weight: 700;
  color: #e74c3c;
}

.course-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.course-link {
  display: inline-block;
  padding: 0.8rem 1.5rem;
  background-color: #3498db;
  color: white;
  font-weight: 500;
  text-decoration: none;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.course-link:hover {
  background-color: #2980b9;
  transform: translateY(-2px);
}

.course-join-btn {
  display: inline-block;
  padding: 0.8rem 1.5rem;
  background-color: #27ae60;
  color: white;
  font-weight: 500;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.course-join-btn:hover {
  background-color: #219a52;
  transform: translateY(-2px);
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 420px;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.modal-content h3 {
  margin-bottom: 1rem;
  color: #2c3e50;
}

.modal-content p {
  margin-bottom: 1.5rem;
  color: #666;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.modal-confirm-btn {
  padding: 0.7rem 2rem;
  background-color: #27ae60;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

.modal-confirm-btn:hover {
  background-color: #219a52;
}

.modal-cancel-btn {
  padding: 0.7rem 2rem;
  background-color: #95a5a6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

.modal-cancel-btn:hover {
  background-color: #7f8c8d;
}

/* 响应式设计 */
@media (max-width: 992px) {
  .course-card {
    flex-direction: column;
  }

  .course-image {
    width: 100%;
    height: 220px;
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }

  .course-meta {
    flex-wrap: wrap;
    gap: 1rem;
  }

  .course-footer {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
}
</style>
