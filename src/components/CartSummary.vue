<script setup>
import { computed } from 'vue'
import { useCartStore } from '../stores/cart.js'

const emit = defineEmits(['checkout'])
const cartStore = useCartStore()

// Computed properties
const subtotal = computed(() => cartStore.cartTotal)
const shipping = computed(() => subtotal.value >= 1000 ? 0 : 100) // Free shipping over $1000
const tax = computed(() => Math.round(subtotal.value * 0.05)) // 5% tax
const total = computed(() => subtotal.value + shipping.value + tax.value)

// Methods
function formatPrice(price) {
  return new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency: 'TWD',
    minimumFractionDigits: 0
  }).format(price)
}

function handleCheckout() {
  emit('checkout')
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-6">
    <div class="px-6 py-4 border-b border-gray-200">
      <h2 class="text-lg font-medium text-gray-900">訂單摘要</h2>
    </div>
    
    <div class="px-6 py-4 space-y-4">
      <!-- Subtotal -->
      <div class="flex justify-between text-sm">
        <span class="text-gray-600">商品小計</span>
        <span class="text-gray-900">{{ formatPrice(subtotal) }}</span>
      </div>
      
      <!-- Shipping -->
      <div class="flex justify-between text-sm">
        <div class="flex items-center">
          <span class="text-gray-600">運費</span>
          <i v-if="shipping === 0" class="fas fa-info-circle ml-1 text-green-500 text-xs" title="滿$1000免運費"></i>
        </div>
        <span :class="shipping === 0 ? 'text-green-600' : 'text-gray-900'">
          {{ shipping === 0 ? '免費' : formatPrice(shipping) }}
        </span>
      </div>
      
      <!-- Free shipping progress -->
      <div v-if="shipping > 0" class="bg-gray-100 rounded-lg p-3">
        <div class="flex items-center text-sm text-gray-600 mb-2">
          <i class="fas fa-truck mr-2 text-green-500"></i>
          <span>再購買 {{ formatPrice(1000 - subtotal) }} 即可享免運費</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div 
            class="bg-green-500 h-2 rounded-full transition-all duration-500"
            :style="{ width: `${Math.min((subtotal / 1000) * 100, 100)}%` }"
          ></div>
        </div>
      </div>
      
      <!-- Tax -->
      <div class="flex justify-between text-sm">
        <span class="text-gray-600">稅金 (5%)</span>
        <span class="text-gray-900">{{ formatPrice(tax) }}</span>
      </div>
      
      <!-- Divider -->
      <div class="border-t border-gray-200"></div>
      
      <!-- Total -->
      <div class="flex justify-between">
        <span class="text-base font-medium text-gray-900">總計</span>
        <span class="text-xl font-bold text-gray-900">{{ formatPrice(total) }}</span>
      </div>
    </div>
    
    <!-- Checkout button -->
    <div class="px-6 py-4 border-t border-gray-200">
      <button
        @click="handleCheckout"
        :disabled="cartStore.isEmpty || cartStore.isLoading"
        class="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition duration-200"
      >
        <i class="fas fa-credit-card mr-2"></i>
        {{ cartStore.isLoading ? '處理中...' : '前往結帳' }}
      </button>
      
      <!-- Additional info -->
      <p class="mt-3 text-xs text-gray-500 text-center">
        <i class="fas fa-shield-alt mr-1"></i>
        安全結帳，資料加密保護
      </p>
    </div>
    
    <!-- Promotions/Coupons section -->
    <div class="px-6 py-4 border-t border-gray-200 bg-gray-50">
      <div class="flex items-center justify-between">
        <span class="text-sm text-gray-600">
          <i class="fas fa-ticket-alt mr-2 text-orange-500"></i>
          優惠券
        </span>
        <button class="text-sm text-blue-600 hover:text-blue-800 transition duration-200">
          輸入優惠碼
        </button>
      </div>
    </div>
    
    <!-- Security badges -->
    <div class="px-6 py-3 border-t border-gray-200">
      <div class="flex items-center justify-center space-x-4 text-xs text-gray-500">
        <div class="flex items-center">
          <i class="fas fa-lock mr-1"></i>
          SSL加密
        </div>
        <div class="flex items-center">
          <i class="fas fa-credit-card mr-1"></i>
          安全付款
        </div>
        <div class="flex items-center">
          <i class="fas fa-undo mr-1"></i>
          7天退貨
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>