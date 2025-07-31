<script setup>
import { ref, computed } from 'vue'
import { useCartStore } from '../stores/cart.js'
import { useProductStore } from '../stores/product.js'
import { useRouter } from 'vue-router'

const props = defineProps({
  product: {
    type: Object,
    required: true
  },
  viewMode: {
    type: String,
    default: 'grid' // 'grid' or 'list'
  }
})

const cartStore = useCartStore()
const productStore = useProductStore()
const router = useRouter()

const isAddingToCart = ref(false)

// Computed properties
const discountedPrice = computed(() => {
  if (props.product.promotionId) {
    const promotion = productStore.getPromotionById(props.product.promotionId)
    if (promotion && promotion.isActive) {
      if (promotion.discountType === 'PERCENTAGE') {
        return props.product.price * (1 - promotion.discountValue / 100)
      } else if (promotion.discountType === 'FIXED') {
        return Math.max(0, props.product.price - promotion.discountValue)
      }
    }
  }
  return null
})

const hasDiscount = computed(() => discountedPrice.value !== null)
const finalPrice = computed(() => discountedPrice.value || props.product.price)
const discountPercentage = computed(() => {
  if (hasDiscount.value) {
    return Math.round(((props.product.price - finalPrice.value) / props.product.price) * 100)
  }
  return 0
})

const stockStatus = computed(() => {
  if (props.product.inStock === 0) return 'out-of-stock'
  if (props.product.inStock <= 5) return 'low-stock'
  return 'in-stock'
})

const category = computed(() => {
  return productStore.getCategoryById(props.product.categoryId)
})

// Methods
function formatPrice(price) {
  return new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency: 'TWD',
    minimumFractionDigits: 0
  }).format(price)
}

function formatRating(rating) {
  return rating ? rating.toFixed(1) : '0.0'
}

async function addToCart() {
  if (props.product.inStock === 0) return
  
  isAddingToCart.value = true
  try {
    await cartStore.addToCart(props.product.id, 1, finalPrice.value)
  } finally {
    isAddingToCart.value = false
  }
}

function viewProduct() {
  router.push(`/products/${props.product.id}`)
}

function getStarsArray(rating) {
  const stars = []
  const fullStars = Math.floor(rating || 0)
  const hasHalfStar = (rating || 0) % 1 >= 0.5
  
  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push('full')
    } else if (i === fullStars && hasHalfStar) {
      stars.push('half')
    } else {
      stars.push('empty')
    }
  }
  return stars
}
</script>

<template>
  <!-- Grid view -->
  <div v-if="viewMode === 'grid'" class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 group">
    <!-- Product image -->
    <div class="aspect-w-1 aspect-h-1 bg-gray-200 relative overflow-hidden">
      <img
        :src="product.imageUrl || '/default-product.jpg'"
        :alt="product.name"
        class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200 cursor-pointer"
        @click="viewProduct"
        @error="$event.target.src = '/default-product.jpg'"
      />
      
      <!-- Discount badge -->
      <div v-if="hasDiscount" class="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
        -{{ discountPercentage }}%
      </div>
      
      <!-- Stock status -->
      <div v-if="stockStatus === 'out-of-stock'" class="absolute top-2 right-2 bg-gray-800 text-white px-2 py-1 rounded-full text-xs">
        缺貨
      </div>
      <div v-else-if="stockStatus === 'low-stock'" class="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded-full text-xs">
        庫存不足
      </div>
    </div>
    
    <!-- Product info -->
    <div class="p-4">
      <!-- Category -->
      <p v-if="category" class="text-xs text-gray-500 mb-1">{{ category.name }}</p>
      
      <!-- Product name -->
      <h3 class="text-sm font-medium text-gray-900 mb-2 line-clamp-2 cursor-pointer hover:text-blue-600 transition-colors" @click="viewProduct">
        {{ product.name }}
      </h3>
      
      <!-- Description -->
      <p class="text-xs text-gray-600 mb-3 line-clamp-2">{{ product.shortDescription }}</p>
      
      <!-- Rating -->
      <div class="flex items-center mb-3">
        <div class="flex items-center">
          <span v-for="(star, index) in getStarsArray(product.rating)" :key="index" class="text-xs">
            <i v-if="star === 'full'" class="fas fa-star text-yellow-400"></i>
            <i v-else-if="star === 'half'" class="fas fa-star-half-alt text-yellow-400"></i>
            <i v-else class="far fa-star text-gray-300"></i>
          </span>
        </div>
        <span class="ml-1 text-xs text-gray-600">({{ formatRating(product.rating) }})</span>
        <span class="ml-2 text-xs text-gray-500">已售 {{ product.soldCount || 0 }}</span>
      </div>
      
      <!-- Price -->
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center space-x-2">
          <span class="text-lg font-bold text-gray-900">{{ formatPrice(finalPrice) }}</span>
          <span v-if="hasDiscount" class="text-sm text-gray-500 line-through">{{ formatPrice(product.price) }}</span>
        </div>
      </div>
      
      <!-- Tags -->
      <div v-if="product.tags && product.tags.length" class="mb-3">
        <div class="flex flex-wrap gap-1">
          <span v-for="tag in product.tags.slice(0, 2)" :key="tag.id" class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
            {{ tag.name }}
          </span>
        </div>
      </div>
      
      <!-- Add to cart button -->
      <button
        @click="addToCart"
        :disabled="stockStatus === 'out-of-stock' || isAddingToCart"
        :class="[
          'w-full py-2 px-4 rounded-md text-sm font-medium transition duration-200',
          stockStatus === 'out-of-stock'
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
        ]"
      >
        <span v-if="isAddingToCart" class="flex items-center justify-center">
          <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          加入中...
        </span>
        <span v-else-if="stockStatus === 'out-of-stock'">
          <i class="fas fa-times mr-1"></i>
          缺貨
        </span>
        <span v-else>
          <i class="fas fa-cart-plus mr-1"></i>
          加入購物車
        </span>
      </button>
    </div>
  </div>

  <!-- List view -->
  <div v-else class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
    <div class="flex">
      <!-- Product image -->
      <div class="flex-shrink-0 w-32 h-32 bg-gray-200 relative overflow-hidden">
        <img
          :src="product.imageUrl || '/default-product.jpg'"
          :alt="product.name"
          class="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-200"
          @click="viewProduct"
          @error="$event.target.src = '/default-product.jpg'"
        />
        
        <!-- Discount badge -->
        <div v-if="hasDiscount" class="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
          -{{ discountPercentage }}%
        </div>
      </div>
      
      <!-- Product info -->
      <div class="flex-1 p-4 flex justify-between">
        <div class="flex-1">
          <!-- Category -->
          <p v-if="category" class="text-xs text-gray-500 mb-1">{{ category.name }}</p>
          
          <!-- Product name -->
          <h3 class="text-lg font-medium text-gray-900 mb-2 cursor-pointer hover:text-blue-600 transition-colors" @click="viewProduct">
            {{ product.name }}
          </h3>
          
          <!-- Description -->
          <p class="text-sm text-gray-600 mb-2 line-clamp-2">{{ product.shortDescription }}</p>
          
          <!-- Rating and sales -->
          <div class="flex items-center mb-2">
            <div class="flex items-center">
              <span v-for="(star, index) in getStarsArray(product.rating)" :key="index" class="text-sm">
                <i v-if="star === 'full'" class="fas fa-star text-yellow-400"></i>
                <i v-else-if="star === 'half'" class="fas fa-star-half-alt text-yellow-400"></i>
                <i v-else class="far fa-star text-gray-300"></i>
              </span>
            </div>
            <span class="ml-2 text-sm text-gray-600">({{ formatRating(product.rating) }})</span>
            <span class="ml-4 text-sm text-gray-500">已售 {{ product.soldCount || 0 }}</span>
          </div>
          
          <!-- Tags -->
          <div v-if="product.tags && product.tags.length" class="flex flex-wrap gap-1">
            <span v-for="tag in product.tags.slice(0, 3)" :key="tag.id" class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              {{ tag.name }}
            </span>
          </div>
        </div>
        
        <!-- Price and actions -->
        <div class="flex flex-col items-end justify-between ml-4">
          <!-- Stock status -->
          <div class="text-right mb-2">
            <span v-if="stockStatus === 'out-of-stock'" class="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
              缺貨
            </span>
            <span v-else-if="stockStatus === 'low-stock'" class="inline-block bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
              庫存不足
            </span>
            <span v-else class="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
              有庫存
            </span>
          </div>
          
          <!-- Price -->
          <div class="text-right mb-4">
            <div class="text-xl font-bold text-gray-900">{{ formatPrice(finalPrice) }}</div>
            <div v-if="hasDiscount" class="text-sm text-gray-500 line-through">{{ formatPrice(product.price) }}</div>
          </div>
          
          <!-- Add to cart button -->
          <button
            @click="addToCart"
            :disabled="stockStatus === 'out-of-stock' || isAddingToCart"
            :class="[
              'py-2 px-4 rounded-md text-sm font-medium transition duration-200',
              stockStatus === 'out-of-stock'
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            ]"
          >
            <span v-if="isAddingToCart">
              <i class="fas fa-spinner fa-spin mr-1"></i>
              加入中...
            </span>
            <span v-else-if="stockStatus === 'out-of-stock'">
              <i class="fas fa-times mr-1"></i>
              缺貨
            </span>
            <span v-else>
              <i class="fas fa-cart-plus mr-1"></i>
              加入購物車
            </span>
          </button>
        </div>
      </div>
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

.aspect-w-1 {
  position: relative;
  padding-bottom: 100%;
}

.aspect-h-1 {
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
</style>