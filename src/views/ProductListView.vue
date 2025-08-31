<script setup>
import { onMounted, ref, watch } from 'vue'
import { useProductStore } from '../stores/product.js'
import ProductCard from '../components/ProductCard.vue'
import { useCartStore } from '@/stores/cart.js'

const api = import.meta.env.VITE_API_URL
const productStore = useProductStore()
const cartStore = useCartStore()

const isGridView = ref(true)
const sortBy = ref('name')
const sortOrder = ref('asc')

onMounted(async () => {
  // Load categories and products on component mount
  await Promise.all([productStore.fetchCategories(), productStore.fetchProducts()])
})

// Watch for filter changes and refetch products
watch(
  [() => productStore.selectedCategory, () => productStore.searchQuery],
  async () => {
    const params = {}

    if (productStore.selectedCategory) {
      params.categoryId = productStore.selectedCategory
    }

    if (productStore.searchQuery) {
      params.name = productStore.searchQuery
    }

    await productStore.fetchProducts(params)
  },
  { deep: true },
)

const sortedProducts = ref([])

// Watch for products changes and apply sorting
watch(
  () => productStore.filteredProducts,
  (products) => {
    sortedProducts.value = [...products].sort((a, b) => {
      let aValue = a[sortBy.value]
      let bValue = b[sortBy.value]

      // Handle numeric sorting
      if (sortBy.value === 'price' || sortBy.value === 'rating' || sortBy.value === 'soldCount') {
        aValue = Number(aValue)
        bValue = Number(bValue)
      }

      // Handle string sorting
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }

      if (sortOrder.value === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })
  },
  { immediate: true },
)

const handleSortChange = () => {
  // Sorting is handled by the watcher above
}
const handleAddToCart = async (product) => {
  if (product.inStock <= 0) return

  try {
    await cartStore.addToCart(product.id, 1, product.price)
  } catch (error) {
    // Error handling could be improved with toast notifications
    console.error('Failed to add to cart:', error)
  }
}

const clearFilters = () => {
  productStore.clearFilters()
  sortBy.value = 'name'
  sortOrder.value = 'asc'
}
</script>

<template>
  <div class="container mx-auto px-4 py-6">
    <!-- Page Header -->
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">商品列表</h1>
      <p class="text-gray-600">探索我們精選的商品</p>

      <!-- Demo Notice -->
      <div
        v-if="productStore.useMockData"
        class="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg"
      >
        <div class="flex items-center text-blue-800">
          <i class="fas fa-info-circle mr-2"></i>
          <span class="text-sm">
            <strong>示範模式：</strong>目前顯示模擬資料。連接後端API服務即可載入真實商品資料。
          </span>
        </div>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <!-- Search Input -->
        <div>
          <label for="search" class="block text-sm font-medium text-gray-700 mb-2">
            搜尋商品
          </label>
          <div class="relative">
            <input
              id="search"
              v-model="productStore.searchQuery"
              type="text"
              placeholder="輸入商品名稱或描述..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <i
              class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            ></i>
          </div>
        </div>

        <!-- Category Filter -->
        <div>
          <label for="category" class="block text-sm font-medium text-gray-700 mb-2">
            商品分類
          </label>
          <select
            id="category"
            v-model="productStore.selectedCategory"
            class="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option :value="null">全部分類</option>
            <option
              v-for="category in productStore.categories"
              :key="category.id"
              :value="category.id"
            >
              {{ category.name }}
            </option>
          </select>
        </div>

        <!-- Sort Options -->
        <div>
          <label for="sort" class="block text-sm font-medium text-gray-700 mb-2"> 排序方式 </label>
          <div class="flex space-x-2">
            <select
              id="sort"
              v-model="sortBy"
              @change="handleSortChange"
              class="flex-1 py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="name">名稱</option>
              <option value="price">價格</option>
              <option value="rating">評分</option>
              <option value="soldCount">銷量</option>
            </select>
            <select
              v-model="sortOrder"
              @change="handleSortChange"
              class="py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="asc">升序</option>
              <option value="desc">降序</option>
            </select>
          </div>
        </div>

        <!-- Clear Filters -->
        <div>
          <button
            @click="clearFilters"
            class="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
          >
            <i class="fas fa-times mr-2"></i>
            清除篩選
          </button>
        </div>
      </div>
    </div>

    <!-- View Toggle and Results Count -->
    <div class="flex justify-between items-center mb-6">
      <div class="text-gray-600">
        <span v-if="!productStore.isLoading"> 找到 {{ sortedProducts.length }} 項商品 </span>
        <span v-else> 載入中... </span>
      </div>

      <div class="flex items-center space-x-4">
        <!-- View Toggle -->
        <div class="flex items-center space-x-2">
          <button
            @click="isGridView = true"
            :class="{
              'text-blue-600 bg-blue-50': isGridView,
              'text-gray-600 hover:text-blue-600': !isGridView,
            }"
            class="p-2 rounded-lg transition-colors duration-200"
          >
            <i class="fas fa-th-large"></i>
          </button>
          <button
            @click="isGridView = false"
            :class="{
              'text-blue-600 bg-blue-50': !isGridView,
              'text-gray-600 hover:text-blue-600': isGridView,
            }"
            class="p-2 rounded-lg transition-colors duration-200"
          >
            <i class="fas fa-list"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="productStore.isLoading" class="text-center py-12">
      <i class="fas fa-spinner fa-spin text-3xl text-blue-600 mb-4"></i>
      <p class="text-gray-600">載入商品中...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="productStore.error && !productStore.useMockData" class="text-center py-12">
      <i class="fas fa-exclamation-triangle text-3xl text-red-600 mb-4"></i>
      <p class="text-red-600 mb-4">{{ productStore.error }}</p>
      <button
        @click="productStore.fetchProducts()"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
      >
        重新載入
      </button>
    </div>

    <!-- Empty State -->
    <div v-else-if="sortedProducts.length === 0" class="text-center py-12">
      <i class="fas fa-search text-3xl text-gray-400 mb-4"></i>
      <p class="text-gray-600 mb-4">沒有找到符合條件的商品</p>
      <button
        @click="clearFilters"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
      >
        清除篩選條件
      </button>
    </div>

    <!-- Products Grid/List -->
    <div v-else>
      <!-- Grid View -->
      <div
        v-if="isGridView"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <ProductCard v-for="product in sortedProducts" :key="product.id" :product="product" />
      </div>

      <!-- List View -->
      <div v-else class="space-y-4">
        <div
          v-for="product in sortedProducts"
          :key="product.id"
          class="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div class="flex flex-col md:flex-row gap-6">
            <div class="flex-shrink-0">
              <img
                :src="`${api}${product.imageURL || '/upload/defaultProduct.jpg'}`"
                :alt="product.name"
                class="w-full md:w-48 h-48 object-cover rounded-lg"
              />
            </div>
            <div class="flex-grow">
              <div class="mb-4">
                <h3 class="text-xl font-bold text-gray-900 mb-2">{{ product.name }}</h3>
                <p class="text-gray-600">{{ product.shortDescription }}</p>
              </div>

              <div class="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-600">
                <span class="flex items-center">
                  <i class="fas fa-star text-yellow-400 mr-1"></i>
                  {{ product.rating }}
                </span>
                <span>已售 {{ product.soldCount }}</span>
                <span>庫存 {{ product.inStock }}</span>
              </div>

              <div class="flex items-center justify-between">
                <div class="text-2xl font-bold text-red-600">
                  NT$ {{ product.finalPrice }}
                  <span class="text-gray-500 line-through" v-if="product.originalPrice > product.finalPrice">
                    NT$ {{ product.originalPrice }}
                  </span>
                </div>
                <!-- <ProductCard :product="product" class="w-auto" /> -->
              </div>
            </div>
            <div class="md:py-20 flex justify-center">
              <button
              @click="handleAddToCart(product)"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
              加入購物車
              </button>
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
