<template>
  <header class="bg-white shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center py-4">
        <!-- Logo -->
        <div class="flex items-center">
          <RouterLink to="/" class="text-2xl font-bold text-gray-900">
            EcommerceVue
          </RouterLink>
        </div>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex space-x-8">
          <RouterLink
            to="/"
            class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            :class="{ 'text-blue-600': $route.path === '/' }"
          >
            Home
          </RouterLink>
          <RouterLink
            to="/products"
            class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            :class="{ 'text-blue-600': $route.path === '/products' }"
          >
            Products
          </RouterLink>
          <RouterLink
            to="/about"
            class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            :class="{ 'text-blue-600': $route.path === '/about' }"
          >
            About
          </RouterLink>
        </nav>

        <!-- Right side actions -->
        <div class="hidden md:flex items-center space-x-4">
          <button class="text-gray-700 hover:text-blue-600 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <button class="text-gray-700 hover:text-blue-600 transition-colors relative">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h8.5" />
            </svg>
            <span class="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              3
            </span>
          </button>
        </div>

        <!-- Mobile menu button -->
        <button
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="md:hidden text-gray-700 hover:text-blue-600 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <!-- Mobile menu -->
      <div v-if="mobileMenuOpen" class="md:hidden">
        <div class="px-2 pt-2 pb-3 space-y-1 border-t border-gray-200">
          <RouterLink
            to="/"
            class="block px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:text-blue-600 hover:bg-gray-50"
            @click="mobileMenuOpen = false"
          >
            Home
          </RouterLink>
          <RouterLink
            to="/products"
            class="block px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:text-blue-600 hover:bg-gray-50"
            @click="mobileMenuOpen = false"
          >
            Products
          </RouterLink>
          <RouterLink
            to="/about"
            class="block px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:text-blue-600 hover:bg-gray-50"
            @click="mobileMenuOpen = false"
          >
            About
          </RouterLink>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const mobileMenuOpen = ref(false)
</script>