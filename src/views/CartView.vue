<script setup>
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart.js'
import { useProductStore } from '../stores/product.js'
import { useUserStore } from '../stores/user.js'
import CartItem from '../components/CartItem.vue'

const router = useRouter()
const cartStore = useCartStore()
const productStore = useProductStore()
const userStore = useUserStore()

onMounted(async () => {
  // Check if user is authenticated
  if (!userStore.isAuthenticated) {
    router.push('/login')
    return
  }

  // Load cart and product data
  await Promise.all([
    cartStore.fetchCart(),
    productStore.fetchProducts()
  ])
})

const formatPrice = (price) => {
  return new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency: 'TWD',
    minimumFractionDigits: 0
  }).format(price)
}

const shippingFee = computed(() => {
  // Free shipping for orders over NT$1000, otherwise NT$60
  return cartStore.cartTotal >= 1000 ? 0 : 60
})

const finalTotal = computed(() => {
  return cartStore.cartTotal + shippingFee.value
})

const clearCart = async () => {
  if (window.confirm('確定要清空購物車嗎？')) {
    try {
      await cartStore.clearCart()
    } catch (error) {
      console.error('Failed to clear cart:', error)
    }
  }
}

const proceedToCheckout = () => {
  // Navigate to checkout page (to be implemented)
  // For now, just show an alert
  alert('結帳功能開發中...')
}

const goToProducts = () => {
  router.push('/products')
}
</script>

<template>
  <div class="container mx-auto px-4 py-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">購物車</h1>
        <p class="text-gray-600">檢視和管理您的購物車商品</p>
      </div>
      
      <!-- Continue Shopping Button -->
      <button
        @click="goToProducts"
        class="hidden md:flex items-center px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200"
      >
        <i class="fas fa-arrow-left mr-2"></i>
        繼續購物
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="cartStore.isLoading" class="text-center py-12">
      <i class="fas fa-spinner fa-spin text-3xl text-blue-600 mb-4"></i>
      <p class="text-gray-600">載入購物車中...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="cartStore.error" class="text-center py-12">
      <i class="fas fa-exclamation-triangle text-3xl text-red-600 mb-4"></i>
      <p class="text-red-600 mb-4">{{ cartStore.error }}</p>
      <button
        @click="cartStore.fetchCart()"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
      >
        重新載入
      </button>
    </div>

    <!-- Empty Cart -->
    <div v-else-if="cartStore.isCartEmpty" class="text-center py-12">
      <i class="fas fa-shopping-cart text-6xl text-gray-300 mb-6"></i>
      <h2 class="text-2xl font-semibold text-gray-700 mb-4">您的購物車是空的</h2>
      <p class="text-gray-600 mb-6">快去逛逛我們的商品吧！</p>
      <button
        @click="goToProducts"
        class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
      >
        <i class="fas fa-shopping-bag mr-2"></i>
        去購物
      </button>
    </div>

    <!-- Cart with Items -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Cart Items -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-semibold text-gray-900">
              購物車商品 ({{ cartStore.cartCount }} 件)
            </h2>
            
            <button
              @click="clearCart"
              :disabled="cartStore.isLoading"
              class="text-red-600 hover:text-red-800 text-sm font-medium disabled:text-red-400 disabled:cursor-not-allowed"
            >
              <i class="fas fa-trash-alt mr-1"></i>
              清空購物車
            </button>
          </div>

          <!-- Cart Items List -->
          <div class="space-y-4">
            <CartItem 
              v-for="item in cartStore.cartItems" 
              :key="item.id || `${item.productId}-${item.createAt}`"
              :cart-item="item"
            />
          </div>
        </div>

        <!-- Mobile Continue Shopping Button -->
        <button
          @click="goToProducts"
          class="md:hidden w-full flex items-center justify-center px-4 py-3 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200 mb-6"
        >
          <i class="fas fa-arrow-left mr-2"></i>
          繼續購物
        </button>
      </div>

      <!-- Order Summary -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">訂單摘要</h3>
          
          <!-- Price Breakdown -->
          <div class="space-y-3 mb-6">
            <div class="flex justify-between text-gray-600">
              <span>小計 ({{ cartStore.cartCount }} 件商品)</span>
              <span>{{ formatPrice(cartStore.cartTotal) }}</span>
            </div>
            
            <div class="flex justify-between text-gray-600">
              <span>運費</span>
              <span>
                <span v-if="shippingFee === 0" class="text-green-600">免費</span>
                <span v-else>{{ formatPrice(shippingFee) }}</span>
              </span>
            </div>
            
            <div v-if="cartStore.cartTotal < 1000 && cartStore.cartTotal > 0" class="text-sm text-blue-600">
              <i class="fas fa-info-circle mr-1"></i>
              再購買 {{ formatPrice(1000 - cartStore.cartTotal) }} 即可享免運費
            </div>
            
            <hr class="border-gray-200">
            
            <div class="flex justify-between text-lg font-semibold text-gray-900">
              <span>總計</span>
              <span>{{ formatPrice(finalTotal) }}</span>
            </div>
          </div>

          <!-- Checkout Button -->
          <button
            @click="proceedToCheckout"
            :disabled="cartStore.isCartEmpty || cartStore.isLoading"
            class="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <span v-if="cartStore.isLoading">
              <i class="fas fa-spinner fa-spin mr-2"></i>
              處理中...
            </span>
            <span v-else>
              <i class="fas fa-credit-card mr-2"></i>
              前往結帳
            </span>
          </button>

          <!-- Security Notice -->
          <div class="mt-4 text-xs text-gray-500 text-center">
            <i class="fas fa-lock mr-1"></i>
            安全加密結帳
          </div>

          <!-- Promotion Banner -->
          <div class="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
            <div class="text-center">
              <i class="fas fa-gift text-blue-600 text-xl mb-2"></i>
              <h4 class="font-medium text-gray-900 mb-1">會員專屬優惠</h4>
              <p class="text-sm text-gray-600">滿千免運，滿三千享9折優惠</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Additional styles if needed */
</style>