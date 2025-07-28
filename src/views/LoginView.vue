<template>
  <div class="min-h-screen bg-gray-100" style="background-color: #f5f5f5;">
    <div class="flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <!-- Main form container with shadow -->
        <div class="bg-white rounded-lg shadow-md p-8" style="width: 100%; max-width: 320px; margin: 0 auto;">
          <!-- Title -->
          <div class="text-center">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">會員登入</h2>
          </div>

          <!-- Login Form -->
          <form @submit.prevent="handleLogin" class="space-y-4">
            <!-- Email Field -->
            <div>
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                :class="{ 'border-red-500': errors.email }"
                placeholder="請輸入 Email"
              />
              <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
            </div>

            <!-- Password Field -->
            <div>
              <input
                id="password"
                v-model="form.password"
                type="password"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                :class="{ 'border-red-500': errors.password }"
                placeholder="請輸入密碼"
              />
              <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
            </div>

            <!-- Login Button -->
            <div class="pt-2">
              <button
                type="submit"
                :disabled="loading"
                class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  v-if="loading"
                  class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ loading ? '登入中...' : '登入' }}
              </button>
            </div>

            <!-- Error Message -->
            <div v-if="loginError" class="mt-4">
              <p class="text-sm text-red-600 text-center">{{ loginError }}</p>
            </div>
          </form>

          <!-- Forgot Password Link -->
          <div class="mt-6 text-right">
            <a
              href="#"
              @click.prevent="goToForgotPassword"
              class="text-sm text-blue-600 hover:text-blue-500"
            >
              忘記密碼
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Form data
const form = reactive({
  email: '',
  password: ''
})

// Form state
const loading = ref(false)
const loginError = ref('')
const errors = reactive({
  email: '',
  password: ''
})

// Email validation
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Form validation
const validateForm = () => {
  // Clear previous errors
  errors.email = ''
  errors.password = ''
  
  let isValid = true

  // Email validation
  if (!form.email) {
    errors.email = '請輸入 Email'
    isValid = false
  } else if (!validateEmail(form.email)) {
    errors.email = '請輸入正確的 Email 格式'
    isValid = false
  }

  // Password validation
  if (!form.password) {
    errors.password = '請輸入密碼'
    isValid = false
  } else if (form.password.length < 6) {
    errors.password = '密碼長度至少需要 6 個字元'
    isValid = false
  }

  return isValid
}

// Login handler
const handleLogin = async () => {
  if (!validateForm()) {
    return
  }

  loading.value = true
  loginError.value = ''

  try {
    // Simulate API call to POST /users/login
    // In a real app, this would be an actual API call
    await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate network delay
    
    // For demo purposes, we'll simulate a successful login
    // In reality, you would check the API response here
    console.log('Login attempt:', form)
    
    // Redirect to home page on successful login
    router.push('/home')
  } catch (error) {
    loginError.value = '登入失敗，請檢查您的帳號密碼'
  } finally {
    loading.value = false
  }
}

// Forgot password handler
const goToForgotPassword = () => {
  // In a real app, this would navigate to the forgot password page
  alert('忘記密碼功能尚未實作')
}
</script>

<style scoped>
/* Additional responsive styles for mobile */
@media (max-width: 640px) {
  .bg-white {
    width: 100% !important;
    max-width: none !important;
    margin: 0 1rem !important;
  }
}

@media (min-width: 641px) {
  .bg-white {
    width: 320px !important;
  }
}
</style>