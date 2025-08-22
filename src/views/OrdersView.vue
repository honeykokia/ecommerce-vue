<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useUserStore } from '../stores/user.js'
import { orderApi } from '../services/api.js'

const api = import.meta.env.VITE_API_URL
const userStore = useUserStore()

// Orders data
const orders = ref([])
const selectedOrder = ref(null)
const orderDetails = ref([])
const isLoading = ref(false)
const isLoadingDetails = ref(false)
const showOrderModal = ref(false)

// Filters
const filters = reactive({
  status: 'all',
  dateRange: 'all',
  search: '',
})

const statusOptions = [
  { value: 'all', label: 'All Orders' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'PAID', label: 'Paid' },
  { value: 'SHIPPED', label: 'Shipped' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELED', label: 'Cancelled' },
]

const dateRangeOptions = [
  { value: 'all', label: 'All Time' },
  { value: '7days', label: 'Last 7 Days' },
  { value: '30days', label: 'Last 30 Days' },
  { value: '90days', label: 'Last 90 Days' },
]

// Load user orders
async function loadOrders() {
  isLoading.value = true
  try {
    const response = await orderApi.getUserOrders()
    if (response.data && response.data.orders) {
      orders.value = response.data.orders
    }
  } catch (error) {
    userStore.setError(error.message || 'Failed to load orders')
  } finally {
    isLoading.value = false
  }
}

// Load order details
async function loadOrderDetails(orderId) {
  isLoadingDetails.value = true
  try {
    const response = await orderApi.getOrderDetails(orderId)
    if (response.data && response.data.items) {
      orderDetails.value = response.data.items
    }
    console.log(response.data.items)
  } catch (error) {
    userStore.setError(error.message || 'Failed to load order details')
  } finally {
    isLoadingDetails.value = false
  }
}

// View order details
async function viewOrderDetails(order) {
  selectedOrder.value = order
  showOrderModal.value = true
  await loadOrderDetails(order.id)
}

// Filter orders
const filteredOrders = computed(() => {
  let filtered = [...orders.value]

  // Filter by status
  if (filters.status !== 'all') {
    filtered = filtered.filter((order) => order.status === filters.status)
  }

  // Filter by date range
  if (filters.dateRange !== 'all') {
    const now = new Date()
    const daysMap = {
      '7days': 7,
      '30days': 30,
      '90days': 90,
    }

    if (daysMap[filters.dateRange]) {
      const cutoffDate = new Date(now.getTime() - daysMap[filters.dateRange] * 24 * 60 * 60 * 1000)
      filtered = filtered.filter((order) => new Date(order.createAt) >= cutoffDate)
    }
  }

  // Filter by search
  if (filters.search) {
    const search = filters.search.toLowerCase()
    filtered = filtered.filter(
      (order) =>
        order.orderNumber.toLowerCase().includes(search) ||
        order.status.toLowerCase().includes(search),
    )
  }

  return filtered.sort((a, b) => new Date(b.createAt) - new Date(a.createAt))
})

// Format currency
function formatCurrency(amount) {
  return new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency: 'TWD',
  }).format(amount) // Assuming amounts are in cents
}

// Format date
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
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

// Get status classes
function getStatusClasses(status) {
  const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium'
  const colorClasses = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    PAID: 'bg-blue-100 text-blue-800',
    SHIPPED: 'bg-purple-100 text-purple-800',
    COMPLETED: 'bg-green-100 text-green-800',
    CANCELED: 'bg-red-100 text-red-800',
  }
  return `${baseClasses} ${colorClasses[status] || 'bg-gray-100 text-gray-800'}`
}

// Get payment method display
function getPaymentMethodDisplay(method) {
  const methods = {
    CREDIT_CARD: 'Credit Card',
    PAYPAL: 'PayPal',
    LINE_PAY: 'LINE Pay',
  }
  return methods[method] || method
}

onMounted(() => {
  loadOrders()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">My Orders</h1>
        <p class="mt-2 text-gray-600">Track and manage your order history</p>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Status Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              v-model="filters.status"
              class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option v-for="option in statusOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>

          <!-- Date Range Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <select
              v-model="filters.dateRange"
              class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option v-for="option in dateRangeOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>

          <!-- Search -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i class="fas fa-search text-gray-400"></i>
              </div>
              <input
                v-model="filters.search"
                type="text"
                placeholder="Search by order number..."
                class="block w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Error state -->
      <div
        v-if="userStore.error"
        class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6"
      >
        <div class="flex">
          <i class="fas fa-exclamation-circle mt-0.5 mr-2"></i>
          <span>{{ userStore.error }}</span>
        </div>
      </div>

      <!-- Loading state -->
      <div v-if="isLoading" class="bg-white rounded-lg shadow-sm p-8 text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">Loading orders...</p>
      </div>

      <!-- Orders list -->
      <div
        v-else-if="filteredOrders.length > 0"
        class="bg-white rounded-lg shadow-sm overflow-hidden"
      >
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-medium text-gray-900">
            {{ filteredOrders.length }} {{ filteredOrders.length === 1 ? 'Order' : 'Orders' }}
          </h2>
        </div>

        <div class="divide-y divide-gray-200">
          <div
            v-for="order in filteredOrders"
            :key="order.id"
            class="p-6 hover:bg-gray-50 transition duration-200"
          >
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div class="flex items-center space-x-4">
                  <div>
                    <p class="text-lg font-medium text-gray-900">#{{ order.merchantTradeNo }}</p>
                    <div class="flex items-center space-x-4 mt-1">
                      <p class="text-sm text-gray-600">
                        {{ formatDate(order.createdAt) }}
                      </p>
                      <span :class="getStatusClasses(order.status)">
                        {{ order.status }}
                      </span>
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <p class="text-sm font-medium text-gray-500">Total Amount</p>
                    <p class="text-lg font-bold text-gray-900">
                      {{ formatCurrency(order.amountCents) }}
                    </p>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-500">Payment</p>
                    <p class="text-sm text-gray-900">
                      {{ getPaymentMethodDisplay(order.paymentMethod) }}
                    </p>
                    <p class="text-xs text-gray-600">
                      {{ order.isPaid ? 'Paid' : 'Unpaid' }}
                      <span v-if="order.paidAt">on {{ formatDate(order.paidAt) }}</span>
                    </p>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-500">Shipping</p>
                    <p class="text-sm text-gray-900">{{ order.shippingMethod }}</p>
                    <p class="text-xs text-gray-600">{{ order.shippingStatus }}</p>
                  </div>
                </div>

                <div v-if="order.shippingAddress" class="mt-3">
                  <p class="text-sm font-medium text-gray-500">Delivery Address</p>
                  <p class="text-sm text-gray-900">{{ order.shippingAddress }}</p>
                </div>
              </div>

              <div class="ml-6">
                <button
                  @click="viewOrderDetails(order)"
                  class="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
                >
                  <i class="fas fa-eye mr-2"></i>
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else class="bg-white rounded-lg shadow-sm p-12 text-center">
        <i class="fas fa-shopping-bag text-gray-300 text-5xl mb-4"></i>
        <h3 class="text-xl font-medium text-gray-900 mb-2">
          {{ filters.status !== 'all' || filters.search ? 'No matching orders' : 'No orders yet' }}
        </h3>
        <p class="text-gray-600 mb-6">
          {{
            filters.status !== 'all' || filters.search
              ? 'Try adjusting your filters to see more results.'
              : 'Start shopping to see your orders here.'
          }}
        </p>
        <RouterLink
          to="/"
          class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
        >
          <i class="fas fa-shopping-cart mr-2"></i>
          Start Shopping
        </RouterLink>
      </div>
    </div>

    <!-- Order Details Modal -->
    <div
      v-if="showOrderModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-screen overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-900">
              Order Details - #{{ selectedOrder?.merchantTradeNo }}
            </h3>
            <button
              @click="showOrderModal = false"
              class="text-gray-400 hover:text-gray-600 transition duration-200"
            >
              <i class="fas fa-times text-xl"></i>
            </button>
          </div>
        </div>

        <div class="p-6 overflow-y-auto max-h-96">
          <!-- Loading details -->
          <div v-if="isLoadingDetails" class="text-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p class="mt-4 text-gray-600">Loading order details...</p>
          </div>

          <!-- Order details -->
          <div v-else-if="orderDetails.length > 0" class="space-y-4">
            <div
              v-for="item in orderDetails"
              :key="item.productId"
              class="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg"
            >
              <!-- <div>
                  <img :src="`${api}${item.imageURL}`" alt="" class="w-16 h-16 object-cover rounded-md" />
              </div> -->
              <div class="flex-1">
                <h4 class="font-medium text-gray-900">{{ item.productName }}</h4>
                <div class="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                  <span>Quantity: {{ item.quantity }}</span>
                  <span>Unit Price: {{ formatCurrency(item.unitPrice) }}</span>
                  <span class="font-medium text-gray-900">
                    Total: {{ formatCurrency(item.totalPrice) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Order summary -->
            <div class="mt-6 pt-6 border-t border-gray-200">
              <div class="flex justify-between items-center">
                <span class="text-lg font-medium text-gray-900">Order Total</span>
                <span class="text-xl font-bold text-gray-900">
                  {{ formatCurrency(selectedOrder?.amountCents) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Empty details -->
          <div v-else class="text-center py-8">
            <i class="fas fa-box-open text-gray-300 text-4xl mb-4"></i>
            <p class="text-gray-600">No order details available</p>
          </div>
        </div>
      </div>
      
    </div>
          <!-- Back to Dashboard -->
      <div class="mt-8 text-center">
        <RouterLink
          to="/dashboard"
          class="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
        >
          <i class="fas fa-arrow-left mr-2"></i>
          Back to Dashboard
        </RouterLink>
      </div>
  </div>
  
</template>
