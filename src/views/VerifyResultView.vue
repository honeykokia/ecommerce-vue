<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { userApi } from '../services/api.js'

const route = useRoute()
const router = useRouter()

const isLoading = ref(true)
const isSuccess = ref(false)
const errorMessage = ref('')

// Extract token from URL query parameter
const token = route.query.token

onMounted(async () => {
  if (!token) {
    errorMessage.value = 'Invalid verification link. No token provided.'
    isLoading.value = false
    return
  }

  try {
    const response = await userApi.verifyToken(token)

    if (response.data) {
      isSuccess.value = true
    } else {
      errorMessage.value = 'Verification failed. Please try again.'
    }
  } catch (error) {
    // Handle HTTP 400 and other errors
    if (error.response?.status === 400 && error.response?.data?.errors) {
      // Extract error messages from the response
      const errors = error.response.data.errors
      if (typeof errors === 'object') {
        errorMessage.value = Object.values(errors).join(', ')
      } else {
        errorMessage.value = errors
      }
    } else {
      errorMessage.value = 'Verification failed. The link may be expired or invalid.'
    }
  } finally {
    isLoading.value = false
  }
})

function goToLogin() {
  router.push('/login')
}

function goToEmailVerify() {
  router.push('/email-verify')
}
</script>

<template>
  <main class="min-h-screen flex justify-center items-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Loading state -->
      <div v-if="isLoading" class="text-center">
        <div class="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
          <svg
            class="animate-spin h-8 w-8 text-blue-600"
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
        </div>
        <h2 class="mt-6 text-center text-2xl font-bold text-gray-900">Verifying your email...</h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Please wait while we verify your account.
        </p>
      </div>

      <!-- Success state -->
      <div v-else-if="isSuccess" class="text-center">
        <div class="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-green-100">
          <i class="fas fa-check text-green-600 text-xl"></i>
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Email Verified!</h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Your email has been successfully verified. You can now sign in to your account.
        </p>

        <div class="mt-8">
          <button
            @click="goToLogin"
            class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-200"
          >
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <i class="fas fa-sign-in-alt text-green-500 group-hover:text-green-400"></i>
            </span>
            Go to Login
          </button>
        </div>
      </div>

      <!-- Error state -->
      <div v-else class="text-center">
        <div class="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-red-100">
          <i class="fas fa-exclamation-triangle text-red-600 text-xl"></i>
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Verification Failed</h2>
        <div class="mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
          <div class="flex">
            <i class="fas fa-exclamation-circle mt-0.5 mr-2"></i>
            <span>{{ errorMessage }}</span>
          </div>
        </div>

        <div class="mt-8 space-y-3">
          <button
            @click="goToEmailVerify"
            class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
          >
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <i class="fas fa-envelope text-blue-500 group-hover:text-blue-400"></i>
            </span>
            Request New Verification Email
          </button>

          <button
            @click="goToLogin"
            class="group relative w-full flex justify-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped></style>
