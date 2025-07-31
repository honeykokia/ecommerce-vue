<script setup>
import { ref, onMounted } from 'vue'
import { useCartStore } from '../stores/cart.js'
import { useProductStore } from '../stores/product.js'
import { useUserStore } from '../stores/user.js'
import { useRouter } from 'vue-router'
import CartItem from '../components/CartItem.vue'
import CartSummary from '../components/CartSummary.vue'

const cartStore = useCartStore()
const productStore = useProductStore()
const userStore = useUserStore()
const router = useRouter()

// Check if user is authenticated
if (!userStore.isAuthenticated) {
  router.push('/login')
}

onMounted(async () => {
  await cartStore.fetchCart()
  if (!productStore.products.length) {
    await productStore.fetchProducts()
  }
})

// Get product details for cart items
function getProductDetails(productId) {
  return productStore.getProductById(productId)
}

// Handle checkout
function handleCheckout() {
  // Redirect to checkout page (to be implemented)
  router.push('/checkout')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">購物車</h1>
        <p class="mt-2 text-gray-600">管理您選購的商品</p>
      </div>

      <!-- Loading state -->
      <div v-if="cartStore.isLoading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span class="ml-3 text-gray-600">載入中...</span>
      </div>

      <!-- Error state -->
      <div v-else-if="cartStore.error" class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
        <div class="flex">
          <i class="fas fa-exclamation-circle mt-0.5 mr-2"></i>
          <span>{{ cartStore.error }}</span>
        </div>
      </div>

      <!-- Empty cart -->
      <div v-else-if="cartStore.isEmpty" class="text-center py-12">
        <div class="mx-auto h-24 w-24 flex items-center justify-center rounded-full bg-gray-100 mb-4">
          <i class="fas fa-shopping-cart text-gray-400 text-3xl"></i>
        </div>
        <h3 class="text-xl font-medium text-gray-900 mb-2">購物車是空的</h3>
        <p class="text-gray-500 mb-6">快去挑選您喜歡的商品吧！</p>
        <RouterLink
          to="/products"
          class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition duration-200"
        >
          <i class="fas fa-shopping-bag mr-2"></i>
          開始購物
        </RouterLink>
      </div>

      <!-- Cart content -->
      <div v-else class="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
        <!-- Cart items -->
        <div class="lg:col-span-7">
          <div class="bg-white rounded-lg shadow-sm border border-gray-200">
            <div class="px-6 py-4 border-b border-gray-200">
              <h2 class="text-lg font-medium text-gray-900">
                商品清單 ({{ cartStore.cartCount }} 件商品)
              </h2>
            </div>
            
            <div class="divide-y divide-gray-200">
              <CartItem
                v-for="item in cartStore.cartItems"
                :key="item.id"
                :item="item"
                :product="getProductDetails(item.productId)"
              />
            </div>
            
            <!-- Cart actions -->
            <div class="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div class="flex justify-between items-center">
                <button
                  @click="cartStore.clearCart"
                  class="text-sm text-red-600 hover:text-red-800 transition duration-200"
                  :disabled="cartStore.isLoading"
                >
                  <i class="fas fa-trash mr-1"></i>
                  清空購物車
                </button>
                
                <RouterLink
                  to="/products"
                  class="text-sm text-blue-600 hover:text-blue-800 transition duration-200"
                >
                  <i class="fas fa-arrow-left mr-1"></i>
                  繼續購物
                </RouterLink>
              </div>
            </div>
          </div>
        </div>

        <!-- Order summary -->
        <div class="mt-8 lg:mt-0 lg:col-span-5">
          <CartSummary @checkout="handleCheckout" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>