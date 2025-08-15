<script setup>
// This component redirects to the actual PaymentResultView
// as specified in the requirements
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
  // Redirect to the actual payment result view
  router.replace('/payment/result')
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="text-center">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
      <p class="text-gray-600">Redirecting to payment verification...</p>
    </div>
  </div>
</template>