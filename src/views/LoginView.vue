<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user.js'
import { userApi } from '../services/api.js'

const router = useRouter()
const userStore = useUserStore()

// Form data
const formData = reactive({
  email: '',
  password: '',
})

// Form validation and state
const errors = ref({})
const isSubmitting = ref(false)

// Validate form
function validateForm() {
  const newErrors = {}

  if (!formData.email) {
    newErrors.email = 'Email is required'
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    newErrors.email = 'Please enter a valid email address'
  }

  if (!formData.password) {
    newErrors.password = 'Password is required'
  } else if (formData.password.length < 6) {
    newErrors.password = 'Password must be at least 6 characters long'
  }

  errors.value = newErrors
  return Object.keys(newErrors).length === 0
}

// Handle form submission
async function handleSubmit() {
  if (!validateForm()) {
    return
  }

  isSubmitting.value = true
  userStore.clearError()

  try {
    const response = await userApi.login({
      email: formData.email,
      password: formData.password,
    })
    
    if (response.data.user) {
      // userStore.setUser(response.data.user)
      userStore.setToken(response.data.user.token)
      router.push('/profile')
    }
  } catch (error) {
    for (const [field, message] of Object.entries(error)) {
        errors.value[field] = message
      }
    userStore.setError(error.message || 'Login failed. Please check your credentials.')
  } finally {
    isSubmitting.value = false
  }
}

// Clear field error when user starts typing
function clearFieldError(field) {
  if (errors.value[field]) {
    delete errors.value[field]
  }
}
</script>

<template>
  <main class="min-h-screen flex justify-center items-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <div class="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
          <i class="fas fa-user text-blue-600 text-xl"></i>
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Welcome Back</h2>
        <p class="mt-2 text-center text-sm text-gray-600">Sign in to your account</p>
      </div>

      <form @submit.prevent="handleSubmit" class="mt-8 space-y-6">
        <!-- Display general error -->
        <div
          v-if="userStore.error"
          class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm"
        >
          <div class="flex">
            <i class="fas fa-exclamation-circle mt-0.5 mr-2"></i>
            <span>{{ userStore.error }}</span>
          </div>
        </div>

        <div class="space-y-4">
          <!-- Email field -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i class="fas fa-envelope text-gray-400"></i>
              </div>
              <input
                id="email"
                v-model="formData.email"
                @input="clearFieldError('email')"
                type="email"
                autocomplete="email"
                required
                :class="[
                  'appearance-none relative block w-full pl-10 px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition duration-200',
                  errors.email ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : '',
                ]"
                placeholder="Enter your email"
              />
            </div>
            <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
          </div>

          <!-- Password field -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i class="fas fa-lock text-gray-400"></i>
              </div>
              <input
                id="password"
                v-model="formData.password"
                @input="clearFieldError('password')"
                type="password"
                autocomplete="current-password"
                required
                :class="[
                  'appearance-none relative block w-full pl-10 px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition duration-200',
                  errors.password ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : '',
                ]"
                placeholder="Enter your password"
              />
            </div>
            <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
          </div>
        </div>

        <!-- Submit button -->
        <div>
          <button
            type="submit"
            :disabled="isSubmitting"
            :class="[
              'group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white transition duration-200',
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
            ]"
          >
            <span v-if="isSubmitting" class="absolute left-0 inset-y-0 flex items-center pl-3">
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
            {{ isSubmitting ? 'Signing in...' : 'Sign In' }}
          </button>
        </div>

        <!-- Forgot password link -->
        <div class="text-center">
          <p class="text-sm text-gray-600">
            <RouterLink
              to="/forgot-password"
              class="font-medium text-blue-600 hover:text-blue-500 transition duration-200"
            >
              Forgot your password?
            </RouterLink>
          </p>
        </div>

        <!-- Register link -->
        <div class="text-center">
          <p class="text-sm text-gray-600">
            Don't have an account?
            <RouterLink
              to="/register"
              class="font-medium text-blue-600 hover:text-blue-500 transition duration-200"
            >
              Create account
            </RouterLink>
          </p>
        </div>
      </form>
    </div>
  </main>
</template>

<style scoped></style>
