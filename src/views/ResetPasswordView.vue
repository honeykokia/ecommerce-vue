<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { userApi } from '../services/api.js'

const route = useRoute()
const router = useRouter()

// Form data
const formData = reactive({
  newPassword: '',
  confirmPassword: '',
})

// Form validation and state
const errors = ref({})
const isSubmitting = ref(false)
const isSuccess = ref(false)
const tokenValid = ref(true)
const token = ref('')

// Password visibility toggles
const showPassword = ref(false)
const showConfirmPassword = ref(false)

// Get token from URL on mount
onMounted(() => {
  token.value = route.params.token || route.query.token || ''
  if (!token.value) {
    tokenValid.value = false
    errors.value.general = 'Invalid or missing reset token. Please request a new password reset.'
  }
})

// Validate form
function validateForm() {
  const newErrors = {}

  if (!formData.password) {
    newErrors.password = 'Password is required'
  } else if (formData.password.length < 8) {
    newErrors.password = 'Password must be at least 8 characters long'
  } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
    newErrors.password =
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
  }

  if (!formData.confirmPassword) {
    newErrors.confirmPassword = 'Please confirm your password'
  } else if (formData.password !== formData.confirmPassword) {
    newErrors.confirmPassword = 'Passwords do not match'
  }

  errors.value = newErrors
  return Object.keys(newErrors).length === 0
}

// Handle form submission
async function handleSubmit() {
  if (!validateForm() || !tokenValid.value) {
    return
  }

  isSubmitting.value = true
  errors.value = {}

  try {
    await userApi.resetPassword({
      token: token.value,
      newPassword: formData.password,
      confirmPassword: formData.confirmPassword,
    })
    isSuccess.value = true
  } catch (error) {
    if (error.data && error.data.errors) {
      // Handle validation errors from the API
      errors.value = error.data.errors
    } else {
      errors.value.general =
        error.message || 'Failed to reset password. The reset link may have expired.'
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

// Go to login
function goToLogin() {
  router.push('/login')
}

// Toggle password visibility
function togglePasswordVisibility(field) {
  if (field === 'password') {
    showPassword.value = !showPassword.value
  } else if (field === 'confirmPassword') {
    showConfirmPassword.value = !showConfirmPassword.value
  }
}
</script>

<template>
  <main class="min-h-screen flex justify-center items-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <div class="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-green-100">
          <i class="fas fa-shield-alt text-green-600 text-xl"></i>
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Reset Password</h2>
        <p class="mt-2 text-center text-sm text-gray-600">Enter your new password below</p>
      </div>

      <!-- Success message -->
      <div
        v-if="isSuccess"
        class="bg-green-50 border border-green-200 text-green-800 px-4 py-6 rounded-md"
      >
        <div class="flex">
          <i class="fas fa-check-circle mt-0.5 mr-3 text-green-600"></i>
          <div>
            <h3 class="text-sm font-medium">Password reset successful!</h3>
            <p class="mt-1 text-sm">
              Your password has been successfully updated. You can now log in with your new
              password.
            </p>
            <div class="mt-4">
              <button
                @click="goToLogin"
                class="text-sm bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium transition duration-200"
              >
                Go to Login
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Invalid token message -->
      <div
        v-if="!tokenValid"
        class="bg-red-50 border border-red-200 text-red-800 px-4 py-6 rounded-md"
      >
        <div class="flex">
          <i class="fas fa-exclamation-triangle mt-0.5 mr-3 text-red-600"></i>
          <div>
            <h3 class="text-sm font-medium">Invalid Reset Link</h3>
            <p class="mt-1 text-sm">
              This password reset link is invalid or has expired. Please request a new password
              reset.
            </p>
            <div class="mt-4 space-x-3">
              <RouterLink
                to="/forgot-password"
                class="text-sm bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium transition duration-200 inline-block"
              >
                Request New Reset
              </RouterLink>
              <button
                @click="goToLogin"
                class="text-sm text-red-700 hover:text-red-800 font-medium underline"
              >
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Form -->
      <form v-if="!isSuccess && tokenValid" @submit.prevent="handleSubmit" class="mt-8 space-y-6">
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
          <!-- Password field -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i class="fas fa-lock text-gray-400"></i>
              </div>
              <input
                id="password"
                v-model="formData.password"
                @input="clearFieldError('password')"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="new-password"
                required
                :class="[
                  'appearance-none relative block w-full pl-10 pr-10 px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition duration-200',
                  errors.password ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : '',
                ]"
                placeholder="Enter your new password"
              />
              <button
                type="button"
                @click="togglePasswordVisibility('password')"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <i
                  :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"
                  class="text-gray-400 hover:text-gray-600"
                ></i>
              </button>
            </div>
            <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
            <p class="mt-1 text-xs text-gray-500">
              Password must be at least 8 characters and contain uppercase, lowercase, and numbers.
            </p>
          </div>

          <!-- Confirm Password field -->
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i class="fas fa-lock text-gray-400"></i>
              </div>
              <input
                id="confirmPassword"
                v-model="formData.confirmPassword"
                @input="clearFieldError('confirmPassword')"
                :type="showConfirmPassword ? 'text' : 'password'"
                autocomplete="new-password"
                required
                :class="[
                  'appearance-none relative block w-full pl-10 pr-10 px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition duration-200',
                  errors.confirmPassword
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : '',
                ]"
                placeholder="Confirm your new password"
              />
              <button
                type="button"
                @click="togglePasswordVisibility('confirmPassword')"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <i
                  :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"
                  class="text-gray-400 hover:text-gray-600"
                ></i>
              </button>
            </div>
            <p v-if="errors.confirmPassword" class="mt-1 text-sm text-red-600">
              {{ errors.confirmPassword }}
            </p>
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
            {{ isSubmitting ? 'Resetting...' : 'Reset Password' }}
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
