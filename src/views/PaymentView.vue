<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart.js'
import { useUserStore } from '../stores/user.js'
import { orderApi } from '../services/api.js'

const router = useRouter()
const cartStore = useCartStore()
const userStore = useUserStore()

// Form data based on CreateOrderRequest schema
const formData = reactive({
  paymentMethod: 'CREDIT_CARD',
  shippingMethod: 'STANDARD',
  shippingAddress: '',
  tradeDesc: '',
})

// Form validation and state
const errors = ref({})
const isSubmitting = ref(false)

// Payment method options
const paymentMethods = [
  { value: 'CREDIT_CARD', label: '信用卡' },
  { value: 'PAYPAL', label: 'PayPal' },
  { value: 'LINE_PAY', label: 'LINE Pay' },
]

// Shipping method options
const shippingMethods = [
  { value: 'STANDARD', label: '標準配送 (3-5工作天)', price: 60 },
  { value: 'EXPRESS', label: '快速配送 (1-2工作天)', price: 120 },
  { value: 'OVERNIGHT', label: '隔夜配送', price: 200 },
]

// Computed values
const shippingFee = computed(() => {
  const method = shippingMethods.find((m) => m.value === formData.shippingMethod)
  return cartStore.cartTotal >= 1000 ? 0 : method?.price || 60
})

const finalTotal = computed(() => {
  return cartStore.cartTotal + shippingFee.value
})

// Format price helper
const formatPrice = (price) => {
  return new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency: 'TWD',
    minimumFractionDigits: 0,
  }).format(price)
}

// Validate form
function validateForm() {
  const newErrors = {}

  if (!formData.paymentMethod) {
    newErrors.paymentMethod = '請選擇付款方式'
  }

  if (!formData.shippingMethod) {
    newErrors.shippingMethod = '請選擇配送方式'
  }

  if (!formData.shippingAddress.trim()) {
    newErrors.shippingAddress = '請輸入配送地址'
  } else if (formData.shippingAddress.length < 10) {
    newErrors.shippingAddress = '請輸入完整的配送地址'
  }

  errors.value = newErrors
  return Object.keys(newErrors).length === 0
}

// Handle form submission
async function handleSubmit() {
  if (!validateForm()) {
    return
  }

  if (cartStore.items.length === 0) {
    errors.value.general = '購物車為空，無法建立訂單'
    return
  }

  isSubmitting.value = true
  errors.value = {}

  try {
    // Create order with form data
    const response = await orderApi.createOrder({
      ...formData,
      tradeDesc: formData.tradeDesc || `訂單 - ${cartStore.items.length} 項商品`,
    })

    if (response.data?.order) {
      // Clear cart after successful order creation
      await cartStore.clearCart()

      // Navigate to payment result page with order data
      router.push({
        name: 'payment-result',
        query: {
          orderId: response.data.order.id,
          amount: finalTotal.value,
        },
      })
    }
  } catch (error) {
    console.error('Order creation failed:', error)
    if (error.response?.data?.data?.errors) {
      errors.value = error.response.data.data.errors
    } else {
      errors.value.general = '建立訂單失敗，請稍後再試'
    }
  } finally {
    isSubmitting.value = false
  }
}

// Load cart data on mount
onMounted(async () => {
  if (!userStore.isAuthenticated) {
    router.push('/login')
    return
  }

  try {
    await cartStore.fetchCart()

    if (cartStore.items.length === 0) {
      router.push('/cart')
      return
    }

    // Pre-fill address from user profile if available
    if (userStore.user?.address) {
      formData.shippingAddress = userStore.user.address
    }
  } catch (error) {
    console.error('Failed to load cart:', error)
    errors.value.general = '載入購物車失敗'
  }
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900">結帳付款</h1>
        <p class="mt-2 text-gray-600">請填寫付款與配送資訊</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Payment Form -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">付款資訊</h2>

          <form @submit.prevent="handleSubmit" class="space-y-6">
            <!-- General Error -->
            <div v-if="errors.general" class="bg-red-50 border border-red-200 rounded-md p-4">
              <p class="text-red-600 text-sm">{{ errors.general }}</p>
            </div>

            <!-- Payment Method -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">付款方式</label>
              <div class="space-y-2">
                <div v-for="method in paymentMethods" :key="method.value" class="flex items-center">
                  <input
                    :id="`payment-${method.value}`"
                    v-model="formData.paymentMethod"
                    :value="method.value"
                    type="radio"
                    class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                  />
                  <label :for="`payment-${method.value}`" class="ml-3 block text-sm text-gray-700">
                    {{ method.label }}
                  </label>
                </div>
              </div>
              <p v-if="errors.paymentMethod" class="mt-1 text-sm text-red-600">
                {{ errors.paymentMethod }}
              </p>
            </div>

            <!-- Shipping Method -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">配送方式</label>
              <div class="space-y-2">
                <div
                  v-for="method in shippingMethods"
                  :key="method.value"
                  class="flex items-center justify-between p-3 border border-gray-200 rounded-md"
                >
                  <div class="flex items-center">
                    <input
                      :id="`shipping-${method.value}`"
                      v-model="formData.shippingMethod"
                      :value="method.value"
                      type="radio"
                      class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                    />
                    <label
                      :for="`shipping-${method.value}`"
                      class="ml-3 block text-sm text-gray-700"
                    >
                      {{ method.label }}
                    </label>
                  </div>
                  <span class="text-sm font-medium text-gray-900">
                    {{ cartStore.cartTotal >= 1000 ? '免費' : formatPrice(method.price) }}
                  </span>
                </div>
              </div>
              <p v-if="errors.shippingMethod" class="mt-1 text-sm text-red-600">
                {{ errors.shippingMethod }}
              </p>
            </div>

            <!-- Shipping Address -->
            <div>
              <label for="shippingAddress" class="block text-sm font-medium text-gray-700 mb-2"
                >配送地址</label
              >
              <textarea
                id="shippingAddress"
                v-model="formData.shippingAddress"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="請輸入完整的配送地址..."
              ></textarea>
              <p v-if="errors.shippingAddress" class="mt-1 text-sm text-red-600">
                {{ errors.shippingAddress }}
              </p>
            </div>

            <!-- Trade Description -->
            <div>
              <label for="tradeDesc" class="block text-sm font-medium text-gray-700 mb-2"
                >訂單備註 (選填)</label
              >
              <textarea
                id="tradeDesc"
                v-model="formData.tradeDesc"
                rows="2"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="有什麼特殊需求可以在這裡告訴我們..."
              ></textarea>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              :disabled="isSubmitting || cartStore.items.length === 0"
              class="w-full bg-green-600 text-white py-3 px-4 rounded-md font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span v-if="isSubmitting">處理中...</span>
              <span v-else>確認訂單並付款</span>
            </button>
          </form>
        </div>

        <!-- Order Summary -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">訂單摘要</h2>

          <!-- Cart Items -->
          <div class="space-y-4 mb-6">
            <div
              v-for="item in cartStore.items"
              :key="item.id"
              class="flex justify-between items-center"
            >
              <div class="flex-1">
                <h4 class="text-sm font-medium text-gray-900">{{ item.name }}</h4>
                <p class="text-sm text-gray-500">數量: {{ item.quantity }}</p>
              </div>
              <span class="text-sm font-medium text-gray-900">
                {{ formatPrice(item.price * item.quantity) }}
              </span>
            </div>
          </div>

          <!-- Totals -->
          <div class="border-t border-gray-200 pt-4 space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">商品小計</span>
              <span class="text-gray-900">{{ formatPrice(cartStore.cartTotal) }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">運費</span>
              <span class="text-gray-900">
                {{ shippingFee === 0 ? '免費' : formatPrice(shippingFee) }}
              </span>
            </div>
            <div v-if="cartStore.cartTotal >= 1000" class="text-sm text-green-600">
              🎉 滿 NT$1,000 免運費
            </div>
            <div class="flex justify-between text-lg font-semibold pt-2 border-t border-gray-200">
              <span class="text-gray-900">總計</span>
              <span class="text-gray-900">{{ formatPrice(finalTotal) }}</span>
            </div>
          </div>

          <!-- Back to Cart -->
          <div class="mt-6 pt-4 border-t border-gray-200">
            <button
              @click="router.push('/cart')"
              class="w-full text-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              ← 返回購物車修改
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
