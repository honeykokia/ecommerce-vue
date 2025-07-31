<script setup>
import { onMounted } from 'vue'
import { useUserStore } from '../stores/user.js'
import { useCartStore } from '../stores/cart.js'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const cartStore = useCartStore()
const router = useRouter()

// Initialize cart on mount if user is authenticated
onMounted(() => {
  if (userStore.isAuthenticated) {
    cartStore.fetchCart()
  }
})

function handleLogout() {
  userStore.logout()
  router.push('/')
}
</script>

<template>
  <div class="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
    <h1 class="text-2xl font-bold text-center md:text-3xl md:text-left">
      Welcome to My E-commerce Site
    </h1>
    
    <ul class="flex flex-wrap justify-center md:justify-end items-center gap-6">
      <li>
        <RouterLink
          to="/"
          class="text-black-500 hover:text-blue-700 border-b-2 border-transparent hover:border-blue-700 transition duration-200"
        >
          <i class="fa-solid fa-house text-2xl"></i>
        </RouterLink>
      </li>
      <li>
        <RouterLink
          to="/products"
          class="text-black-500 hover:text-blue-700 border-b-2 border-transparent hover:border-blue-700 transition duration-200"
          title="瀏覽商品"
        >
          <i class="fa-solid fa-search text-2xl"></i>
        </RouterLink>
      </li>
      <li class="relative">
        <RouterLink
          to="/cart"
          class="text-black-500 hover:text-blue-700 border-b-2 border-transparent hover:border-blue-700 transition duration-200"
          title="購物車"
        >
          <i class="fa-solid fa-cart-shopping text-2xl"></i>
          <!-- Cart count badge -->
          <span 
            v-if="userStore.isAuthenticated && cartStore.cartCount > 0"
            class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium"
          >
            {{ cartStore.cartCount > 99 ? '99+' : cartStore.cartCount }}
          </span>
        </RouterLink>
      </li>
      
      <!-- Authenticated user menu -->
      <li v-if="userStore.isAuthenticated" class="relative group">
        <button
          class="bg-blue-100 border-2 border-blue-200 p-2 rounded-xl text-blue-700 hover:text-blue-800 hover:bg-blue-200 transition duration-200 flex items-center space-x-2"
        >
          <i class="fa-solid fa-user text-xl"></i>
          <span class="hidden md:inline">{{ userStore.userName || 'User' }}</span>
          <i class="fa-solid fa-chevron-down text-sm"></i>
        </button>
        
        <!-- Dropdown menu -->
        <div class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
          <div class="py-2">
            <RouterLink
              to="/dashboard"
              class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-200"
            >
              <i class="fas fa-tachometer-alt mr-3 text-blue-600"></i>
              Dashboard
            </RouterLink>
            <RouterLink
              to="/profile"
              class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-200"
            >
              <i class="fas fa-user mr-3 text-green-600"></i>
              My Profile
            </RouterLink>
            <RouterLink
              to="/orders"
              class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-200"
            >
              <i class="fas fa-shopping-bag mr-3 text-purple-600"></i>
              My Orders
            </RouterLink>
            <RouterLink
              to="/cart"
              class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-200"
            >
              <i class="fas fa-shopping-cart mr-3 text-orange-600"></i>
              購物車
              <span v-if="cartStore.cartCount > 0" class="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1">
                {{ cartStore.cartCount }}
              </span>
            </RouterLink>
            <div class="border-t border-gray-200 my-2"></div>
            <button
              @click="handleLogout"
              class="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition duration-200"
            >
              <i class="fas fa-sign-out-alt mr-3"></i>
              Logout
            </button>
          </div>
        </div>
      </li>
      
      <!-- Guest user login/register -->
      <li v-else>
        <RouterLink
          to="/login"
          class="bg-gray-200 border-2 border-gray-300 p-2 rounded-xl text-gray-700 hover:text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition duration-200 flex items-center space-x-2"
        >
          <i class="fa-solid fa-user text-xl"></i>
          <span>登入/註冊</span>
        </RouterLink>
      </li>
    </ul>
  </div>
</template>

<style scoped></style>
