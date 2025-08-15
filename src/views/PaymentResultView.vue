<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// Payment result data
const paymentResult = ref(null)
const isLoading = ref(true)
const error = ref('')

// Payment status from URL params or query
const merchantTradeNo = ref(route.params.merchantTradeNo || route.query.MerchantTradeNo)
const paymentStatus = ref(route.query.RtnCode || '0')
const paymentMessage = ref(route.query.RtnMsg || '')

// Mock order data
const orderDetails = ref({
  merchantTradeNo: '',
  amount: 0,
  itemName: '',
  paymentMethod: '',
  tradeDate: '',
  paymentDate: ''
})

// Check payment status based on RtnCode
const isPaymentSuccessful = ref(false)
const statusIcon = ref('')
const statusColor = ref('')
const statusMessage = ref('')

onMounted(async () => {
  await fetchPaymentResult()
})

const fetchPaymentResult = async () => {
  isLoading.value = true
  error.value = ''

  try {
    // Mock API call to check payment result
    // In real implementation, this would call the backend to verify payment status
    await mockFetchPaymentResult()
    
    // Determine payment status
    updatePaymentStatus()
  } catch (err) {
    error.value = err.message || 'Failed to fetch payment result'
  } finally {
    isLoading.value = false
  }
}

const mockFetchPaymentResult = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Mock response based on query parameters
  const mockResult = {
    merchantTradeNo: merchantTradeNo.value || `ORD${Date.now()}`,
    amount: parseInt(route.query.TradeAmt) || 3600,
    itemName: route.query.ItemName || '藍芽耳機x1#滑鼠x2',
    paymentMethod: route.query.PaymentType || 'CREDIT',
    tradeDate: route.query.TradeDate || new Date().toISOString(),
    paymentDate: route.query.PaymentDate || new Date().toISOString(),
    rtnCode: paymentStatus.value,
    rtnMsg: paymentMessage.value || (paymentStatus.value === '1' ? '交易成功' : '交易失敗')
  }

  orderDetails.value = mockResult
  paymentResult.value = mockResult
}

const updatePaymentStatus = () => {
  // ECPay returns RtnCode: '1' for success, others for failure
  isPaymentSuccessful.value = paymentStatus.value === '1'
  
  if (isPaymentSuccessful.value) {
    statusIcon.value = '✓'
    statusColor.value = 'text-green-600 bg-green-100'
    statusMessage.value = 'Payment Successful!'
  } else {
    statusIcon.value = '✗'
    statusColor.value = 'text-red-600 bg-red-100'
    statusMessage.value = 'Payment Failed'
  }
}

const goToOrders = () => {
  router.push({ name: 'orders' })
}

const goToHome = () => {
  router.push({ name: 'home' })
}

const retryPayment = () => {
  // Redirect back to payment page
  router.push({ name: 'payment' })
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        <p class="mt-4 text-gray-600">Verifying payment...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-white shadow-lg rounded-lg p-8 text-center">
        <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
          <span class="text-2xl text-red-600">⚠</span>
        </div>
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Error</h1>
        <p class="text-gray-600 mb-6">{{ error }}</p>
        <button
          @click="fetchPaymentResult"
          class="bg-blue-600 text-white py-2 px-6 rounded-md font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
        >
          Try Again
        </button>
      </div>

      <!-- Payment Result -->
      <div v-else class="bg-white shadow-lg rounded-lg overflow-hidden">
        <!-- Status Header -->
        <div class="text-center py-8 px-6" :class="isPaymentSuccessful ? 'bg-green-50' : 'bg-red-50'">
          <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full mb-4" :class="statusColor">
            <span class="text-3xl font-bold">{{ statusIcon }}</span>
          </div>
          <h1 class="text-3xl font-bold mb-2" :class="isPaymentSuccessful ? 'text-green-800' : 'text-red-800'">
            {{ statusMessage }}
          </h1>
          <p class="text-gray-600">
            {{ paymentResult?.rtnMsg || paymentMessage }}
          </p>
        </div>

        <!-- Order Details -->
        <div class="px-6 py-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Order Details</h2>
          
          <div class="grid grid-cols-1 gap-4">
            <div class="flex justify-between py-2 border-b border-gray-200">
              <span class="text-gray-600">Order Number:</span>
              <span class="font-medium text-gray-900">{{ orderDetails.merchantTradeNo }}</span>
            </div>
            
            <div class="flex justify-between py-2 border-b border-gray-200">
              <span class="text-gray-600">Amount:</span>
              <span class="font-medium text-gray-900">NT$ {{ orderDetails.amount?.toLocaleString() }}</span>
            </div>
            
            <div class="flex justify-between py-2 border-b border-gray-200">
              <span class="text-gray-600">Items:</span>
              <span class="font-medium text-gray-900 text-right">{{ orderDetails.itemName }}</span>
            </div>
            
            <div class="flex justify-between py-2 border-b border-gray-200">
              <span class="text-gray-600">Payment Method:</span>
              <span class="font-medium text-gray-900">{{ orderDetails.paymentMethod }}</span>
            </div>
            
            <div v-if="orderDetails.paymentDate" class="flex justify-between py-2 border-b border-gray-200">
              <span class="text-gray-600">Payment Date:</span>
              <span class="font-medium text-gray-900">
                {{ new Date(orderDetails.paymentDate).toLocaleString() }}
              </span>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="px-6 py-6 bg-gray-50 border-t border-gray-200">
          <div v-if="isPaymentSuccessful" class="space-y-3">
            <button
              @click="goToOrders"
              class="w-full bg-green-600 text-white py-3 px-4 rounded-md font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-200"
            >
              View My Orders
            </button>
            <button
              @click="goToHome"
              class="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-md font-semibold hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-200"
            >
              Continue Shopping
            </button>
          </div>
          
          <div v-else class="space-y-3">
            <button
              @click="retryPayment"
              class="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
            >
              Try Payment Again
            </button>
            <button
              @click="goToHome"
              class="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-md font-semibold hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-200"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>

      <!-- Additional Info for Successful Payments -->
      <div v-if="!isLoading && !error && isPaymentSuccessful" class="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <span class="text-blue-600 text-xl">ℹ</span>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-blue-800">What happens next?</h3>
            <div class="mt-2 text-sm text-blue-700">
              <ul class="list-disc list-inside space-y-1">
                <li>You will receive an order confirmation email shortly</li>
                <li>Your order will be processed and shipped within 1-2 business days</li>
                <li>You can track your order status in the "My Orders" section</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Additional custom styles if needed */
</style>