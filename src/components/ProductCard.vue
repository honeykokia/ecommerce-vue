<script setup>
import { computed } from 'vue'
import { useCartStore } from '../stores/cart.js'
import { useProductStore } from '../stores/product.js'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const cartStore = useCartStore()
const productStore = useProductStore()

const category = computed(() => 
  productStore.getCategoryById(props.product.categoryId)
)

const isInStock = computed(() => props.product.inStock > 0)

const discountedPrice = computed(() => {
  // If there's a promotion, calculate discounted price
  // For now, just return the regular price
  return props.product.price
})

const handleAddToCart = async () => {
  if (!isInStock.value) return
  
  try {
    await cartStore.addToCart(
      props.product.id,
      1,
      props.product.price
    )
  } catch (error) {
    // Error handling could be improved with toast notifications
    console.error('Failed to add to cart:', error)
  }
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency: 'TWD',
    minimumFractionDigits: 0
  }).format(price)
}

const getStockStatus = () => {
  if (props.product.inStock > 10) return 'in-stock'
  if (props.product.inStock > 0) return 'low-stock'
  return 'out-of-stock'
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
    <!-- Product Image -->
    <div class="relative aspect-square overflow-hidden">
      <img 
        :src="product.imageUrl || '/upload/defaultProduct.jpg'" 
        :alt="product.name"
        class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
      />
      
      <!-- Out of stock overlay -->
      <div 
        v-if="!isInStock" 
        class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <span class="text-white font-semibold text-lg">缺貨</span>
      </div>
      
      <!-- Tags -->
      <div 
        v-if="product.tags && product.tags.length > 0" 
        class="absolute top-2 left-2 space-y-1"
      >
        <span 
          v-for="tag in product.tags.slice(0, 2)" 
          :key="tag.id"
          class="inline-block bg-red-500 text-white text-xs px-2 py-1 rounded-full"
        >
          {{ tag.name }}
        </span>
      </div>
    </div>

    <!-- Product Info -->
    <div class="p-4">
      <!-- Category -->
      <div v-if="category" class="text-sm text-gray-500 mb-1">
        {{ category.name }}
      </div>
      
      <!-- Product Name -->
      <h3 class="font-semibold text-gray-900 mb-2 line-clamp-2 h-12">
        {{ product.name }}
      </h3>
      
      <!-- Short Description -->
      <p class="text-gray-600 text-sm mb-3 line-clamp-2 h-10">
        {{ product.shortDescription }}
      </p>
      
      <!-- Rating and Sold Count -->
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center space-x-1">
          <div class="flex items-center">
            <i class="fas fa-star text-yellow-400 text-sm"></i>
            <span class="text-sm text-gray-600 ml-1">{{ product.rating }}</span>
          </div>
        </div>
        <div class="text-sm text-gray-500">
          已售 {{ product.soldCount }}
        </div>
      </div>
      
      <!-- Price -->
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center space-x-2">
          <span class="text-xl font-bold text-red-600">
            {{ formatPrice(discountedPrice) }}
          </span>
          <!-- Original price if discounted -->
          <span 
            v-if="discountedPrice < product.price" 
            class="text-sm text-gray-500 line-through"
          >
            {{ formatPrice(product.price) }}
          </span>
        </div>
      </div>

      <!-- Stock Status -->
      <div class="mb-4">
        <div 
          class="text-xs px-2 py-1 rounded-full inline-block"
          :class="{
            'bg-green-100 text-green-800': getStockStatus() === 'in-stock',
            'bg-yellow-100 text-yellow-800': getStockStatus() === 'low-stock',
            'bg-red-100 text-red-800': getStockStatus() === 'out-of-stock'
          }"
        >
          <span v-if="getStockStatus() === 'in-stock'">現貨充足</span>
          <span v-else-if="getStockStatus() === 'low-stock'">僅剩 {{ product.inStock }} 件</span>
          <span v-else>缺貨</span>
        </div>
      </div>
      
      <!-- Add to Cart Button -->
      <button
        @click="handleAddToCart"
        :disabled="!isInStock || cartStore.isLoading"
        class="w-full py-2 px-4 rounded-lg font-medium transition-colors duration-200"
        :class="{
          'bg-blue-600 hover:bg-blue-700 text-white': isInStock && !cartStore.isLoading,
          'bg-gray-300 text-gray-500 cursor-not-allowed': !isInStock || cartStore.isLoading
        }"
      >
        <span v-if="cartStore.isLoading">
          <i class="fas fa-spinner fa-spin mr-2"></i>
          加入中...
        </span>
        <span v-else-if="!isInStock">
          缺貨
        </span>
        <span v-else>
          <i class="fas fa-shopping-cart mr-2"></i>
          加入購物車
        </span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>