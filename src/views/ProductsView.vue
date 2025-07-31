<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useProductStore } from '../stores/product.js'
import { useCartStore } from '../stores/cart.js'
import ProductCard from '../components/ProductCard.vue'
import CategoryFilter from '../components/CategoryFilter.vue'
import ProductSearch from '../components/ProductSearch.vue'

const productStore = useProductStore()
const cartStore = useCartStore()

// Local state
const viewMode = ref('grid') // 'grid' or 'list'
const sortBy = ref('default') // 'default', 'price-asc', 'price-desc', 'rating', 'newest'

onMounted(async () => {
  await Promise.all([
    productStore.fetchProducts(),
    productStore.fetchCategories(),
    cartStore.fetchCart()
  ])
})

// Watch for filter changes
watch([() => productStore.selectedCategory, () => productStore.searchQuery], async () => {
  const params = {}
  if (productStore.selectedCategory) {
    params.categoryId = productStore.selectedCategory
  }
  if (productStore.searchQuery) {
    params.name = productStore.searchQuery
  }
  await productStore.fetchProducts(params)
})

// Computed properties for sorted products
const sortedProducts = computed(() => {
  let products = [...productStore.filteredProducts]
  
  switch (sortBy.value) {
    case 'price-asc':
      return products.sort((a, b) => a.price - b.price)
    case 'price-desc':
      return products.sort((a, b) => b.price - a.price)
    case 'rating':
      return products.sort((a, b) => (b.rating || 0) - (a.rating || 0))
    case 'newest':
      return products.sort((a, b) => b.id - a.id)
    default:
      return products
  }
})

// Methods
function clearFilters() {
  productStore.clearFilters()
  sortBy.value = 'default'
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">商品目錄</h1>
            <p class="mt-2 text-gray-600">探索我們精選的商品</p>
          </div>
          
          <!-- Search -->
          <div class="mt-4 lg:mt-0 lg:ml-6">
            <ProductSearch />
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="lg:grid lg:grid-cols-4 lg:gap-8">
        <!-- Sidebar -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
            <!-- Category Filter -->
            <CategoryFilter />
            
            <!-- Clear filters -->
            <div v-if="productStore.selectedCategory || productStore.searchQuery" class="mt-6 pt-6 border-t border-gray-200">
              <button
                @click="clearFilters"
                class="text-sm text-blue-600 hover:text-blue-800 transition duration-200"
              >
                <i class="fas fa-times mr-1"></i>
                清除所有篩選
              </button>
            </div>
          </div>
        </div>

        <!-- Main content -->
        <div class="mt-8 lg:mt-0 lg:col-span-3">
          <!-- Toolbar -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <!-- Results count -->
              <div class="text-sm text-gray-600">
                <span v-if="productStore.isLoading">載入中...</span>
                <span v-else>
                  顯示 {{ sortedProducts.length }} 項商品
                  <span v-if="productStore.selectedCategory || productStore.searchQuery">
                    (已篩選)
                  </span>
                </span>
              </div>
              
              <!-- View controls -->
              <div class="mt-4 sm:mt-0 flex items-center space-x-4">
                <!-- Sort dropdown -->
                <select
                  v-model="sortBy"
                  class="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="default">預設排序</option>
                  <option value="price-asc">價格：低到高</option>
                  <option value="price-desc">價格：高到低</option>
                  <option value="rating">評分最高</option>
                  <option value="newest">最新商品</option>
                </select>
                
                <!-- View mode toggle -->
                <div class="flex border border-gray-300 rounded-md">
                  <button
                    @click="viewMode = 'grid'"
                    :class="[
                      'px-3 py-2 text-sm',
                      viewMode === 'grid'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-50'
                    ]"
                  >
                    <i class="fas fa-th"></i>
                  </button>
                  <button
                    @click="viewMode = 'list'"
                    :class="[
                      'px-3 py-2 text-sm border-l border-gray-300',
                      viewMode === 'list'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-50'
                    ]"
                  >
                    <i class="fas fa-list"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Loading state -->
          <div v-if="productStore.isLoading" class="flex justify-center items-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span class="ml-3 text-gray-600">載入商品中...</span>
          </div>

          <!-- Error state -->
          <div v-else-if="productStore.error" class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
            <div class="flex">
              <i class="fas fa-exclamation-circle mt-0.5 mr-2"></i>
              <span>{{ productStore.error }}</span>
            </div>
          </div>

          <!-- No products -->
          <div v-else-if="sortedProducts.length === 0" class="text-center py-12">
            <div class="mx-auto h-24 w-24 flex items-center justify-center rounded-full bg-gray-100 mb-4">
              <i class="fas fa-search text-gray-400 text-3xl"></i>
            </div>
            <h3 class="text-xl font-medium text-gray-900 mb-2">找不到商品</h3>
            <p class="text-gray-500 mb-6">請調整您的搜尋條件或瀏覽其他分類</p>
            <button
              @click="clearFilters"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100 transition duration-200"
            >
              清除篩選條件
            </button>
          </div>

          <!-- Products grid -->
          <div v-else>
            <div
              :class="[
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'space-y-4'
              ]"
            >
              <ProductCard
                v-for="product in sortedProducts"
                :key="product.id"
                :product="product"
                :view-mode="viewMode"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>