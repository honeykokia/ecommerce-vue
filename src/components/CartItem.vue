<script setup>
import { ref } from 'vue'

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update-quantity', 'remove-item'])

const quantity = ref(props.item.quantity)

function updateQuantity(newQuantity) {
  if (newQuantity < 1) return
  quantity.value = newQuantity
  emit('update-quantity', props.item.productId, newQuantity)
}

function decreaseQuantity() {
  if (quantity.value > 1) {
    updateQuantity(quantity.value - 1)
  }
}

function increaseQuantity() {
  updateQuantity(quantity.value + 1)
}

function removeItem() {
  emit('remove-item', props.item.productId)
}

// Calculate item total
const itemTotal = () => props.item.unitPrice * quantity.value
</script>

<template>
  <div class="flex items-center py-6 border-b border-gray-200 last:border-b-0">
    <!-- Product Image Placeholder -->
    <div class="flex-shrink-0 w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
      <i class="fas fa-box text-gray-400 text-2xl"></i>
    </div>

    <!-- Product Details -->
    <div class="ml-4 flex-1">
      <h3 class="text-lg font-medium text-gray-900">
        Product #{{ item.productId }}
      </h3>
      <p class="text-sm text-gray-500 mt-1">
        Unit price: ${{ item.unitPrice.toLocaleString() }}
      </p>
      <p class="text-sm text-gray-400 mt-1">
        Added: {{ new Date(item.createAt).toLocaleDateString() }}
      </p>
    </div>

    <!-- Quantity Controls -->
    <div class="flex items-center space-x-3">
      <div class="flex items-center border border-gray-300 rounded-lg">
        <button
          @click="decreaseQuantity"
          :disabled="quantity <= 1"
          class="p-2 text-gray-500 hover:text-gray-700 disabled:text-gray-300 disabled:cursor-not-allowed transition duration-200"
        >
          <i class="fas fa-minus text-sm"></i>
        </button>
        
        <input
          v-model.number="quantity"
          @change="updateQuantity(quantity)"
          type="number"
          min="1"
          class="w-16 text-center border-0 focus:ring-0 focus:outline-none"
        />
        
        <button
          @click="increaseQuantity"
          class="p-2 text-gray-500 hover:text-gray-700 transition duration-200"
        >
          <i class="fas fa-plus text-sm"></i>
        </button>
      </div>

      <!-- Item Total -->
      <div class="text-lg font-semibold text-gray-900 min-w-[100px] text-right">
        ${{ itemTotal().toLocaleString() }}
      </div>

      <!-- Remove Button -->
      <button
        @click="removeItem"
        class="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition duration-200"
        title="Remove item"
      >
        <i class="fas fa-trash text-sm"></i>
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}
</style>