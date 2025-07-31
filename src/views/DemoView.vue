<script setup>
import { ref, onMounted } from 'vue'
import { useProductStore } from '../stores/product.js'
import { useCartStore } from '../stores/cart.js'
import { mockProducts, mockCategories, mockPromotions, mockCartItems } from '../utils/mockData.js'
import ProductCard from '../components/ProductCard.vue'
import CartItem from '../components/CartItem.vue'
import CartSummary from '../components/CartSummary.vue'

const productStore = useProductStore()
const cartStore = useCartStore()
const activeTab = ref('products')

onMounted(() => {
  // Load mock data
  productStore.setProducts(mockProducts)
  productStore.setCategories(mockCategories)
  productStore.setPromotions(mockPromotions)
  cartStore.setCartItems(mockCartItems)
})

function addToCart(product) {
  const discountedPrice = getDiscountedPrice(product)
  cartStore.addToCart(product.id, 1, discountedPrice)
}

function getDiscountedPrice(product) {
  if (product.promotionId) {
    const promotion = productStore.getPromotionById(product.promotionId)
    if (promotion && promotion.isActive) {
      if (promotion.discountType === 'PERCENTAGE') {
        return product.price * (1 - promotion.discountValue / 100)
      } else if (promotion.discountType === 'FIXED') {
        return Math.max(0, product.price - promotion.discountValue)
      }
    }
  }
  return product.price
}

function getProductDetails(productId) {
  return productStore.getProductById(productId)
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">電商元件展示</h1>
        <p class="text-gray-600 mb-6">Cart 和 Product 元件功能示範</p>
        
        <!-- Tab navigation -->
        <div class="flex space-x-4">
          <button
            @click="activeTab = 'products'"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition duration-200',
              activeTab === 'products' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            ]"
          >
            商品展示
          </button>
          <button
            @click="activeTab = 'cart'"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition duration-200',
              activeTab === 'cart' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            ]"
          >
            購物車展示 ({{ cartStore.cartCount }})
          </button>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Products Tab -->
      <div v-if="activeTab === 'products'">
        <div class="mb-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-2">商品卡片元件</h2>
          <p class="text-gray-600">支援格線和清單檢視、折扣計算、庫存狀態</p>
        </div>
        
        <!-- Grid view -->
        <div class="mb-8">
          <h3 class="text-lg font-medium text-gray-900 mb-4">格線檢視</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <ProductCard
              v-for="product in mockProducts.slice(0, 3)"
              :key="product.id"
              :product="product"
              view-mode="grid"
            />
          </div>
        </div>
        
        <!-- List view -->
        <div>
          <h3 class="text-lg font-medium text-gray-900 mb-4">清單檢視</h3>
          <div class="space-y-4">
            <ProductCard
              v-for="product in mockProducts.slice(3, 5)"
              :key="product.id"
              :product="product"
              view-mode="list"
            />
          </div>
        </div>
      </div>

      <!-- Cart Tab -->
      <div v-else>
        <div class="mb-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-2">購物車元件</h2>
          <p class="text-gray-600">購物車項目管理和訂單摘要</p>
        </div>
        
        <div class="lg:grid lg:grid-cols-12 lg:gap-8">
          <!-- Cart items -->
          <div class="lg:col-span-7">
            <div class="bg-white rounded-lg shadow-sm border border-gray-200">
              <div class="px-6 py-4 border-b border-gray-200">
                <h3 class="text-lg font-medium text-gray-900">
                  購物車項目 ({{ cartStore.cartCount }} 件商品)
                </h3>
              </div>
              
              <div class="divide-y divide-gray-200">
                <CartItem
                  v-for="item in cartStore.cartItems"
                  :key="item.id"
                  :item="item"
                  :product="getProductDetails(item.productId)"
                />
              </div>
            </div>
          </div>
          
          <!-- Cart summary -->
          <div class="mt-8 lg:mt-0 lg:col-span-5">
            <CartSummary />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>