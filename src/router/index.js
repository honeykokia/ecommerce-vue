import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/Home.vue'
import { useUserStore } from '../stores/user.js'

// Route guard to check authentication
function requireAuth(to, from, next) {
  const userStore = useUserStore()
  if (userStore.isAuthenticated) {
    next()
  } else {
    next('/login')
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: () => import('../views/ForgotPasswordView.vue'),
    },
    {
      path: '/reset-password/:token?',
      name: 'reset-password',
      component: () => import('../views/ResetPasswordView.vue'),
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
      beforeEnter: requireAuth,
    },
    {
      path: '/profile/avatar',
      name: 'avatar-edit',
      component: () => import('../views/AvatarEditView.vue'),
      beforeEnter: requireAuth,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
      beforeEnter: requireAuth,
    },
    {
      path: '/orders',
      name: 'orders',
      component: () => import('../views/OrdersView.vue'),
      beforeEnter: requireAuth,
    },
    {
      path: '/products',
      name: 'products',
      component: () => import('../views/ProductListView.vue'),
    },
    {
      path: '/cart',
      name: 'cart',
      component: () => import('../views/CartView.vue'),
      beforeEnter: requireAuth,
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/AdminView.vue'),
      beforeEnter: requireAuth,
    },
    // Redirect old routes for compatibility
    {
      path: '/user/profile',
      redirect: '/profile',
    },
    {
      path: '/user/dashboard',
      redirect: '/dashboard',
    },
    {
      path: '/user/orders',
      redirect: '/orders',
    },
  ],
})

export default router
