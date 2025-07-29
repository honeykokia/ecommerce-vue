<script setup>
import { ref } from 'vue'

// 定義商品資料
const products = ref([
  {
    id: 1,
    name: 'Product Name',
    price: 29.99,
    image: 'https://via.placeholder.com/150',
    alt: 'Product Image'
  },
  {
    id: 2,
    name: 'Product Name',
    price: 39.99,
    image: 'https://via.placeholder.com/150',
    alt: 'Product Image'
  },
  {
    id: 3,
    name: 'Product Name',
    price: 49.99,
    image: 'https://via.placeholder.com/150',
    alt: 'Product Image'
  },
  {
    id: 4,
    name: 'Product Name',
    price: 59.99,
    image: 'https://via.placeholder.com/150',
    alt: 'Product Image'
  },
  {
    id: 5,
    name: 'Product Name',
    price: 69.99,
    image: 'https://via.placeholder.com/150',
    alt: 'Product Image'
  },
  {
    id: 6,
    name: 'Product Name',
    price: 79.99,
    image: 'https://via.placeholder.com/150',
    alt: 'Product Image'
  }
])

// 添加到購物車功能
const addToCart = (product) => {
  console.log('Adding to cart:', product.price)
  // 這裡可以加入實際的購物車邏輯
}
</script>

<template>
  <div class="container mx-auto">
    <h2 class="text-2xl font-bold mb-4">Featured Products</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- 使用 v-for 遍歷商品 -->
      <div 
        v-for="product in products" 
        :key="product.id"
        class="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
      >
        <img
          :src="product.image"
          :alt="product.alt"
          class="w-full h-48 object-cover rounded-t-lg mb-4"
        />
        <h3 class="text-xl font-semibold mb-2">{{ product.name }}</h3>
        <p class="text-gray-600 mb-4">${{ product.price }}</p>
        <button
          @click="addToCart(product)"
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300"
        >
          Add to Cart
        </button>
      </div>
    </div>
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
