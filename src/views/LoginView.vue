<template>
  <div
    class="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8"
    style="background-color: #f5f5f5"
  >
    <div class="w-full max-w-md">
      <!-- Login Form -->
      <div
        class="bg-white p-8 rounded-lg shadow-md w-full mx-auto"
        style="width: 320px; max-width: 480px"
      >
        <div>
          <h2 class="text-center text-2xl font-bold text-gray-900 mb-6">會員登入</h2>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Email Field -->
          <div>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
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
              class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              :class="{ 'border-red-500': errors.password }"
              placeholder="請輸入密碼"
            />
            <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
          </div>

          <!-- General Error Message -->
          <div v-if="errors.general" class="text-center">
            <p class="text-sm text-red-600">{{ errors.general }}</p>
          </div>

          <!-- Login Button -->
          <div>
            <button
              type="submit"
              :disabled="isLoading"
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              <span v-if="isLoading" class="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg
                  class="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </span>
              {{ isLoading ? '登入中...' : '登入' }}
            </button>
          </div>

          <!-- Forgot Password Link -->
          <div class="text-right">
            <a
              href="#"
              @click.prevent="forgotPassword"
              class="text-sm text-blue-600 hover:text-blue-800"
            >
              忘記密碼
            </a>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Form state
const form = reactive({
  email: '',
  password: '',
})

// Error state
const errors = reactive({
  email: '',
  password: '',
  general: '',
})

// Loading state
const isLoading = ref(false)

// Email validation
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Form validation
const validateForm = () => {
  // Reset errors
  errors.email = ''
  errors.password = ''
  errors.general = ''

  let isValid = true

  // Email validation
  if (!form.email) {
    errors.email = '請輸入 Email'
    isValid = false
  } else if (!validateEmail(form.email)) {
    errors.email = '請輸入有效的 Email 格式'
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

// Handle form submission
const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  isLoading.value = true

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Simulate login logic - this would be replaced with actual API call
    // POST /users/login
    const loginData = {
      email: form.email,
      password: form.password,
    }

    // For demo purposes, show success and redirect
    console.log('Login attempt:', loginData)

    // In a real app, you would check the API response here
    // For now, simulate successful login
    if (form.email && form.password.length >= 6) {
      // Redirect to home page on success
      router.push('/home')
    } else {
      errors.general = '登入失敗，請檢查您的 Email 和密碼'
    }
  } catch (error) {
    errors.general = '登入時發生錯誤，請稍後再試'
  } finally {
    isLoading.value = false
  }
}

// Handle forgot password
const forgotPassword = () => {
  // This would navigate to forgot password page
  console.log('Navigate to forgot password page')
  // router.push('/forgot-password')
  alert('忘記密碼功能尚未實作')
}
</script>

<style scoped>
/* Mobile responsive styles */
@media (max-width: 640px) {
  .bg-white {
    width: 100% !important;
    max-width: 100% !important;
    margin: 0 16px !important;
  }

  .w-full {
    max-width: none !important;
  }
}

/* Desktop styles */
@media (min-width: 1024px) {
  .bg-white {
    width: 320px !important;
    max-width: 320px !important;
  }
}
</style>
