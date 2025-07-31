<script setup>
import { ref, watch } from 'vue'
import { useProductStore } from '../stores/product.js'

const productStore = useProductStore()
const searchInput = ref(productStore.searchQuery)
const isSearching = ref(false)

// Watch for search input changes with debounce
let searchTimeout = null
watch(searchInput, (newValue) => {
  clearTimeout(searchTimeout)
  isSearching.value = true
  
  searchTimeout = setTimeout(async () => {
    productStore.setSearchQuery(newValue)
    
    // Fetch products with search params
    const params = {}
    if (newValue) {
      params.name = newValue
    }
    if (productStore.selectedCategory) {
      params.categoryId = productStore.selectedCategory
    }
    
    await productStore.fetchProducts(params)
    isSearching.value = false
  }, 500) // 500ms debounce
})

function clearSearch() {
  searchInput.value = ''
  productStore.setSearchQuery('')
}

function handleSubmit() {
  // Immediate search on form submit
  clearTimeout(searchTimeout)
  isSearching.value = true
  
  const params = {}
  if (searchInput.value) {
    params.name = searchInput.value
  }
  if (productStore.selectedCategory) {
    params.categoryId = productStore.selectedCategory
  }
  
  productStore.fetchProducts(params).finally(() => {
    isSearching.value = false
  })
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="relative">
    <div class="flex items-center">
      <!-- Search input -->
      <div class="relative flex-1">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <i class="fas fa-search text-gray-400"></i>
        </div>
        <input
          v-model="searchInput"
          type="text"
          placeholder="搜尋商品名稱..."
          class="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
        />
        
        <!-- Loading indicator -->
        <div v-if="isSearching" class="absolute inset-y-0 right-0 pr-3 flex items-center">
          <svg class="animate-spin h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        
        <!-- Clear button -->
        <button
          v-else-if="searchInput"
          @click="clearSearch"
          type="button"
          class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition duration-200"
        >
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <!-- Search button -->
      <button
        type="submit"
        :disabled="isSearching"
        class="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition duration-200"
      >
        <i v-if="isSearching" class="fas fa-spinner fa-spin mr-1"></i>
        <i v-else class="fas fa-search mr-1"></i>
        {{ isSearching ? '搜尋中' : '搜尋' }}
      </button>
    </div>
    
    <!-- Search suggestions or recent searches could go here -->
    <div v-if="searchInput && !isSearching" class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
      <!-- This could be expanded to show search suggestions -->
      <div class="p-3">
        <div class="flex items-center text-sm text-gray-600">
          <i class="fas fa-info-circle mr-2"></i>
          <span>按 Enter 搜尋或等待自動搜尋</span>
        </div>
      </div>
    </div>
  </form>
</template>

<style scoped></style>