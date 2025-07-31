<script setup>
import { computed } from 'vue'
import { useProductStore } from '../stores/product.js'

const productStore = useProductStore()

// Methods
function selectCategory(categoryId) {
  productStore.setSelectedCategory(categoryId)
}

function clearCategoryFilter() {
  productStore.setSelectedCategory(null)
}

// Computed
const categoriesWithCounts = computed(() => {
  return productStore.categories.map(category => ({
    ...category,
    productCount: productStore.products.filter(product => product.categoryId === category.id).length
  }))
})
</script>

<template>
  <div>
    <h3 class="text-lg font-medium text-gray-900 mb-4">商品分類</h3>
    
    <!-- All categories option -->
    <div class="space-y-2">
      <button
        @click="clearCategoryFilter"
        :class="[
          'w-full text-left px-3 py-2 rounded-md text-sm transition duration-200',
          !productStore.selectedCategory
            ? 'bg-blue-100 text-blue-800 font-medium'
            : 'text-gray-700 hover:bg-gray-100'
        ]"
      >
        <div class="flex items-center justify-between">
          <span>
            <i class="fas fa-th-large mr-2"></i>
            所有商品
          </span>
          <span class="text-xs text-gray-500">{{ productStore.products.length }}</span>
        </div>
      </button>
      
      <!-- Loading state -->
      <div v-if="productStore.isLoading && !productStore.categories.length" class="text-center py-4">
        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
        <p class="text-xs text-gray-500 mt-2">載入分類中...</p>
      </div>
      
      <!-- Category list -->
      <button
        v-for="category in categoriesWithCounts"
        :key="category.id"
        @click="selectCategory(category.id)"
        :class="[
          'w-full text-left px-3 py-2 rounded-md text-sm transition duration-200',
          productStore.selectedCategory === category.id
            ? 'bg-blue-100 text-blue-800 font-medium'
            : 'text-gray-700 hover:bg-gray-100'
        ]"
      >
        <div class="flex items-center justify-between">
          <span>
            <i class="fas fa-folder mr-2"></i>
            {{ category.name }}
          </span>
          <span class="text-xs text-gray-500">{{ category.productCount }}</span>
        </div>
        
        <!-- Category description -->
        <p v-if="category.description" class="text-xs text-gray-500 mt-1 ml-5">
          {{ category.description }}
        </p>
      </button>
      
      <!-- No categories message -->
      <div v-if="!productStore.isLoading && !productStore.categories.length" class="text-center py-4 text-gray-500">
        <i class="fas fa-folder-open text-2xl mb-2"></i>
        <p class="text-sm">暫無分類</p>
      </div>
    </div>
  </div>
</template>

<style scoped></style>