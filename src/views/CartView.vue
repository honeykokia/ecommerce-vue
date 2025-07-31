<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart.js'
import CartItem from '../components/CartItem.vue'
import CartSummary from '../components/CartSummary.vue'

const router = useRouter()
const cartStore = useCartStore()

const showClearConfirm = ref(false)

// Fetch cart data on component mount
onMounted(() => {
  cartStore.fetchCart()
})

// Handle quantity update
async function handleUpdateQuantity(productId, quantity) {
  await cartStore.updateCartItem(productId, quantity)
}

// Handle item removal
async function handleRemoveItem(productId) {
  await cartStore.removeFromCart(productId)
}

// Handle checkout
function handleCheckout() {
  // Navigate to checkout page (to be implemented)
  router.push('/checkout')
}

// Handle clear cart with confirmation
function handleClearCart() {
  showClearConfirm.value = true
}

async function confirmClearCart() {
  await cartStore.clearCart()
  showClearConfirm.value = false
}

function cancelClearCart() {
  showClearConfirm.value = false
}

// Navigate to shopping
function continueShopping() {
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
        <p class="text-gray-600">
          {{ cartStore.itemCount }} {{ cartStore.itemCount === 1 ? 'item' : 'items' }} in your cart
        </p>
      </div>

      <!-- Error Message -->
      <div v-if="cartStore.error" class="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
        <div class="flex">
          <i class="fas fa-exclamation-circle mt-0.5 mr-2"></i>
          <span>{{ cartStore.error }}</span>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="cartStore.isLoading && cartStore.cartItems.length === 0" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="mt-4 text-gray-600">Loading your cart...</p>
      </div>

      <!-- Empty Cart State -->
      <div v-else-if="cartStore.isEmpty" class="text-center py-16">
        <div class="mx-auto h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <i class="fas fa-shopping-cart text-gray-400 text-3xl"></i>
        </div>
        <h2 class="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
        <p class="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
        <button
          @click="continueShopping"
          class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Continue Shopping
        </button>
      </div>

      <!-- Cart Content -->
      <div v-else class="lg:grid lg:grid-cols-3 lg:gap-8">
        <!-- Cart Items -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-6">Cart Items</h2>
            
            <div class="divide-y divide-gray-200">
              <CartItem
                v-for="item in cartStore.cartItems"
                :key="item.id"
                :item="item"
                @update-quantity="handleUpdateQuantity"
                @remove-item="handleRemoveItem"
              />
            </div>

            <!-- Continue Shopping Link -->
            <div class="mt-6 pt-6 border-t border-gray-200">
              <button
                @click="continueShopping"
                class="text-blue-600 hover:text-blue-700 text-sm font-medium transition duration-200"
              >
                <i class="fas fa-arrow-left mr-2"></i>
                Continue Shopping
              </button>
            </div>
          </div>
        </div>

        <!-- Cart Summary -->
        <div class="mt-8 lg:mt-0">
          <CartSummary
            :items="cartStore.cartItems"
            :is-loading="cartStore.isLoading"
            @checkout="handleCheckout"
            @clear-cart="handleClearCart"
          />
        </div>
      </div>
    </div>

    <!-- Clear Cart Confirmation Modal -->
    <div v-if="showClearConfirm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md mx-4">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Clear Cart</h3>
        <p class="text-gray-600 mb-6">
          Are you sure you want to remove all items from your cart? This action cannot be undone.
        </p>
        <div class="flex space-x-3">
          <button
            @click="confirmClearCart"
            class="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-200"
          >
            Clear Cart
          </button>
          <button
            @click="cancelClearCart"
            class="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>