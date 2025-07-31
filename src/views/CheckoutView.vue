<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart.js'
import { useUserStore } from '../stores/user.js'
import { orderApi } from '../services/api.js'

const router = useRouter()
const cartStore = useCartStore()
const userStore = useUserStore()

const isLoading = ref(false)
const error = ref(null)
const showSuccess = ref(false)
const orderNumber = ref('')

// Checkout form data
const checkoutForm = reactive({
  paymentMethod: 'CREDIT_CARD',
  shippingMethod: 'STANDARD',
  shippingAddress: '',
  notes: ''
})

// Validation errors
const errors = ref({})

// Computed totals (same logic as CartSummary)
const subtotal = computed(() => {
  return cartStore.cartItems.reduce((total, item) => total + (item.unitPrice * item.quantity), 0)
})

const taxRate = 0.1
const shippingCost = 10
const tax = computed(() => Math.round(subtotal.value * taxRate))
const shipping = computed(() => subtotal.value > 0 ? shippingCost : 0)
const total = computed(() => subtotal.value + tax.value + shipping.value)

onMounted(() => {
  // Redirect if cart is empty
  if (cartStore.isEmpty) {
    router.push('/cart')
    return
  }
  
  // Fetch cart to ensure we have latest data
  cartStore.fetchCart()
})

// Validate form
function validateForm() {
  const newErrors = {}
  
  if (!checkoutForm.shippingAddress.trim()) {
    newErrors.shippingAddress = 'Shipping address is required'
  }
  
  errors.value = newErrors
  return Object.keys(newErrors).length === 0
}

// Handle checkout submission
async function handleCheckout() {
  if (!validateForm()) {
    return
  }

  isLoading.value = true
  error.value = null

  try {
    // Prepare checkout data
    const checkoutData = {
      cartId: cartStore.cartItems[0]?.id, // Assuming cart has an ID
      paymentMethod: checkoutForm.paymentMethod,
      shippingMethod: checkoutForm.shippingMethod,
      shippingAddress: checkoutForm.shippingAddress,
      notes: checkoutForm.notes || undefined
    }

    const response = await orderApi.createOrder(checkoutData)
    
    if (response.data && response.data.order) {
      orderNumber.value = response.data.order.orderNumber
      showSuccess.value = true
      
      // Clear cart after successful order
      await cartStore.clearCart()
    }
  } catch (err) {
    error.value = err.message || 'Checkout failed. Please try again.'
  } finally {
    isLoading.value = false
  }
}

// Navigate back to cart
function goBackToCart() {
  router.push('/cart')
}

// Navigate to orders page
function viewOrders() {
  router.push('/orders')
}

// Clear field error when user starts typing
function clearFieldError(field) {
  if (errors.value[field]) {
    delete errors.value[field]
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Success Modal -->
      <div v-if="showSuccess" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-8 max-w-md mx-4 text-center">
          <div class="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <i class="fas fa-check-circle text-green-600 text-2xl"></i>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-4">Order Placed Successfully!</h3>
          <p class="text-gray-600 mb-2">Your order number is:</p>
          <p class="text-lg font-mono font-semibold text-blue-600 mb-6">{{ orderNumber }}</p>
          <div class="space-y-3">
            <button
              @click="viewOrders"
              class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
            >
              View Orders
            </button>
            <button
              @click="router.push('/')"
              class="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition duration-200"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>

      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
        <p class="text-gray-600">Complete your order</p>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
        <div class="flex">
          <i class="fas fa-exclamation-circle mt-0.5 mr-2"></i>
          <span>{{ error }}</span>
        </div>
      </div>

      <div class="lg:grid lg:grid-cols-2 lg:gap-8">
        <!-- Checkout Form -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">Shipping & Payment</h2>
          
          <form @submit.prevent="handleCheckout" class="space-y-6">
            <!-- Shipping Address -->
            <div>
              <label for="shippingAddress" class="block text-sm font-medium text-gray-700 mb-2">
                Shipping Address *
              </label>
              <textarea
                id="shippingAddress"
                v-model="checkoutForm.shippingAddress"
                @input="clearFieldError('shippingAddress')"
                rows="3"
                :class="[
                  'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200',
                  errors.shippingAddress ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''
                ]"
                placeholder="Enter your full shipping address"
                required
              ></textarea>
              <p v-if="errors.shippingAddress" class="mt-1 text-sm text-red-600">{{ errors.shippingAddress }}</p>
            </div>

            <!-- Payment Method -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Payment Method *
              </label>
              <div class="space-y-2">
                <label class="flex items-center">
                  <input
                    v-model="checkoutForm.paymentMethod"
                    type="radio"
                    value="CREDIT_CARD"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span class="ml-2 text-sm text-gray-700">Credit Card</span>
                  <i class="fas fa-credit-card ml-2 text-gray-400"></i>
                </label>
                <label class="flex items-center">
                  <input
                    v-model="checkoutForm.paymentMethod"
                    type="radio"
                    value="PAYPAL"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span class="ml-2 text-sm text-gray-700">PayPal</span>
                  <i class="fab fa-paypal ml-2 text-gray-400"></i>
                </label>
                <label class="flex items-center">
                  <input
                    v-model="checkoutForm.paymentMethod"
                    type="radio"
                    value="LINE_PAY"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span class="ml-2 text-sm text-gray-700">LINE Pay</span>
                  <i class="fab fa-line ml-2 text-gray-400"></i>
                </label>
              </div>
            </div>

            <!-- Shipping Method -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Shipping Method *
              </label>
              <div class="space-y-2">
                <label class="flex items-center justify-between p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <div class="flex items-center">
                    <input
                      v-model="checkoutForm.shippingMethod"
                      type="radio"
                      value="STANDARD"
                      class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span class="ml-2 text-sm text-gray-700">Standard Shipping</span>
                  </div>
                  <span class="text-sm text-gray-500">$10 (5-7 days)</span>
                </label>
                <label class="flex items-center justify-between p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <div class="flex items-center">
                    <input
                      v-model="checkoutForm.shippingMethod"
                      type="radio"
                      value="EXPRESS"
                      class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span class="ml-2 text-sm text-gray-700">Express Shipping</span>
                  </div>
                  <span class="text-sm text-gray-500">$25 (2-3 days)</span>
                </label>
              </div>
            </div>

            <!-- Order Notes -->
            <div>
              <label for="notes" class="block text-sm font-medium text-gray-700 mb-2">
                Order Notes (Optional)
              </label>
              <textarea
                id="notes"
                v-model="checkoutForm.notes"
                rows="2"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                placeholder="Any special instructions for your order"
              ></textarea>
            </div>

            <!-- Action Buttons -->
            <div class="flex space-x-4 pt-4">
              <button
                type="button"
                @click="goBackToCart"
                class="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition duration-200"
              >
                Back to Cart
              </button>
              <button
                type="submit"
                :disabled="isLoading"
                :class="[
                  'flex-1 py-3 px-4 rounded-lg text-white font-medium transition duration-200',
                  isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                ]"
              >
                <span v-if="isLoading" class="flex items-center justify-center">
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
                <span v-else>Place Order</span>
              </button>
            </div>
          </form>
        </div>

        <!-- Order Summary -->
        <div class="mt-8 lg:mt-0">
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
            
            <!-- Cart Items Summary -->
            <div class="space-y-4 mb-6">
              <div
                v-for="item in cartStore.cartItems"
                :key="item.id"
                class="flex justify-between text-sm"
              >
                <div>
                  <span class="text-gray-900">Product #{{ item.productId }}</span>
                  <span class="text-gray-500 ml-2">×{{ item.quantity }}</span>
                </div>
                <span class="text-gray-900">${{ (item.unitPrice * item.quantity).toLocaleString() }}</span>
              </div>
            </div>

            <!-- Totals -->
            <div class="space-y-2 border-t border-gray-200 pt-4">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Subtotal</span>
                <span class="text-gray-900">${{ subtotal.toLocaleString() }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Shipping</span>
                <span class="text-gray-900">${{ shipping.toLocaleString() }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Tax</span>
                <span class="text-gray-900">${{ tax.toLocaleString() }}</span>
              </div>
              <div class="flex justify-between font-semibold text-lg border-t border-gray-200 pt-2">
                <span class="text-gray-900">Total</span>
                <span class="text-gray-900">${{ total.toLocaleString() }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>