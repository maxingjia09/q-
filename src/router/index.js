import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import PersonalView from '../views/PersonalView.vue';
import AdminLoginView from '../views/AdminLoginView.vue'
import AdminDashboardView from '../views/AdminDashboardView.vue'
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
      meta: { requiresAuth: true }
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
    }
  ],
})

// 添加路由守卫
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  
  // 确保认证状态已经初始化
  if (!authStore.isAuthenticated && !authStore.user && localStorage.getItem('authToken')) {
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
