<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '../stores/user.js'
import { adminApi,paymentApi } from '../services/api.js'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

// Component state
const isProcessing = ref(false)
const paymentSuccess = ref(false)
const paymentError = ref('')
const orderInfo = ref({})

// Format price helper
const formatPrice = (price) => {
  return new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency: 'TWD',
    minimumFractionDigits: 0,
  }).format(price)
}

// Process payment checkout
async function processPayment() {
  const { orderId , merchantTradeNo, amountCents, itemName, tradeDesc } = route.query
  if (!merchantTradeNo || !amountCents) {
    paymentError.value = '缺少訂單資訊，無法處理付款'
    return
  }

  isProcessing.value = true
  paymentError.value = ''

  try {
    // Create payment checkout request based on PaymentCheckoutRequest schema
    const paymentData = reactive({
      merchantTradeNo: merchantTradeNo,
      amountCents: parseInt(amountCents),
      itemName: itemName,
      tradeDesc: tradeDesc,
    })
    const response = await paymentApi.checkout(paymentData)

    // Based on API spec, the response should redirect to ECPay payment page
    // For this demo, we'll simulate a successful payment

    if (response) {
      // Store order info for display
      orderInfo.value = {
        orderId: merchantTradeNo,
        amount: parseInt(amountCents),
        timestamp: new Date().toISOString(),
      }
      const w = window.open('', 'ecpayWin')
      w.document.open()
      w.document.write(response)
      w.document.close()
      // Simulate payment processing delay
      let pollTimer = null
      pollTimer = setInterval(async() => {
        const res = await adminApi.getOrderStatusById(orderId)
        if (res.data.order.status === 'PAID') {
          clearInterval(pollTimer)
          isProcessing.value = false
          paymentSuccess.value = true
        }
          // paymentSuccess.value = true
          // isProcessing.value = true
        }, 5000)
    }
  } catch (error) {
    console.error('Payment processing failed:', error)
    isProcessing.value = false

    if (error.response?.data?.data?.errors) {
      const errors = error.response.data.data.errors
      paymentError.value = Object.values(errors)[0] || '付款處理失敗'
    } else {
      paymentError.value = '付款處理失敗，請稍後再試'
    }
  }
}

// Handle retry payment
function retryPayment() {
  paymentError.value = ''
  paymentSuccess.value = false
  processPayment()
}

// Navigate to orders page
function goToOrders() {
  router.push('/orders')
}

// Navigate back to home
function goToHome() {
  router.push('/')
}

// Initialize component
onMounted(async () => {
  if (!userStore.isAuthenticated) {
    router.push('/login')
    return
  }

  // Start payment processing
  await processPayment()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Processing State -->
      <div v-if="isProcessing" class="text-center">
        <div class="mx-auto h-16 w-16 text-green-600 mb-4">
          <svg class="animate-spin h-16 w-16" fill="none" viewBox="0 0 24 24">
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-gray-900 mb-2">處理付款中</h2>
        <p class="text-gray-600">正在連接至付款系統，請稍候...</p>
      </div>

      <!-- Success State -->
      <div v-else-if="paymentSuccess" class="text-center">
        <div class="mx-auto h-16 w-16 text-green-600 mb-4">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="h-16 w-16">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
        </div>

        <h2 class="text-2xl font-bold text-gray-900 mb-2">付款成功！</h2>
        <p class="text-gray-600 mb-6">您的訂單已成功建立，感謝您的購買</p>

        <!-- Order Details -->
        <div class="bg-white rounded-lg shadow-sm p-6 mb-6 text-left">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">訂單資訊</h3>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600">訂單編號：</span>
              <span class="font-medium text-gray-900">{{ orderInfo.orderId }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">付款金額：</span>
              <span class="font-medium text-gray-900">{{ formatPrice(orderInfo.amount) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">付款時間：</span>
              <span class="font-medium text-gray-900">
                {{ new Date(orderInfo.timestamp).toLocaleString('zh-TW') }}
              </span>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="space-y-3">
          <button
            @click="goToOrders"
            class="w-full bg-green-600 text-white py-3 px-4 rounded-md font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
          >
            查看我的訂單
          </button>
          <button
            @click="goToHome"
            class="w-full bg-gray-200 text-gray-900 py-3 px-4 rounded-md font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            繼續購物
          </button>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="paymentError" class="text-center">
        <div class="mx-auto h-16 w-16 text-red-600 mb-4">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="h-16 w-16">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            ></path>
          </svg>
        </div>

        <h2 class="text-2xl font-bold text-gray-900 mb-2">付款失敗</h2>
        <p class="text-gray-600 mb-6">{{ paymentError }}</p>

        <!-- Action Buttons -->
        <div class="space-y-3">
          <button
            @click="retryPayment"
            class="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            重試付款
          </button>
          <button
            @click="router.push('/cart')"
            class="w-full bg-gray-200 text-gray-900 py-3 px-4 rounded-md font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            返回購物車
          </button>
        </div>
      </div>

      <!-- Default State (shouldn't happen) -->
      <div v-else class="text-center">
        <h2 class="text-2xl font-bold text-gray-900 mb-2">載入中...</h2>
        <p class="text-gray-600">正在準備付款頁面</p>
      </div>
    </div>
  </div>
</template>
