<script setup>
import { ref, computed } from 'vue'
import { useCartStore } from '../stores/cart.js'

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  product: {
    type: Object,
    default: null
  }
})

const cartStore = useCartStore()
const quantity = ref(props.item.quantity)

// Computed properties
const subtotal = computed(() => props.item.unitPrice * quantity.value)
const productName = computed(() => props.product?.name || `商品 #${props.item.productId}`)
const productImage = computed(() => props.product?.imageUrl || '/default-product.jpg')
const inStock = computed(() => props.product?.inStock || 0)
const isOutOfStock = computed(() => inStock.value === 0)

// Methods
async function updateQuantity(newQuantity) {
  if (newQuantity <= 0) {
    await removeItem()
    return
  }
  
  if (newQuantity > inStock.value) {
    newQuantity = inStock.value
  }
  
  quantity.value = newQuantity
  await cartStore.updateCartItem(props.item.productId, newQuantity)
}

async function removeItem() {
  await cartStore.removeFromCart(props.item.productId)
}

function incrementQuantity() {
  if (quantity.value < inStock.value) {
    updateQuantity(quantity.value + 1)
  }
}

function decrementQuantity() {
  if (quantity.value > 1) {
    updateQuantity(quantity.value - 1)
  }
}

// Format price
function formatPrice(price) {
  return new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency: 'TWD',
    minimumFractionDigits: 0
  }).format(price)
}
</script>

<template>
  <div class="flex items-center py-6 px-6">
    <!-- Product image -->
    <div class="flex-shrink-0 w-20 h-20 bg-gray-200 rounded-lg overflow-hidden">
      <img
        :src="productImage"
        :alt="productName"
        class="w-full h-full object-cover"
        @error="$event.target.src = '/default-product.jpg'"
      />
    </div>

    <!-- Product info -->
    <div class="ml-4 flex-1">
      <div class="flex justify-between">
        <div class="pr-6">
          <h3 class="text-sm font-medium text-gray-900">
            {{ productName }}
          </h3>
          <p class="mt-1 text-sm text-gray-500">
            單價: {{ formatPrice(item.unitPrice) }}
          </p>
          <p v-if="product?.shortDescription" class="mt-1 text-xs text-gray-400 line-clamp-2">
            {{ product.shortDescription }}
          </p>
          
          <!-- Stock status -->
          <div class="mt-2">
            <span v-if="isOutOfStock" class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
              <i class="fas fa-exclamation-circle mr-1"></i>
              缺貨
            </span>
            <span v-else-if="inStock <= 5" class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
              <i class="fas fa-exclamation-triangle mr-1"></i>
              僅剩 {{ inStock }} 件
            </span>
            <span v-else class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
              <i class="fas fa-check-circle mr-1"></i>
              有庫存
            </span>
          </div>
        </div>

        <!-- Quantity controls and price -->
        <div class="flex flex-col items-end">
          <!-- Quantity controls -->
          <div class="flex items-center mb-2">
            <button
              @click="decrementQuantity"
              :disabled="quantity <= 1 || cartStore.isLoading"
              class="flex items-center justify-center w-8 h-8 border border-gray-300 rounded-l-md text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
            >
              <i class="fas fa-minus text-xs"></i>
            </button>
            
            <input
              v-model.number="quantity"
              @blur="updateQuantity(quantity)"
              @keyup.enter="updateQuantity(quantity)"
              type="number"
              min="1"
              :max="inStock"
              :disabled="cartStore.isLoading"
              class="w-16 h-8 text-center border-t border-b border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
            />
            
            <button
              @click="incrementQuantity"
              :disabled="quantity >= inStock || cartStore.isLoading"
              class="flex items-center justify-center w-8 h-8 border border-gray-300 rounded-r-md text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
            >
              <i class="fas fa-plus text-xs"></i>
            </button>
          </div>

          <!-- Subtotal -->
          <p class="text-sm font-medium text-gray-900 mb-2">
            {{ formatPrice(subtotal) }}
          </p>

          <!-- Remove button -->
          <button
            @click="removeItem"
            :disabled="cartStore.isLoading"
            class="text-sm text-red-600 hover:text-red-800 transition duration-200 disabled:opacity-50"
          >
            <i class="fas fa-trash mr-1"></i>
            移除
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>