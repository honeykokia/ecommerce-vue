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

// Route guard to check admin access (simplified - in real app would check user role)
function requireAdmin(to, from, next) {
  const userStore = useUserStore()
  if (userStore.isAuthenticated) {
    // In a real app, you would check if user has admin role
    // For demo purposes, we'll allow any authenticated user
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
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
      beforeEnter: requireAuth
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
      beforeEnter: requireAuth
    },
    {
      path: '/orders',
      name: 'orders',
      component: () => import('../views/OrdersView.vue'),
      beforeEnter: requireAuth
    },
    {
      path: '/cart',
      name: 'cart',
      component: () => import('../views/CartView.vue'),
      beforeEnter: requireAuth
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: () => import('../views/CheckoutView.vue'),
      beforeEnter: requireAuth
    },
    {
      path: '/admin/users',
      name: 'admin-users',
      component: () => import('../views/AdminUsersView.vue'),
      beforeEnter: requireAdmin
    },
    // Redirect old routes for compatibility
    {
      path: '/user/profile',
      redirect: '/profile'
    },
    {
      path: '/user/dashboard',
      redirect: '/dashboard'
    },
    {
      path: '/user/orders',
      redirect: '/orders'
    }
  ],
})

export default router
