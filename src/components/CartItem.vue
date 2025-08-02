<script setup>
import { ref, computed } from 'vue'
import { useCartStore } from '../stores/cart.js'
import { useProductStore } from '../stores/product.js'

const props = defineProps({
  cartItem: {
    type: Object,
    required: true,
  },
})

const cartStore = useCartStore()
const productStore = useProductStore()

const isUpdating = ref(false)
const quantityInput = ref(props.cartItem.quantity)

const product = computed(() => productStore.getProductById(props.cartItem.productId))

const itemTotal = computed(() => props.cartItem.unitPrice * props.cartItem.quantity)

const formatPrice = (price) => {
  return new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency: 'TWD',
    minimumFractionDigits: 0,
  }).format(price)
}

const updateQuantity = async (newQuantity) => {
  if (newQuantity < 1) return

  isUpdating.value = true
  try {
    await cartStore.updateCartItemQuantity(props.cartItem.productId, newQuantity)
    quantityInput.value = newQuantity
  } catch (error) {
    // Reset to original quantity on error
    quantityInput.value = props.cartItem.quantity
    console.error('Failed to update quantity:', error)
  } finally {
    isUpdating.value = false
  }
}

const removeItem = async () => {
  isUpdating.value = true
  try {
    await cartStore.removeFromCart(props.cartItem.productId)
  } catch (error) {
    console.error('Failed to remove item:', error)
  } finally {
    isUpdating.value = false
  }
}

const incrementQuantity = () => {
  const newQuantity = quantityInput.value + 1
  updateQuantity(newQuantity)
}

const decrementQuantity = () => {
  if (quantityInput.value > 1) {
    const newQuantity = quantityInput.value - 1
    updateQuantity(newQuantity)
  }
}

const onQuantityInputChange = () => {
  const newQuantity = parseInt(quantityInput.value)
  if (newQuantity && newQuantity > 0) {
    updateQuantity(newQuantity)
  } else {
    quantityInput.value = props.cartItem.quantity
  }
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
    <div class="flex flex-col md:flex-row md:items-center gap-4">
      <!-- Product Image -->
      <div class="flex-shrink-0">
        <img
          :src="product?.imageUrl || '/upload/defaultProduct.jpg'"
          :alt="product?.name || 'Product'"
          class="w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg"
        />
      </div>

      <!-- Product Info -->
      <div class="flex-grow min-w-0">
        <h3 class="font-semibold text-gray-900 text-lg mb-1 truncate">
          {{ product?.name || 'Loading...' }}
        </h3>

        <p v-if="product?.shortDescription" class="text-gray-600 text-sm mb-2 line-clamp-2">
          {{ product.shortDescription }}
        </p>

        <div class="flex flex-wrap items-center gap-4 text-sm text-gray-500">
          <span class="flex items-center">
            <i class="fas fa-dollar-sign mr-1"></i>
            單價: {{ formatPrice(cartItem.unitPrice) }}
          </span>

          <span v-if="product?.inStock !== undefined" class="flex items-center">
            <i class="fas fa-box mr-1"></i>
            庫存: {{ product.inStock }}
          </span>
        </div>
      </div>

      <!-- Quantity Controls -->
      <div class="flex items-center space-x-3">
        <div class="flex items-center border border-gray-300 rounded-lg">
          <button
            @click="decrementQuantity"
            :disabled="isUpdating || quantityInput <= 1"
            class="p-2 text-gray-600 hover:text-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            <i class="fas fa-minus text-sm"></i>
          </button>

          <input
            v-model.number="quantityInput"
            @blur="onQuantityInputChange"
            @keyup.enter="onQuantityInputChange"
            :disabled="isUpdating"
            type="number"
            min="1"
            class="w-16 text-center border-0 focus:ring-0 disabled:bg-gray-50"
          />

          <button
            @click="incrementQuantity"
            :disabled="isUpdating"
            class="p-2 text-gray-600 hover:text-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            <i class="fas fa-plus text-sm"></i>
          </button>
        </div>

        <!-- Loading indicator -->
        <div v-if="isUpdating" class="text-blue-600">
          <i class="fas fa-spinner fa-spin"></i>
        </div>
      </div>

      <!-- Item Total and Remove -->
      <div class="flex flex-col items-end space-y-2 md:min-w-0 md:w-32">
        <div class="text-lg font-bold text-gray-900">
          {{ formatPrice(itemTotal) }}
        </div>

        <button
          @click="removeItem"
          :disabled="isUpdating"
          class="text-red-600 hover:text-red-800 text-sm font-medium disabled:text-red-400 disabled:cursor-not-allowed flex items-center"
        >
          <i class="fas fa-trash-alt mr-1"></i>
          移除
        </button>
      </div>
    </div>

    <!-- Stock Warning -->
    <div
      v-if="product && product.inStock < cartItem.quantity"
      class="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
    >
      <div class="flex items-center text-yellow-800">
        <i class="fas fa-exclamation-triangle mr-2"></i>
        <span class="text-sm">
          庫存不足！目前庫存僅剩 {{ product.inStock }} 件，您的購物車中有 {{ cartItem.quantity }} 件
        </span>
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

/* Hide number input spinners */
input[type='number']::-webkit-outer-spin-button,
input[type='number']::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type='number'] {
  -moz-appearance: textfield;
}
</style>
