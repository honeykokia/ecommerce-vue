<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { userApi } from '../services/api.js'

const router = useRouter()

// Form data
const formData = reactive({
  email: '',
})

// Form validation and state
const errors = ref({})
const isSubmitting = ref(false)
const isSuccess = ref(false)

// Validate form
function validateForm() {
  const newErrors = {}

  if (!formData.email) {
    newErrors.email = 'Email is required'
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    newErrors.email = 'Please enter a valid email address'
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
  errors.value = {}
  try {
    await userApi.forgotPassword({ email: formData.email })
    isSuccess.value = true
  } catch (error) {
    if (error.data && error.data.errors) {
      // Handle validation errors from the API
      errors.value = error.data.errors
    } else {
      errors.value.general = error.message || 'Failed to send reset email. Please try again.'
    }
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

// Go back to login
function goToLogin() {
  router.push('/login')
}
</script>

<template>
  <main class="min-h-screen flex justify-center items-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <div class="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
          <i class="fas fa-key text-blue-600 text-xl"></i>
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Forgot Password</h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Enter your email address and we'll send you a link to reset your password
        </p>
      </div>

      <!-- Success message -->
      <div
        v-if="isSuccess"
        class="bg-green-50 border border-green-200 text-green-800 px-4 py-6 rounded-md"
      >
        <div class="flex">
          <i class="fas fa-check-circle mt-0.5 mr-3 text-green-600"></i>
          <div>
            <h3 class="text-sm font-medium">Reset link sent!</h3>
            <p class="mt-1 text-sm">
              We've sent a password reset link to <strong>{{ formData.email }}</strong
              >. Please check your email and follow the instructions to reset your password.
            </p>
            <div class="mt-4">
              <button
                @click="goToLogin"
                class="text-sm text-green-700 hover:text-green-800 font-medium underline"
              >
                Return to login
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Form -->
      <form v-if="!isSuccess" @submit.prevent="handleSubmit" class="mt-8 space-y-6">
        <!-- Display general error -->
        <div
          v-if="errors.general"
          class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm"
        >
          <div class="flex">
            <i class="fas fa-exclamation-circle mt-0.5 mr-2"></i>
            <span>{{ errors.general }}</span>
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
                placeholder="Enter your email address"
              />
            </div>
            <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
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
            {{ isSubmitting ? 'Sending...' : 'Send Reset Link' }}
          </button>
        </div>

        <!-- Back to login link -->
        <div class="text-center">
          <p class="text-sm text-gray-600">
            Remember your password?
            <RouterLink
              to="/login"
              class="font-medium text-blue-600 hover:text-blue-500 transition duration-200"
            >
              Back to login
            </RouterLink>
          </p>
        </div>
      </form>
    </div>
  </main>
</template>

<style scoped></style>
