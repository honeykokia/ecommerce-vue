<script setup>
import { computed } from 'vue'

const props = defineProps({
  items: {
    type: Array,
    required: true
  },
  isLoading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['checkout', 'clear-cart'])

// Calculate totals
const subtotal = computed(() => {
  return props.items.reduce((total, item) => total + (item.unitPrice * item.quantity), 0)
})

const itemCount = computed(() => {
  return props.items.reduce((total, item) => total + item.quantity, 0)
})

// Assuming tax rate of 10% and shipping cost of $10 for demonstration
const taxRate = 0.1
const shippingCost = 10

const tax = computed(() => Math.round(subtotal.value * taxRate))
const shipping = computed(() => subtotal.value > 0 ? shippingCost : 0)
const total = computed(() => subtotal.value + tax.value + shipping.value)

function handleCheckout() {
  emit('checkout')
}

function handleClearCart() {
  emit('clear-cart')
}
</script>

<template>
  <div class="bg-gray-50 rounded-lg p-6">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
    
    <!-- Order Details -->
    <div class="space-y-3 mb-6">
      <div class="flex justify-between text-sm">
        <span class="text-gray-600">Items ({{ itemCount }})</span>
        <span class="text-gray-900">${{ subtotal.toLocaleString() }}</span>
      </div>
      
      <div class="flex justify-between text-sm">
        <span class="text-gray-600">Shipping</span>
        <span class="text-gray-900">
          {{ shipping > 0 ? `$${shipping}` : 'Free' }}
        </span>
      </div>
      
      <div class="flex justify-between text-sm">
        <span class="text-gray-600">Tax</span>
        <span class="text-gray-900">${{ tax.toLocaleString() }}</span>
      </div>
      
      <div class="border-t border-gray-200 pt-3">
        <div class="flex justify-between">
          <span class="text-lg font-semibold text-gray-900">Total</span>
          <span class="text-lg font-semibold text-gray-900">${{ total.toLocaleString() }}</span>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="space-y-3">
      <button
        @click="handleCheckout"
        :disabled="isLoading || items.length === 0"
        :class="[
          'w-full py-3 px-4 border border-transparent rounded-lg text-sm font-medium transition duration-200',
          isLoading || items.length === 0
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
        ]"
      >
        <span v-if="isLoading" class="flex items-center justify-center">
          <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing...
        </span>
        <span v-else>
          Proceed to Checkout
        </span>
      </button>
      
      <button
        @click="handleClearCart"
        :disabled="isLoading || items.length === 0"
        class="w-full py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
      >
        Clear Cart
      </button>
    </div>

    <!-- Additional Info -->
    <div class="mt-6 text-xs text-gray-500">
      <p class="flex items-center">
        <i class="fas fa-shield-alt mr-2"></i>
        Secure checkout with SSL encryption
      </p>
      <p class="flex items-center mt-2">
        <i class="fas fa-truck mr-2"></i>
        Free shipping on orders over $50
      </p>
    </div>
  </div>
</template>

<style scoped></style>