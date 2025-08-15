<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const isLoading = ref(true)
const error = ref('')
const countdown = ref(3)

// Order details from route params
const orderId = ref(route.params.orderId)
const amount = ref(parseInt(route.query.amount) || 0)

onMounted(async () => {
  await initiatePaymentCheckout()
})

const initiatePaymentCheckout = async () => {
  try {
    // Mock API call to POST /payments/checkout
    const checkoutData = {
      orderId: orderId.value,
      amount: amount.value,
      itemName: route.query.itemName || 'Online Purchase',
      tradeDesc: route.query.tradeDesc || 'Payment for order'
    }

    // In real implementation, this would call the actual API
    // and receive an HTML response that redirects to ECPay
    const response = await mockPaymentCheckout(checkoutData)
    
    // Start countdown before redirect
    startCountdown()
    
  } catch (err) {
    error.value = err.message || 'Failed to initiate payment checkout'
    isLoading.value = false
  }
}

const mockPaymentCheckout = async (checkoutData) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Mock successful response
  return {
    success: true,
    redirectUrl: `https://payment.ecpay.com.tw/Cashier/AioCheckOut/V5?MerchantID=2000132&MerchantTradeNo=${checkoutData.orderId}&PaymentType=aio&TotalAmount=${checkoutData.amount}&TradeDesc=${encodeURIComponent(checkoutData.tradeDesc)}&ItemName=${encodeURIComponent(checkoutData.itemName)}&ReturnURL=${encodeURIComponent(window.location.origin + '/payment/result')}&ClientBackURL=${encodeURIComponent(window.location.origin + '/payment/result')}`
  }
}

const startCountdown = () => {
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
      // Simulate redirect to ECPay
      redirectToPaymentGateway()
    }
  }, 1000)
}

const redirectToPaymentGateway = () => {
  // In real implementation, this would redirect to the actual ECPay URL
  // For demonstration, we'll redirect to our payment result page with mock parameters
  const mockSuccessParams = new URLSearchParams({
    MerchantTradeNo: orderId.value,
    RtnCode: '1',
    RtnMsg: '交易成功',
    TradeAmt: amount.value.toString(),
    TradeDate: new Date().toISOString(),
    PaymentDate: new Date().toISOString(),
    PaymentType: 'CREDIT',
    ItemName: route.query.itemName || 'Online Purchase'
  })
  
  // Redirect to payment result page
  window.location.href = `/payment/result?${mockSuccessParams.toString()}`
}

const cancelPayment = () => {
  router.push({ name: 'payment' })
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center py-8">
    <div class="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Loading State -->
      <div v-if="isLoading && !error" class="bg-white shadow-lg rounded-lg p-8 text-center">
        <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-6">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
        
        <h1 class="text-2xl font-bold text-gray-900 mb-4">Processing Payment</h1>
        <p class="text-gray-600 mb-6">
          Please wait while we redirect you to the secure payment gateway...
        </p>
        
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div class="flex items-center justify-center">
            <div class="text-3xl font-bold text-blue-600 mr-2">{{ countdown }}</div>
            <div class="text-blue-800">
              <div class="text-sm font-medium">Redirecting in</div>
              <div class="text-xs">seconds</div>
            </div>
          </div>
        </div>
        
        <!-- Order Summary -->
        <div class="border-t border-gray-200 pt-4">
          <div class="text-sm text-gray-500 mb-2">Order Details</div>
          <div class="flex justify-between items-center mb-2">
            <span class="text-gray-600">Order ID:</span>
            <span class="font-medium text-gray-900">{{ orderId }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-600">Amount:</span>
            <span class="font-bold text-green-600">NT$ {{ amount.toLocaleString() }}</span>
          </div>
        </div>
        
        <button
          @click="cancelPayment"
          class="mt-6 w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-200"
        >
          Cancel Payment
        </button>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-white shadow-lg rounded-lg p-8 text-center">
        <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
          <span class="text-2xl text-red-600">⚠</span>
        </div>
        
        <h1 class="text-2xl font-bold text-gray-900 mb-4">Payment Error</h1>
        <p class="text-gray-600 mb-6">{{ error }}</p>
        
        <div class="space-y-3">
          <button
            @click="initiatePaymentCheckout"
            class="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
          >
            Try Again
          </button>
          <button
            @click="cancelPayment"
            class="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-200"
          >
            Back to Payment
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Additional custom styles if needed */
</style>