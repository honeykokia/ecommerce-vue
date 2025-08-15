import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

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
      path: '/payment',
      name: 'payment',
      component: () => import('../views/PaymentView.vue'),
    },
    {
      path: '/payment/checkout/:orderId',
      name: 'payment-checkout',
      component: () => import('../views/PaymentCheckoutView.vue'),
    },
    {
      path: '/payment/result',
      name: 'payment-result',
      component: () => import('../views/PaymentResultView.vue'),
    },
    // Files mentioned in requirements (redirect to actual payment pages)
    {
      path: '/verify-result',
      name: 'verify-result',
      component: () => import('../views/VerifyResultView.vue'),
    },
    {
      path: '/email-verify',
      name: 'email-verify', 
      component: () => import('../views/EmailVerifyView.vue'),
    },
  ],
})

export default router
