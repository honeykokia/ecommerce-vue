<template>
  <main class="flex justify-center items-center h-screen">
    <div class="container bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            v-model="form.email"
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            id="password"
            v-model="form.password"
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label for="confirm-password" class="block text-sm font-medium text-gray-700"
            >Confirm Password</label
          >
          <input
            type="password"
            id="confirm-password"
            v-model="form.confirmPassword"
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <button
          type="submit"
          class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring focus:ring-blue-300 transition duration-200"
        >
          Register
        </button>
      </form>
      <p class="mt-4 text-center text-sm text-gray-600">
        Already have an account?
        <router-link to="/login" class="text-blue-500 hover:underline">Login here</router-link>.
      </p>
    </div>
  </main>
</template>

<script setup>
import { reactive } from 'vue'

const form = reactive({
  email: '',
  password: '',
  confirmPassword: '',
})

const handleSubmit = () => {
  // Handle registration logic here
  if (form.password !== form.confirmPassword) {
    alert('Passwords do not match!')
    return
  }
  console.log('Register form submitted:', form)
}
</script>
