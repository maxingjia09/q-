import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import PersonalView from '../views/PersonalView.vue';
import AdminLoginView from '../views/AdminLoginView.vue'
import AdminDashboardView from '../views/AdminDashboardView.vue'
import CourseDetailView from '../views/CourseDetailView.vue'
import ClubDetailView from '../views/ClubDetailView.vue'
import CertificationApplyView from '../views/CertificationApplyView.vue'
import ActivitiesView from '../views/ActivitiesView.vue'
import ClubsView from '../views/ClubsView.vue'
import CoursesView from '../views/CoursesView.vue'
import CertificatesView from '../views/CertificatesView.vue'
import VideoNewsView from '../views/VideoNewsView.vue'
import AICustomView from '../views/AICustomView.vue'
import { useAuthStore } from '../stores/authStore';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresAuth: false }
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { requiresAuth: false }
    },
    {
      path: '/personal',
      name: 'personal',
      component: PersonalView,
    },
    {
      path: '/admin/login',
      name: 'admin-login',
      component: AdminLoginView,
      meta: { requiresAuth: false }
    },
    {
      path: '/admin/dashboard',
      name: 'admin-dashboard',
      component: AdminDashboardView,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/courses/:id',
      name: 'course-detail',
      component: CourseDetailView,
      props: true
    },
    {
      path: '/clubs/:id',
      name: 'club-detail',
      component: ClubDetailView,
      props: true
    },
    {
      path: '/certification-apply',
      name: 'certification-apply',
      component: CertificationApplyView
    },
    {
      path: '/activities',
      name: 'activities',
      component: ActivitiesView
    },
    {
      path: '/clubs',
      name: 'clubs',
      component: ClubsView
    },
    {
      path: '/courses',
      name: 'courses',
      component: CoursesView
    },
    {
      path: '/certificates',
      name: 'certificates',
      component: CertificatesView
    },
    {
      path: '/video-news',
      name: 'video-news',
      component: VideoNewsView
    },
    {
      path: '/ai-custom',
      name: 'ai-custom',
      component: AICustomView
    }
  ],
})

// 添加路由守卫
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  
  // 如果有token但没有用户信息，先初始化认证状态
  if (localStorage.getItem('authToken') && !authStore.user) {
    await authStore.initAuth();
  }
  
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!authStore.isAuthenticated) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else if (to.matched.some(record => record.meta.requiresAdmin)) {
      if (!authStore.user?.isAdmin) {
        // 不是管理员，跳转到个人中心
        next({
          path: '/personal'
        })
      } else {
        next()
      }
    } else {
      next()
    }
  } else {
    next()
  }
});

export default router
