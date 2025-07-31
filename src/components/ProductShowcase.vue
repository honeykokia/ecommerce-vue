<script setup>
import { ref } from 'vue'
import { useCartStore } from '../stores/cart.js'
import { useUserStore } from '../stores/user.js'
import { useRouter } from 'vue-router'

const cartStore = useCartStore()
const userStore = useUserStore()
const router = useRouter()

const isAdding = ref(false)

// Sample products for demonstration
const sampleProducts = [
  {
    id: 1,
    name: 'Bluetooth Headphones',
    price: 2000,
    image: '/upload/defaultProduct.jpg',
    description: 'High-quality wireless headphones with noise cancellation'
  },
  {
    id: 2,
    name: 'Smartphone',
    price: 15000,
    image: '/upload/defaultProduct.jpg',
    description: 'Latest smartphone with advanced camera features'
  },
  {
    id: 3,
    name: 'Laptop',
    price: 35000,
    image: '/upload/defaultProduct.jpg',
    description: 'Powerful laptop for work and gaming'
  }
]

async function addToCart(product) {
  if (!userStore.isAuthenticated) {
    router.push('/login')
    return
  }

  isAdding.value = true

  const cartItem = {
    productId: product.id,
    quantity: 1,
    unitPrice: product.price
  }

  const success = await cartStore.addToCart(cartItem)
  
  if (success) {
    // Optional: Show success message or animation
    console.log('Added to cart successfully!')
  }

  isAdding.value = false
}
</script>

<template>
  <div class="bg-white py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
        <p class="text-gray-600">Discover our latest collection</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="product in sampleProducts"
          :key="product.id"
          class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300"
        >
          <!-- Product Image -->
          <div class="h-64 bg-gray-200 flex items-center justify-center">
            <i class="fas fa-box text-gray-400 text-4xl"></i>
          </div>

          <!-- Product Details -->
          <div class="p-6">
            <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ product.name }}</h3>
            <p class="text-gray-600 text-sm mb-4">{{ product.description }}</p>
            
            <div class="flex items-center justify-between">
              <span class="text-2xl font-bold text-blue-600">${{ product.price.toLocaleString() }}</span>
              
              <button
                @click="addToCart(product)"
                :disabled="isAdding"
                :class="[
                  'px-4 py-2 rounded-lg font-medium transition duration-200',
                  isAdding
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                ]"
              >
                <span v-if="isAdding" class="flex items-center">
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adding...
                </span>
                <span v-else>
                  <i class="fas fa-cart-plus mr-2"></i>
                  Add to Cart
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Call to Action -->
      <div class="text-center mt-12">
        <p class="text-gray-600 mb-4">Want to see your cart?</p>
        <RouterLink
          to="/cart"
          class="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
        >
          <i class="fas fa-shopping-cart mr-2"></i>
          View Cart
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped></style>