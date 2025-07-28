<template>
  <div>
    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 class="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Discover Amazing
              <span class="text-yellow-400">Products</span>
            </h1>
            <p class="text-xl mb-8 text-blue-100">
              Shop the latest trends with unbeatable prices and fast delivery. Your perfect shopping experience starts here.
            </p>
            <div class="flex flex-col sm:flex-row gap-4">
              <button class="bg-yellow-400 text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors">
                Shop Now
              </button>
              <button class="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                Learn More
              </button>
            </div>
          </div>
          <div class="relative">
            <div class="bg-white rounded-lg shadow-2xl p-8 transform rotate-3">
              <img 
                src="https://via.placeholder.com/400x300/6366F1/FFFFFF?text=Featured+Product" 
                alt="Featured Product" 
                class="w-full h-64 object-cover rounded-lg"
              >
              <div class="mt-4">
                <h3 class="text-gray-900 font-semibold text-lg">Premium Product</h3>
                <p class="text-gray-600">Starting at $99</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Us?
          </h2>
          <p class="text-gray-600 max-w-2xl mx-auto">
            We provide exceptional service and quality products to make your shopping experience unforgettable.
          </p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center p-6">
            <div class="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Best Prices</h3>
            <p class="text-gray-600">Competitive pricing with regular discounts and special offers.</p>
          </div>
          <div class="text-center p-6">
            <div class="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Fast Shipping</h3>
            <p class="text-gray-600">Quick and reliable delivery to your doorstep in 2-3 business days.</p>
          </div>
          <div class="text-center p-6">
            <div class="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Quality Guarantee</h3>
            <p class="text-gray-600">100% satisfaction guarantee with easy returns and exchanges.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Products -->
    <section class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Featured Products
          </h2>
          <p class="text-gray-600">
            Discover our handpicked selection of premium products
          </p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="product in featuredProducts" :key="product.id" class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <img :src="product.image" :alt="product.name" class="w-full h-48 object-cover">
            <div class="p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ product.name }}</h3>
              <p class="text-gray-600 text-sm mb-4">{{ product.description }}</p>
              <div class="flex items-center justify-between">
                <span class="text-2xl font-bold text-blue-600">${{ product.price }}</span>
                <button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="text-center mt-12">
          <button class="bg-gray-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
            View All Products
          </button>
        </div>
      </div>
    </section>

    <!-- Newsletter Section -->
    <section class="py-20 bg-blue-600">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">
          Stay Updated
        </h2>
        <p class="text-blue-100 mb-8 max-w-2xl mx-auto">
          Subscribe to our newsletter and be the first to know about new products, exclusive deals, and special offers.
        </p>
        <div class="max-w-md mx-auto flex gap-4">
          <input
            type="email"
            placeholder="Enter your email"
            class="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
          >
          <button class="bg-yellow-400 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors">
            Subscribe
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const featuredProducts = ref([
  {
    id: 1,
    name: 'Wireless Headphones',
    description: 'Premium quality wireless headphones with noise cancellation',
    price: 199,
    image: 'https://via.placeholder.com/300x200/3B82F6/FFFFFF?text=Headphones'
  },
  {
    id: 2,
    name: 'Smart Watch',
    description: 'Latest smartwatch with health monitoring features',
    price: 299,
    image: 'https://via.placeholder.com/300x200/10B981/FFFFFF?text=Smart+Watch'
  },
  {
    id: 3,
    name: 'Laptop Stand',
    description: 'Ergonomic laptop stand for better posture',
    price: 79,
    image: 'https://via.placeholder.com/300x200/8B5CF6/FFFFFF?text=Laptop+Stand'
  },
  {
    id: 4,
    name: 'Bluetooth Speaker',
    description: 'Portable speaker with excellent sound quality',
    price: 129,
    image: 'https://via.placeholder.com/300x200/F59E0B/FFFFFF?text=Speaker'
  }
])
</script>
