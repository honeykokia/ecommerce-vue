<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Form data
const orderForm = reactive({
  paymentMethod: 'CREDIT_CARD',
  shippingMethod: 'STANDARD',
  shippingAddress: '',
  tradeDesc: ''
})

// Available options
const paymentMethods = [
  { value: 'CREDIT_CARD', label: 'Credit Card' },
  { value: 'PAYPAL', label: 'PayPal' },
  { value: 'LINE_PAY', label: 'LINE Pay' }
]

const shippingMethods = [
  { value: 'STANDARD', label: 'Standard Shipping (5-7 business days)' },
  { value: 'EXPRESS', label: 'Express Shipping (2-3 business days)' },
  { value: 'OVERNIGHT', label: 'Overnight Shipping (1 business day)' }
]

// Loading and error states
const isLoading = ref(false)
const error = ref('')

// Cart summary (mock data for now)
const cartItems = ref([
  {
    id: 1,
    name: '藍芽耳機',
    price: 2000,
    quantity: 1,
    image: '/upload/defaultProduct.jpg'
  },
  {
    id: 2,
    name: '滑鼠',
    price: 800,
    quantity: 2,
    image: '/upload/defaultProduct.jpg'
  }
])

const totalAmount = ref(3600)

// Form validation
const validateForm = () => {
  if (!orderForm.shippingAddress.trim()) {
    error.value = 'Please enter a shipping address'
    return false
  }
  error.value = ''
  return true
}

// Submit order
const submitOrder = async () => {
  if (!validateForm()) return

  isLoading.value = true
  error.value = ''

  try {
    // Mock API call - replace with actual API call
    const response = await mockCreateOrder({
      paymentMethod: orderForm.paymentMethod,
      shippingMethod: orderForm.shippingMethod,
      shippingAddress: orderForm.shippingAddress,
      tradeDesc: orderForm.tradeDesc
    })

    // Redirect to payment checkout with order ID
    router.push({ 
      name: 'payment-checkout', 
      params: { orderId: response.MerchantTradeNo },
      query: { amount: response.amountCents }
    })
  } catch (err) {
    error.value = err.message || 'Failed to create order. Please try again.'
  } finally {
    isLoading.value = false
  }
}

// Mock API function (replace with actual API call)
const mockCreateOrder = async (orderData) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Return mock response matching CreateOrderResponse schema
  return {
    MerchantTradeNo: `ORD${Date.now()}`,
    amountCents: totalAmount.value * 100, // Convert to cents
    tradeDesc: orderData.tradeDesc || 'Online purchase',
    itemName: cartItems.value.map(item => `${item.name}x${item.quantity}`).join('#')
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Checkout</h1>
        <p class="mt-2 text-gray-600">Complete your order by filling in the details below</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Order Summary -->
        <div class="bg-white shadow-lg rounded-lg p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
          
          <div class="space-y-4">
            <div v-for="item in cartItems" :key="item.id" class="flex items-center space-x-4">
              <img :src="item.image" :alt="item.name" class="w-16 h-16 object-cover rounded-md bg-gray-200">
              <div class="flex-1">
                <h3 class="text-sm font-medium text-gray-900">{{ item.name }}</h3>
                <p class="text-sm text-gray-500">Quantity: {{ item.quantity }}</p>
              </div>
              <div class="text-sm font-medium text-gray-900">
                NT$ {{ (item.price * item.quantity).toLocaleString() }}
              </div>
            </div>
          </div>

          <div class="border-t border-gray-200 mt-4 pt-4">
            <div class="flex justify-between items-center">
              <span class="text-lg font-semibold text-gray-900">Total</span>
              <span class="text-lg font-bold text-green-600">NT$ {{ totalAmount.toLocaleString() }}</span>
            </div>
          </div>
        </div>

        <!-- Payment Form -->
        <div class="bg-white shadow-lg rounded-lg p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Payment & Shipping</h2>
          
          <form @submit.prevent="submitOrder" class="space-y-6">
            <!-- Payment Method -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
              <div class="space-y-2">
                <div v-for="method in paymentMethods" :key="method.value" class="flex items-center">
                  <input
                    :id="method.value"
                    v-model="orderForm.paymentMethod"
                    :value="method.value"
                    type="radio"
                    class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                  >
                  <label :for="method.value" class="ml-3 block text-sm font-medium text-gray-700">
                    {{ method.label }}
                  </label>
                </div>
              </div>
            </div>

            <!-- Shipping Method -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Shipping Method</label>
              <select
                v-model="orderForm.shippingMethod"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
              >
                <option v-for="method in shippingMethods" :key="method.value" :value="method.value">
                  {{ method.label }}
                </option>
              </select>
            </div>

            <!-- Shipping Address -->
            <div>
              <label for="shippingAddress" class="block text-sm font-medium text-gray-700 mb-2">
                Shipping Address *
              </label>
              <textarea
                id="shippingAddress"
                v-model="orderForm.shippingAddress"
                rows="3"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder="Enter your complete shipping address..."
                required
              ></textarea>
            </div>

            <!-- Order Notes -->
            <div>
              <label for="tradeDesc" class="block text-sm font-medium text-gray-700 mb-2">
                Order Notes (Optional)
              </label>
              <textarea
                id="tradeDesc"
                v-model="orderForm.tradeDesc"
                rows="2"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder="Any special instructions for your order..."
              ></textarea>
            </div>

            <!-- Error Message -->
            <div v-if="error" class="bg-red-50 border border-red-200 rounded-md p-3">
              <p class="text-sm text-red-800">{{ error }}</p>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              :disabled="isLoading"
              class="w-full bg-green-600 text-white py-3 px-4 rounded-md font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
            >
              <span v-if="isLoading" class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
              <span v-else>Proceed to Payment</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Additional custom styles if needed */
input[type="radio"]:checked {
  background-color: #10b981;
  border-color: #10b981;
}

select:focus,
textarea:focus {
  outline: none;
  ring: 2px;
  ring-color: #10b981;
  border-color: #10b981;
}
</style>