<template>
  <div class="admin-container">
    <!-- 顶部导航栏 -->
    <header class="admin-header">
      <div class="header-left">
        <h1 class="admin-logo">户外俱乐部 - 管理后台</h1>
      </div>
      <div class="header-right">
        <span class="welcome-text">欢迎，{{ authStore.user?.username }}</span>
        <button class="logout-btn" @click="handleLogout">退出登录</button>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <div class="admin-content">
      <!-- 侧边栏 -->
      <aside class="admin-sidebar">
        <nav class="sidebar-nav">
          <ul>
            <li class="nav-item active" @click="activeMenu = 'dashboard'">
              <span class="nav-icon">📊</span>
              <span class="nav-text">仪表盘</span>
            </li>
            <li class="nav-item" @click="activeMenu = 'users'">
              <span class="nav-icon">👥</span>
              <span class="nav-text">用户管理</span>
            </li>
            <li class="nav-item" @click="activeMenu = 'courses'">
              <span class="nav-icon">📚</span>
              <span class="nav-text">课程管理</span>
            </li>
            <li class="nav-item" @click="activeMenu = 'activities'">
              <span class="nav-icon">🏔️</span>
              <span class="nav-text">活动管理</span>
            </li>
            <li class="nav-item" @click="activeMenu = 'points'">
              <span class="nav-icon">⭐</span>
              <span class="nav-text">积分管理</span>
            </li>
            <li class="nav-item" @click="activeMenu = 'settings'">
              <span class="nav-icon">⚙️</span>
              <span class="nav-text">系统设置</span>
            </li>
          </ul>
        </nav>
      </aside>

      <!-- 主内容区 -->
      <main class="admin-main">
        <div v-if="activeMenu === 'dashboard'" class="dashboard-section">
          <h2 class="section-title">系统概览</h2>
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon">👥</div>
              <div class="stat-content">
                <div class="stat-number">{{ totalUsers }}</div>
                <div class="stat-label">总用户数</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">📚</div>
              <div class="stat-content">
                <div class="stat-number">{{ totalCourses }}</div>
                <div class="stat-label">课程总数</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">🏔️</div>
              <div class="stat-content">
                <div class="stat-number">{{ totalActivities }}</div>
                <div class="stat-label">活动总数</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">⭐</div>
              <div class="stat-content">
                <div class="stat-number">{{ totalPoints }}</div>
                <div class="stat-label">总积分数</div>
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="activeMenu === 'users'" class="users-section">
          <h2 class="section-title">用户管理</h2>
          <div class="table-container">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>用户名</th>
                  <th>邮箱</th>
                  <th>积分</th>
                  <th>角色</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in users" :key="user.id">
                  <td>{{ user.id }}</td>
                  <td>{{ user.username }}</td>
                  <td>{{ user.email }}</td>
                  <td>{{ user.points }}</td>
                  <td>{{ user.isAdmin ? '管理员' : '普通用户' }}</td>
                  <td>
                    <button class="btn-edit">编辑</button>
                    <button class="btn-delete">删除</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div v-else-if="activeMenu === 'courses'" class="courses-section">
          <h2 class="section-title">课程管理</h2>
          <div class="courses-grid">
            <div class="course-card-admin" v-for="course in courses" :key="course.id">
              <div class="course-image-admin">
                <img :src="course.image" :alt="course.title">
              </div>
              <div class="course-content-admin">
                <h3 class="course-title-admin">{{ course.title }}</h3>
                <p class="course-description-admin">{{ course.description }}</p>
                <div class="course-actions">
                  <button class="btn-edit">编辑</button>
                  <button class="btn-delete">删除</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="activeMenu === 'activities'" class="activities-section">
          <h2 class="section-title">活动管理</h2>
          <div class="add-activity">
            <button class="btn-add">添加活动</button>
          </div>
          <div class="activities-list">
            <!-- 活动列表内容 -->
          </div>
        </div>

        <div v-else-if="activeMenu === 'points'" class="points-section">
          <h2 class="section-title">积分管理</h2>
          <div class="points-content">
            <!-- 积分管理内容 -->
          </div>
        </div>

        <div v-else-if="activeMenu === 'settings'" class="settings-section">
          <h2 class="section-title">系统设置</h2>
          <div class="settings-content">
            <!-- 系统设置内容 -->
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';

const router = useRouter();
const authStore = useAuthStore();

// 当前激活的菜单
const activeMenu = ref('dashboard');

// 统计数据
const totalUsers = ref(0);
const totalCourses = ref(0);
const totalActivities = ref(0);
const totalPoints = ref(0);

// 用户数据
const users = ref([]);

// 课程数据
const courses = ref([
  {
    id: 1,
    title: '山地探索课程',
    description: '适合初学者的山地探索技能培训',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=400&fit=crop'
  },
  {
    id: 2,
    title: '山地救援课程',
    description: '专业的山地救援技术培训',
    image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&h=400&fit=crop'
  },
  {
    id: 3,
    title: '山地生存课程',
    description: '掌握野外生存技能',
    image: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=600&h=400&fit=crop'
  },
  {
    id: 4,
    title: '青少年课程',
    description: '专为青少年设计的户外教育课程',
    image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&h=400&fit=crop'
  }
]);

// 初始化数据
onMounted(() => {
  // 检查是否为管理员
  if (!authStore.user?.isAdmin) {
    // 不是管理员，跳转到登录页
    router.push('/login');
    return;
  }

  // 加载统计数据
  loadStats();

  // 加载用户数据
  loadUsers();
});

// 加载统计数据
const loadStats = () => {
  // 模拟数据
  totalUsers.value = 100;
  totalCourses.value = 10;
  totalActivities.value = 20;
  totalPoints.value = 10000;
};

// 加载用户数据
const loadUsers = () => {
  // 模拟数据
  users.value = [
    { id: 1, username: 'admin', email: 'admin@example.com', points: 1000, isAdmin: true },
    { id: 2, username: 'testuser', email: 'test@example.com', points: 500, isAdmin: false },
    { id: 3, username: 'user1', email: 'user1@example.com', points: 200, isAdmin: false },
    { id: 4, username: 'user2', email: 'user2@example.com', points: 300, isAdmin: false }
  ];
};

// 退出登录
const handleLogout = async () => {
  await authStore.logout();
  router.push('/admin/login');
};
</script>

<style scoped>
.admin-container {
  min-height: 100vh;
  background-color: #f5f7fa;
  display: flex;
  flex-direction: column;
}

/* 顶部导航栏 */
.admin-header {
  background-color: #2c3e50;
  color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.admin-logo {
  font-size: 1.5rem;
  margin: 0;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.welcome-text {
  font-weight: 500;
}

.logout-btn {
  padding: 0.5rem 1rem;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.logout-btn:hover {
  background-color: #c0392b;
}

/* 主要内容区域 */
.admin-content {
  display: flex;
  flex: 1;
}

/* 侧边栏 */
.admin-sidebar {
  width: 250px;
  background-color: white;
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.05);
}

.sidebar-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  cursor: pointer;
  transition: background-color 0.3s;
  color: #2c3e50;
}

.nav-item:hover {
  background-color: #f5f7fa;
}

.nav-item.active {
  background-color: #3498db;
  color: white;
}

.nav-icon {
  margin-right: 0.8rem;
  font-size: 1.2rem;
}

.nav-text {
  font-size: 1rem;
}

/* 主内容区 */
.admin-main {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
}

.section-title {
  font-size: 1.8rem;
  color: #2c3e50;
  margin-bottom: 1.5rem;
}

/* 仪表盘样式 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  font-size: 2rem;
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 1.8rem;
  font-weight: 600;
  color: #2c3e50;
}

.stat-label {
  font-size: 0.9rem;
  color: #666;
}

/* 用户管理样式 */
.table-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
}

.admin-table th, .admin-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #f0f0f0;
}

.admin-table th {
  background-color: #f5f7fa;
  font-weight: 600;
  color: #2c3e50;
}

.admin-table tr:hover {
  background-color: #f9f9f9;
}

.btn-edit {
  padding: 0.5rem 1rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 0.5rem;
}

.btn-delete {
  padding: 0.5rem 1rem;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

/* 课程管理样式 */
.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.course-card-admin {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.course-image-admin {
  width: 100%;
  height: 180px;
  overflow: hidden;
}

.course-image-admin img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.course-content-admin {
  padding: 1rem;
}

.course-title-admin {
  font-size: 1.2rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.course-description-admin {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 1rem;
}

.course-actions {
  display: flex;
  gap: 0.5rem;
}

/* 添加活动按钮 */
.add-activity {
  margin-bottom: 1.5rem;
}

.btn-add {
  padding: 0.8rem 1.5rem;
  background-color: #27ae60;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}
</style>