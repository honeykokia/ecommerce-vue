<script setup>
import { ref, reactive, onMounted } from 'vue'
import { promotionApi } from '../services/api.js'

// Component state
const isLoading = ref(false)
const promotions = ref([])
const error = ref('')

// Load promotions data
async function loadPromotions() {
  isLoading.value = true
  error.value = ''

  try {
    const response = await promotionApi.getPromotions()
    if (response.data && response.data.promotions) {
      promotions.value = response.data.promotions
    }
  } catch (err) {
    console.error('Failed to load promotions:', err)
    error.value = 'Failed to load promotions. Please try again later.'
  } finally {
    isLoading.value = false
  }
}

// Helper functions
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function formatDiscount(promotion) {
  if (promotion.discountType === 'PERCENTAGE') {
    return `${promotion.discountValue}% OFF`
  } else {
    return `$${promotion.discountValue} OFF`
  }
}

function getDiscountTypeColor(discountType) {
  return discountType === 'PERCENTAGE' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
}

function isPromotionActive(promotion) {
  const now = new Date()
  const startDate = new Date(promotion.startDate)
  const endDate = new Date(promotion.endDate)
  return promotion.isActive && now >= startDate && now <= endDate
}

onMounted(() => {
  loadPromotions()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Current Promotions</h1>
        <p class="mt-2 text-gray-600">Discover our latest deals and special offers</p>
      </div>

      <!-- Loading state -->
      <div v-if="isLoading" class="bg-white rounded-lg shadow-sm p-8 text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">Loading promotions...</p>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="bg-white rounded-lg shadow-sm p-8 text-center">
        <i class="fas fa-exclamation-triangle text-red-500 text-4xl mb-4"></i>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Error Loading Promotions</h3>
        <p class="text-gray-600 mb-4">{{ error }}</p>
        <button
          @click="loadPromotions"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition duration-200"
        >
          <i class="fas fa-redo mr-2"></i>
          Try Again
        </button>
      </div>

      <!-- Empty state -->
      <div
        v-else-if="promotions.length === 0"
        class="bg-white rounded-lg shadow-sm p-8 text-center"
      >
        <i class="fas fa-percentage text-gray-300 text-4xl mb-4"></i>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No Active Promotions</h3>
        <p class="text-gray-600 mb-4">There are currently no active promotions available</p>
        <RouterLink
          to="/products"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition duration-200"
        >
          Browse Products
        </RouterLink>
      </div>

      <!-- Promotions grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="promotion in promotions"
          :key="promotion.id"
          class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition duration-200"
        >
          <!-- Promotion Image -->
          <div class="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600">
            <img
              v-if="promotion.imageUrl"
              :src="promotion.imageUrl"
              :alt="promotion.name"
              class="w-full h-full object-cover"
              @error="$event.target.style.display = 'none'"
            />
            <div class="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
              <div class="text-center text-white">
                <div
                  :class="[
                    'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-2',
                    getDiscountTypeColor(promotion.discountType),
                  ]"
                >
                  {{ formatDiscount(promotion) }}
                </div>
              </div>
            </div>

            <!-- Active status badge -->
            <div class="absolute top-4 right-4">
              <span
                :class="[
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                  isPromotionActive(promotion)
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800',
                ]"
              >
                {{ isPromotionActive(promotion) ? 'Active' : 'Inactive' }}
              </span>
            </div>
          </div>

          <!-- Promotion Content -->
          <div class="p-6">
            <h3 class="text-xl font-bold text-gray-900 mb-2">
              {{ promotion.name }}
            </h3>

            <p class="text-gray-600 mb-4 line-clamp-3">
              {{ promotion.description }}
            </p>

            <!-- Promotion Details -->
            <div class="space-y-2 mb-4">
              <div class="flex items-center text-sm text-gray-500">
                <i class="fas fa-calendar-alt mr-2"></i>
                <span
                  >{{ formatDate(promotion.startDate) }} - {{ formatDate(promotion.endDate) }}</span
                >
              </div>

              <div class="flex items-center text-sm text-gray-500">
                <i class="fas fa-tag mr-2"></i>
                <span>{{
                  promotion.discountType === 'PERCENTAGE'
                    ? 'Percentage Discount'
                    : 'Fixed Amount Discount'
                }}</span>
              </div>
            </div>

            <!-- Action Button -->
            <div class="flex items-center justify-between">
              <div class="text-2xl font-bold text-blue-600">
                {{ formatDiscount(promotion) }}
              </div>

              <RouterLink
                to="/products"
                :class="[
                  'inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg transition duration-200',
                  isPromotionActive(promotion)
                    ? 'text-white bg-blue-600 hover:bg-blue-700'
                    : 'text-gray-500 bg-gray-100 cursor-not-allowed',
                ]"
                :disabled="!isPromotionActive(promotion)"
              >
                <i class="fas fa-shopping-cart mr-2"></i>
                {{ isPromotionActive(promotion) ? 'Shop Now' : 'Expired' }}
              </RouterLink>
            </div>
          </div>
        </div>
      </div>

      <!-- Back to Dashboard -->
      <div class="mt-8 text-center">
        <RouterLink
          to="/dashboard"
          class="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
        >
          <i class="fas fa-arrow-left mr-2"></i>
          Back to Dashboard
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
