<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user.js'
import { userApi, orderApi, cartApi } from '../services/api.js'

const router = useRouter()
const userStore = useUserStore()

// Dashboard data
const dashboardData = reactive({
  recentOrders: [],
  cartItemCount: 0,
  totalSpent: 0,
  orderStats: {
    pending: 0,
    completed: 0,
    cancelled: 0,
  },
})

const isLoading = ref(false)

// Quick actions
const quickActions = [
  {
    title: 'View Profile',
    description: 'Manage your personal information',
    icon: 'fas fa-user',
    color: 'blue',
    action: () => router.push('/profile'),
  },
  {
    title: 'Order History',
    description: 'View your past orders',
    icon: 'fas fa-shopping-bag',
    color: 'green',
    action: () => router.push('/orders'),
  },
  {
    title: 'View Promotion',
    description: 'Check current deals and offers',
    icon: 'fas fa-percentage',
    color: 'red',
    action: () => router.push('/promotions'),
  },
  {
    title: 'Shopping Cart',
    description: 'View items in your cart',
    icon: 'fas fa-shopping-cart',
    color: 'gray',
    action: () => router.push('/cart'),
  },
]

// Load dashboard data
async function loadDashboardData() {
  isLoading.value = true
  try {
    // Load recent orders
    const ordersResponse = await orderApi.getUserOrders()
    if (ordersResponse.data && ordersResponse.data.orders) {
      dashboardData.recentOrders = ordersResponse.data.orders.slice(0, 3)

      // Calculate stats
      const orders = ordersResponse.data.orders
      dashboardData.orderStats.pending = orders.filter((o) => o.status === 'PENDING').length
      dashboardData.orderStats.completed = orders.filter((o) => o.status === 'COMPLETED').length
      dashboardData.orderStats.cancelled = orders.filter((o) => o.status === 'CANCELED').length
      dashboardData.totalSpent = orders.reduce((sum, order) => sum + (order.amountCents || 0), 0)
    }

    // Load cart count
    const cartResponse = await cartApi.getCart()
    if (cartResponse.data && cartResponse.data.cart) {
      dashboardData.cartItemCount = cartResponse.data.cart.length
    }
  } catch (error) {
    console.error('Failed to load dashboard data:', error)
  } finally {
    isLoading.value = false
  }
}

// Format currency
function formatCurrency(amount) {
  return new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency: 'TWD',
  }).format(amount) // Assuming amounts are in cents
}

// Format date
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString()
}

// Get status color
function getStatusColor(status) {
  const colors = {
    PENDING: 'yellow',
    PAID: 'blue',
    SHIPPED: 'purple',
    COMPLETED: 'green',
    CANCELED: 'red',
  }
  return colors[status] || 'gray'
}

onMounted(() => {
  loadDashboardData()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">
          Welcome back, {{ userStore.userName || 'User' }}!
        </h1>
        <p class="mt-2 text-gray-600">Here's what's happening with your account today.</p>
      </div>

      <!-- Loading state -->
      <div v-if="isLoading" class="bg-white rounded-lg shadow-sm p-8 text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">Loading dashboard...</p>
      </div>

      <template v-else>
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div class="bg-white rounded-lg shadow-sm p-6">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-green-100">
                <i class="fas fa-dollar-sign text-green-600 text-xl"></i>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Total Spent</p>
                <p class="text-2xl font-bold text-gray-900">
                  {{ formatCurrency(dashboardData.totalSpent) }}
                </p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-sm p-6">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-blue-100">
                <i class="fas fa-shopping-bag text-blue-600 text-xl"></i>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Total Orders</p>
                <p class="text-2xl font-bold text-gray-900">
                  {{ dashboardData.recentOrders.length }}
                </p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-sm p-6">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-yellow-100">
                <i class="fas fa-clock text-yellow-600 text-xl"></i>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Pending Orders</p>
                <p class="text-2xl font-bold text-gray-900">
                  {{ dashboardData.orderStats.pending }}
                </p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-sm p-6">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-purple-100">
                <i class="fas fa-shopping-cart text-purple-600 text-xl"></i>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Cart Items</p>
                <p class="text-2xl font-bold text-gray-900">{{ dashboardData.cartItemCount }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 class="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              v-for="action in quickActions"
              :key="action.title"
              @click="action.action"
              :class="[
                'p-4 rounded-lg border-2 border-dashed border-gray-200 hover:border-gray-300 transition duration-200 text-left group',
                `hover:bg-blue-50`,
              ]"
            >
              <div
                :class="[
                  'w-10 h-10 rounded-lg flex items-center justify-center mb-3',
                  `bg-${action.color}-100 group-hover:bg-${action.color}-200`,
                ]"
              >
                <i :class="[action.icon, `text-${action.color}-600`]"></i>
              </div>
              <h3 class="font-medium text-gray-900 mb-1">{{ action.title }}</h3>
              <p class="text-sm text-gray-600">{{ action.description }}</p>
            </button>
          </div>
        </div>

        <!-- Recent Orders -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold text-gray-900">Recent Orders</h2>
            <RouterLink
              to="/orders"
              class="text-blue-600 hover:text-blue-700 text-sm font-medium transition duration-200"
            >
              View all orders →
            </RouterLink>
          </div>

          <div v-if="dashboardData.recentOrders.length === 0" class="text-center py-8">
            <i class="fas fa-shopping-bag text-gray-300 text-4xl mb-4"></i>
            <h3 class="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
            <p class="text-gray-600 mb-4">Start shopping to see your orders here</p>
            <RouterLink
              to="/"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition duration-200"
            >
              Start Shopping
            </RouterLink>
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="order in dashboardData.recentOrders"
              :key="order.id"
              class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition duration-200"
            >
              <div class="flex items-center justify-between">
                <div>
                  <p class="font-medium text-gray-900">#{{ order.merchantTradeNo }}</p>
                  <p class="text-sm text-gray-600">{{ formatDate(order.createdAt) }}</p>
                </div>
                <div class="text-right">
                  <p class="font-medium text-gray-900">{{ formatCurrency(order.amountCents) }}</p>
                  <span
                    :class="[
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      getStatusColor(order.status) === 'green'
                        ? 'bg-green-100 text-green-800'
                        : getStatusColor(order.status) === 'yellow'
                          ? 'bg-yellow-100 text-yellow-800'
                          : getStatusColor(order.status) === 'blue'
                            ? 'bg-blue-100 text-blue-800'
                            : getStatusColor(order.status) === 'purple'
                              ? 'bg-purple-100 text-purple-800'
                              : getStatusColor(order.status) === 'red'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800',
                    ]"
                  >
                    {{ order.status }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
