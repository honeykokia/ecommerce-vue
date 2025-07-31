<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductStore } from '../stores/product.js'
import { useCartStore } from '../stores/cart.js'
import { useUserStore } from '../stores/user.js'

const route = useRoute()
const router = useRouter()
const productStore = useProductStore()
const cartStore = useCartStore()
const userStore = useUserStore()

const quantity = ref(1)
const selectedImageIndex = ref(0)
const isAddingToCart = ref(false)

const productId = computed(() => parseInt(route.params.id))

onMounted(async () => {
  await productStore.fetchProduct(productId.value)
  if (!productStore.categories.length) {
    await productStore.fetchCategories()
  }
})

// Computed properties
const product = computed(() => productStore.currentProduct)

const discountedPrice = computed(() => {
  if (!product.value || !product.value.promotionId) return null
  
  const promotion = productStore.getPromotionById(product.value.promotionId)
  if (promotion && promotion.isActive) {
    if (promotion.discountType === 'PERCENTAGE') {
      return product.value.price * (1 - promotion.discountValue / 100)
    } else if (promotion.discountType === 'FIXED') {
      return Math.max(0, product.value.price - promotion.discountValue)
    }
  }
  return null
})

const hasDiscount = computed(() => discountedPrice.value !== null)
const finalPrice = computed(() => discountedPrice.value || product.value?.price || 0)
const discountPercentage = computed(() => {
  if (hasDiscount.value && product.value) {
    return Math.round(((product.value.price - finalPrice.value) / product.value.price) * 100)
  }
  return 0
})

const totalPrice = computed(() => finalPrice.value * quantity.value)

const stockStatus = computed(() => {
  if (!product.value) return 'loading'
  if (product.value.inStock === 0) return 'out-of-stock'
  if (product.value.inStock <= 5) return 'low-stock'
  return 'in-stock'
})

const category = computed(() => {
  if (!product.value) return null
  return productStore.getCategoryById(product.value.categoryId)
})

const promotion = computed(() => {
  if (!product.value || !product.value.promotionId) return null
  return productStore.getPromotionById(product.value.promotionId)
})

// Mock images array - in real app this would come from product data
const productImages = computed(() => {
  if (!product.value) return []
  return [
    product.value.imageUrl || '/default-product.jpg',
    // Add more images if available in the future
  ]
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

function incrementQuantity() {
  if (product.value && quantity.value < product.value.inStock) {
    quantity.value++
  }
}

function decrementQuantity() {
  if (quantity.value > 1) {
    quantity.value--
  }
}

async function addToCart() {
  if (!product.value || stockStatus.value === 'out-of-stock') return
  
  if (!userStore.isAuthenticated) {
    router.push('/login')
    return
  }
  
  isAddingToCart.value = true
  try {
    await cartStore.addToCart(product.value.id, quantity.value, finalPrice.value)
    // Show success message or redirect to cart
    alert('商品已加入購物車！')
  } finally {
    isAddingToCart.value = false
  }
}

function buyNow() {
  if (!userStore.isAuthenticated) {
    router.push('/login')
    return
  }
  
  // Add to cart and redirect to checkout
  addToCart().then(() => {
    router.push('/cart')
  })
}

function goBack() {
  router.back()
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Loading state -->
    <div v-if="productStore.isLoading" class="flex justify-center items-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <span class="ml-3 text-gray-600">載入商品資訊中...</span>
    </div>

    <!-- Error state -->
    <div v-else-if="productStore.error" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
        <div class="flex">
          <i class="fas fa-exclamation-circle mt-0.5 mr-2"></i>
          <span>{{ productStore.error }}</span>
        </div>
      </div>
    </div>

    <!-- Product not found -->
    <div v-else-if="!product" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      <div class="mx-auto h-24 w-24 flex items-center justify-center rounded-full bg-gray-100 mb-4">
        <i class="fas fa-search text-gray-400 text-3xl"></i>
      </div>
      <h3 class="text-xl font-medium text-gray-900 mb-2">找不到商品</h3>
      <p class="text-gray-500 mb-6">您要查看的商品不存在或已下架</p>
      <button
        @click="goBack"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100 transition duration-200"
      >
        <i class="fas fa-arrow-left mr-2"></i>
        返回
      </button>
    </div>

    <!-- Product detail -->
    <div v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Breadcrumb -->
      <nav class="flex mb-8" aria-label="Breadcrumb">
        <ol class="flex items-center space-x-4">
          <li>
            <RouterLink to="/products" class="text-gray-500 hover:text-gray-700 transition duration-200">
              <i class="fas fa-home mr-1"></i>
              商品
            </RouterLink>
          </li>
          <li v-if="category">
            <div class="flex items-center">
              <i class="fas fa-chevron-right text-gray-400 mx-2"></i>
              <span class="text-gray-500">{{ category.name }}</span>
            </div>
          </li>
          <li>
            <div class="flex items-center">
              <i class="fas fa-chevron-right text-gray-400 mx-2"></i>
              <span class="text-gray-900 font-medium">{{ product.name }}</span>
            </div>
          </li>
        </ol>
      </nav>

      <!-- Product content -->
      <div class="lg:grid lg:grid-cols-2 lg:gap-12">
        <!-- Product images -->
        <div class="mb-8 lg:mb-0">
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <!-- Main image -->
            <div class="aspect-w-1 aspect-h-1 bg-gray-200">
              <img
                :src="productImages[selectedImageIndex]"
                :alt="product.name"
                class="w-full h-96 object-cover"
                @error="$event.target.src = '/default-product.jpg'"
              />
              
              <!-- Discount badge -->
              <div v-if="hasDiscount" class="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                -{{ discountPercentage }}%
              </div>
            </div>
            
            <!-- Image thumbnails (if multiple images) -->
            <div v-if="productImages.length > 1" class="p-4 flex space-x-2">
              <button
                v-for="(image, index) in productImages"
                :key="index"
                @click="selectedImageIndex = index"
                :class="[
                  'flex-shrink-0 w-16 h-16 border-2 rounded-lg overflow-hidden',
                  selectedImageIndex === index ? 'border-blue-500' : 'border-gray-200'
                ]"
              >
                <img
                  :src="image"
                  :alt="`${product.name} ${index + 1}`"
                  class="w-full h-full object-cover"
                />
              </button>
            </div>
          </div>
        </div>

        <!-- Product info -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <!-- Category -->
          <p v-if="category" class="text-sm text-blue-600 mb-2">{{ category.name }}</p>
          
          <!-- Product name -->
          <h1 class="text-3xl font-bold text-gray-900 mb-4">{{ product.name }}</h1>
          
          <!-- Rating and sales -->
          <div class="flex items-center mb-6">
            <div class="flex items-center">
              <span v-for="(star, index) in getStarsArray(product.rating)" :key="index">
                <i v-if="star === 'full'" class="fas fa-star text-yellow-400"></i>
                <i v-else-if="star === 'half'" class="fas fa-star-half-alt text-yellow-400"></i>
                <i v-else class="far fa-star text-gray-300"></i>
              </span>
            </div>
            <span class="ml-2 text-sm text-gray-600">({{ formatRating(product.rating) }})</span>
            <span class="ml-4 text-sm text-gray-500">已售 {{ product.soldCount || 0 }} 件</span>
          </div>
          
          <!-- Price -->
          <div class="mb-6">
            <div class="flex items-center space-x-3">
              <span class="text-3xl font-bold text-red-600">{{ formatPrice(finalPrice) }}</span>
              <span v-if="hasDiscount" class="text-xl text-gray-500 line-through">{{ formatPrice(product.price) }}</span>
            </div>
            <p v-if="hasDiscount && promotion" class="text-sm text-red-600 mt-1">
              <i class="fas fa-tag mr-1"></i>
              {{ promotion.name }} (省 {{ formatPrice(product.price - finalPrice) }})
            </p>
          </div>
          
          <!-- Stock status -->
          <div class="mb-6">
            <div v-if="stockStatus === 'out-of-stock'" class="flex items-center text-red-600">
              <i class="fas fa-times-circle mr-2"></i>
              <span class="font-medium">缺貨</span>
            </div>
            <div v-else-if="stockStatus === 'low-stock'" class="flex items-center text-orange-600">
              <i class="fas fa-exclamation-triangle mr-2"></i>
              <span class="font-medium">庫存不足 (剩餘 {{ product.inStock }} 件)</span>
            </div>
            <div v-else class="flex items-center text-green-600">
              <i class="fas fa-check-circle mr-2"></i>
              <span class="font-medium">有庫存 ({{ product.inStock }} 件)</span>
            </div>
          </div>
          
          <!-- Description -->
          <div class="mb-6">
            <h3 class="text-lg font-medium text-gray-900 mb-2">商品描述</h3>
            <p class="text-gray-600">{{ product.shortDescription }}</p>
          </div>
          
          <!-- Tags -->
          <div v-if="product.tags && product.tags.length" class="mb-6">
            <h3 class="text-lg font-medium text-gray-900 mb-2">商品標籤</h3>
            <div class="flex flex-wrap gap-2">
              <span v-for="tag in product.tags" :key="tag.id" class="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                {{ tag.name }}
              </span>
            </div>
          </div>
          
          <!-- Quantity selector -->
          <div v-if="stockStatus !== 'out-of-stock'" class="mb-6">
            <h3 class="text-lg font-medium text-gray-900 mb-2">數量</h3>
            <div class="flex items-center space-x-4">
              <div class="flex items-center border border-gray-300 rounded-lg">
                <button
                  @click="decrementQuantity"
                  :disabled="quantity <= 1"
                  class="px-3 py-2 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
                >
                  <i class="fas fa-minus"></i>
                </button>
                <input
                  v-model.number="quantity"
                  type="number"
                  min="1"
                  :max="product.inStock"
                  class="w-20 px-3 py-2 text-center border-l border-r border-gray-300 focus:outline-none"
                />
                <button
                  @click="incrementQuantity"
                  :disabled="quantity >= product.inStock"
                  class="px-3 py-2 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
                >
                  <i class="fas fa-plus"></i>
                </button>
              </div>
              <span class="text-gray-600">小計: {{ formatPrice(totalPrice) }}</span>
            </div>
          </div>
          
          <!-- Action buttons -->
          <div class="space-y-4">
            <button
              @click="addToCart"
              :disabled="stockStatus === 'out-of-stock' || isAddingToCart"
              class="w-full bg-orange-500 text-white py-3 px-6 rounded-lg text-lg font-medium hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition duration-200"
            >
              <span v-if="isAddingToCart">
                <i class="fas fa-spinner fa-spin mr-2"></i>
                加入中...
              </span>
              <span v-else-if="stockStatus === 'out-of-stock'">
                <i class="fas fa-times mr-2"></i>
                缺貨
              </span>
              <span v-else>
                <i class="fas fa-cart-plus mr-2"></i>
                加入購物車
              </span>
            </button>
            
            <button
              @click="buyNow"
              :disabled="stockStatus === 'out-of-stock' || isAddingToCart"
              class="w-full bg-red-600 text-white py-3 px-6 rounded-lg text-lg font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition duration-200"
            >
              <span v-if="stockStatus === 'out-of-stock'">
                <i class="fas fa-times mr-2"></i>
                缺貨
              </span>
              <span v-else>
                <i class="fas fa-bolt mr-2"></i>
                立即購買
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
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