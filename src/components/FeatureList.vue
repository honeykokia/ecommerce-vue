<script setup>
import { ref, computed, onMounted } from 'vue'
import { useProductStore } from '@/stores/product'
import { useCartStore } from '@/stores/cart'

const productStore = useProductStore()
const cartStore = useCartStore()
const api = import.meta.env.VITE_API_URL

// Get 10 most recently listed products (sorted by ID descending)
const recentProducts = computed(() => {
  const allProducts = [...productStore.products]
  return allProducts
    .sort((a, b) => b.id - a.id) // Sort by ID descending (most recent first)
    .slice(0, 10) // Limit to 10 products
})

// 添加到購物車功能
const addToCart = async (product) => {
  try {
    await cartStore.addToCart(product.id, 1, product.price)
    console.log('Added to cart:', product.name)
  } catch (error) {
    console.error('Failed to add to cart:', error)
  }
}

// Fetch products when component mounts
onMounted(async () => {
  await productStore.fetchProducts()
})
</script>

<template>
  <div class="container mx-auto">
    <h2 class="text-2xl font-bold mb-4">Featured Products</h2>

    <!-- Loading state -->
    <div v-if="productStore.isLoading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      <p class="mt-2 text-gray-600">Loading products...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="productStore.error" class="text-center py-8">
      <p class="text-red-600 mb-4">{{ productStore.error }}</p>
      <button
        @click="productStore.fetchProducts()"
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Try Again
      </button>
    </div>

    <!-- Products grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
      <!-- 使用 v-for 遍歷最近的商品 -->
      <div
        v-for="product in recentProducts"
        :key="product.id"
        class="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
      >
        <img
          :src="`${api}${product.imageURL || product.image}`"
          :alt="product.name"
          class="w-full h-48 object-cover rounded-t-lg mb-4"
        />
        <h3 class="text-xl font-semibold mb-2">{{ product.name }}</h3>
        <div class="flex items-center justify-between mb-2">
          <p class="text-gray-600">${{ product.originalPrice }}</p>
          <div v-if="product.rating" class="flex items-center">
            <span class="text-yellow-500">★</span>
            <span class="text-sm text-gray-600 ml-1">{{ product.rating }}</span>
          </div>
        </div>
        <p class="text-sm text-gray-500 mb-4 h-12 overflow-hidden">
          {{ product.shortDescription }}
        </p>
        <button
          @click="addToCart(product)"
          :disabled="product.inStock === 0"
          :class="[
            'w-full px-4 py-2 rounded transition-colors duration-300',
            product.inStock === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600',
          ]"
        >
          {{ product.inStock === 0 ? 'Out of Stock' : 'Add to Cart' }}
        </button>
      </div>
    </div>

    <!-- View more products link -->
    <div class="mt-10 px-4">
      <a
        href="/products"
        class="block w-full text-center py-4 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold rounded-xl shadow hover:scale-105 transition"
      >
        View More Products →
      </a>
    </div>
  </div>
</template>

<style scoped></style>
