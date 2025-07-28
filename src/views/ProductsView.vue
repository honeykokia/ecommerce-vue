<template>
  <div class="py-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Page Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">Our Products</h1>
        <p class="text-gray-600 max-w-2xl mx-auto">
          Discover our complete collection of premium products designed to enhance your lifestyle.
        </p>
      </div>

      <!-- Filters -->
      <div class="flex flex-wrap gap-4 mb-8">
        <button
          v-for="category in categories"
          :key="category"
          @click="selectedCategory = category"
          :class="[
            'px-4 py-2 rounded-lg font-medium transition-colors',
            selectedCategory === category
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          ]"
        >
          {{ category }}
        </button>
      </div>

      <!-- Products Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
          v-for="product in filteredProducts"
          :key="product.id"
          class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
        >
          <div class="relative">
            <img :src="product.image" :alt="product.name" class="w-full h-48 object-cover">
            <div class="absolute top-2 right-2">
              <span
                v-if="product.isNew"
                class="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold"
              >
                New
              </span>
              <span
                v-else-if="product.onSale"
                class="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold"
              >
                Sale
              </span>
            </div>
          </div>
          <div class="p-6">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm text-gray-500 uppercase tracking-wide">{{ product.category }}</span>
              <div class="flex text-yellow-400">
                <svg
                  v-for="i in 5"
                  :key="i"
                  :class="[
                    'w-4 h-4',
                    i <= product.rating ? 'text-yellow-400' : 'text-gray-300'
                  ]"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ product.name }}</h3>
            <p class="text-gray-600 text-sm mb-4">{{ product.description }}</p>
            <div class="flex items-center justify-between">
              <div>
                <span
                  v-if="product.originalPrice"
                  class="text-sm text-gray-500 line-through mr-2"
                >
                  ${{ product.originalPrice }}
                </span>
                <span class="text-2xl font-bold text-blue-600">${{ product.price }}</span>
              </div>
              <button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Load More Button -->
      <div class="text-center mt-12">
        <button class="bg-gray-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
          Load More Products
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const selectedCategory = ref('All')

const categories = ref(['All', 'Electronics', 'Accessories', 'Home', 'Sports', 'Fashion'])

const products = ref([
  {
    id: 1,
    name: 'Wireless Headphones Pro',
    description: 'Premium noise-canceling wireless headphones with 30-hour battery life',
    price: 199,
    originalPrice: 249,
    category: 'Electronics',
    rating: 5,
    isNew: true,
    onSale: false,
    image: 'https://via.placeholder.com/300x200/3B82F6/FFFFFF?text=Headphones+Pro'
  },
  {
    id: 2,
    name: 'Smart Fitness Watch',
    description: 'Advanced fitness tracker with heart rate monitoring and GPS',
    price: 299,
    category: 'Electronics',
    rating: 4,
    isNew: false,
    onSale: false,
    image: 'https://via.placeholder.com/300x200/10B981/FFFFFF?text=Smart+Watch'
  },
  {
    id: 3,
    name: 'Ergonomic Laptop Stand',
    description: 'Adjustable aluminum stand for improved posture and comfort',
    price: 79,
    originalPrice: 99,
    category: 'Accessories',
    rating: 4,
    isNew: false,
    onSale: true,
    image: 'https://via.placeholder.com/300x200/8B5CF6/FFFFFF?text=Laptop+Stand'
  },
  {
    id: 4,
    name: 'Portable Bluetooth Speaker',
    description: 'Waterproof speaker with 360-degree sound and 12-hour battery',
    price: 129,
    category: 'Electronics',
    rating: 5,
    isNew: true,
    onSale: false,
    image: 'https://via.placeholder.com/300x200/F59E0B/FFFFFF?text=Speaker'
  },
  {
    id: 5,
    name: 'Premium Coffee Maker',
    description: 'Professional-grade coffee maker with programmable settings',
    price: 249,
    category: 'Home',
    rating: 4,
    isNew: false,
    onSale: false,
    image: 'https://via.placeholder.com/300x200/EF4444/FFFFFF?text=Coffee+Maker'
  },
  {
    id: 6,
    name: 'Wireless Charging Pad',
    description: 'Fast wireless charger compatible with all Qi-enabled devices',
    price: 39,
    originalPrice: 59,
    category: 'Accessories',
    rating: 4,
    isNew: false,
    onSale: true,
    image: 'https://via.placeholder.com/300x200/06B6D4/FFFFFF?text=Charger'
  },
  {
    id: 7,
    name: 'Yoga Mat Premium',
    description: 'Non-slip, eco-friendly yoga mat with carrying strap',
    price: 89,
    category: 'Sports',
    rating: 5,
    isNew: true,
    onSale: false,
    image: 'https://via.placeholder.com/300x200/84CC16/FFFFFF?text=Yoga+Mat'
  },
  {
    id: 8,
    name: 'Designer Sunglasses',
    description: 'UV-protection sunglasses with polarized lenses',
    price: 159,
    category: 'Fashion',
    rating: 4,
    isNew: false,
    onSale: false,
    image: 'https://via.placeholder.com/300x200/F97316/FFFFFF?text=Sunglasses'
  }
])

const filteredProducts = computed(() => {
  if (selectedCategory.value === 'All') {
    return products.value
  }
  return products.value.filter(product => product.category === selectedCategory.value)
})
</script>