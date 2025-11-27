import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import PersonalView from '../views/PersonalView.vue';

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
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },
    {
      path: '/personal',
      name: 'personal',
      component: PersonalView,
      // 移除requiresAuth，允许未登录用户访问，让组件内的弹窗逻辑工作
      meta: {
        requiresAuth: false
      }
    },
    {
     
    }
  ],
})

// 添加路由守卫
router.beforeEach((to, from, next) => {
  console.log('Router guard triggered for route:', to.path);
  const authStore = useAuthStore();
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  
  console.log('Route requires auth:', requiresAuth);
  console.log('Current auth status:', authStore.isAuthenticated);
  console.log('Current user:', authStore.user);

  if (requiresAuth && !authStore.isAuthenticated) {
    // 需要登录，但未登录，重定向到登录页
    console.log('Auth required but not authenticated, redirecting to /login');
    next('/login');
  } else {
    console.log('Allowing navigation to:', to.path);
    next();
  }
});

export default router
