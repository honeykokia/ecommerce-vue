<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user.js'
import { userApi } from '../services/api.js'

const router = useRouter()
const userStore = useUserStore()

// Component state
const isLoading = ref(false)
const isSaving = ref(false)
const profile = reactive({
  image: '/upload/defaultAvater.jpg',
})

// File upload state
const selectedFile = ref(null)
const previewUrl = ref('')
const fileInput = ref(null)

// Load current user profile to get current avatar
async function loadProfile() {
  isLoading.value = true
  try {
    const response = await userApi.getProfile()
    if (response.data && response.data.user) {
      profile.image = response.data.user.image || '/upload/defaultAvater.jpg'
    }
  } catch (error) {
    userStore.setError(error.message || 'Failed to load profile')
  } finally {
    isLoading.value = false
  }
}

// Handle file selection
function handleFileSelect(event) {
  const file = event.target.files[0]
  if (file) {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      userStore.setError('Please select a valid image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      userStore.setError('Image size must be less than 5MB')
      return
    }

    selectedFile.value = file

    // Create preview URL
    const reader = new FileReader()
    reader.onload = (e) => {
      previewUrl.value = e.target.result
    }
    reader.readAsDataURL(file)

    userStore.clearError()
  }
}

// Upload avatar
async function uploadAvatar() {
  if (!selectedFile.value) {
    userStore.setError('Please select an image file')
    return
  }

  isSaving.value = true
  userStore.clearError()

  try {
    // Create FormData for file upload
    const formData = new FormData()
    formData.append('avatar', selectedFile.value)

    const response = await userApi.updateAvatar(formData)

    // Update user store with new avatar
    if (response.user && response.user.image) {
      profile.image = response.user.image
      userStore.setUser(response.user)
    }

    // Success message and redirect
    console.log('Avatar updated successfully')
    router.push('/profile')
  } catch (error) {
    userStore.setError(error.message || 'Failed to update avatar')
  } finally {
    isSaving.value = false
  }
}

// Trigger file input
function triggerFileInput() {
  fileInput.value?.click()
}

// Cancel and go back
function cancel() {
  router.back()
}

onMounted(() => {
  loadProfile()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="bg-white rounded-lg shadow-sm mb-6">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-2xl font-bold text-gray-900">Edit Avatar</h1>
              <p class="text-sm text-gray-600 mt-1">Update your profile picture</p>
            </div>
            <button
              @click="cancel"
              class="px-4 py-2 text-sm font-medium rounded-lg bg-gray-600 hover:bg-gray-700 text-white transition duration-200"
            >
              <i class="fas fa-arrow-left mr-2"></i>
              Back to Profile
            </button>
          </div>
        </div>
      </div>

      <!-- Loading state -->
      <div v-if="isLoading" class="bg-white rounded-lg shadow-sm p-8 text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">Loading current avatar...</p>
      </div>

      <!-- Error state -->
      <div
        v-if="userStore.error"
        class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6"
      >
        <div class="flex">
          <i class="fas fa-exclamation-circle mt-0.5 mr-2"></i>
          <span>{{ userStore.error }}</span>
        </div>
      </div>

      <!-- Avatar edit content -->
      <div v-if="!isLoading" class="bg-white rounded-lg shadow-sm p-6">
        <div class="space-y-6">
          <!-- Current Avatar -->
          <div class="text-center">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Current Avatar</h3>
            <img
              :src="profile.image"
              alt="Current avatar"
              class="h-32 w-32 rounded-full object-cover border-4 border-gray-200 mx-auto"
            />
          </div>

          <!-- File Upload -->
          <div class="text-center">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Upload New Avatar</h3>

            <!-- Hidden file input -->
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              @change="handleFileSelect"
              class="hidden"
            />

            <!-- Upload button -->
            <button
              @click="triggerFileInput"
              class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200"
            >
              <i class="fas fa-upload mr-2"></i>
              Choose Image
            </button>

            <p class="text-sm text-gray-500 mt-2">
              Supported formats: JPG, PNG, GIF. Max size: 5MB
            </p>
          </div>

          <!-- Preview -->
          <div v-if="previewUrl" class="text-center">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Preview</h3>
            <img
              :src="previewUrl"
              alt="Avatar preview"
              class="h-32 w-32 rounded-full object-cover border-4 border-green-200 mx-auto"
            />
          </div>

          <!-- Selected file info -->
          <div v-if="selectedFile" class="bg-gray-50 rounded-lg p-4">
            <h4 class="text-sm font-medium text-gray-900 mb-2">Selected File:</h4>
            <div class="text-sm text-gray-600">
              <p><strong>Name:</strong> {{ selectedFile.name }}</p>
              <p><strong>Size:</strong> {{ (selectedFile.size / 1024 / 1024).toFixed(2) }} MB</p>
              <p><strong>Type:</strong> {{ selectedFile.type }}</p>
            </div>
          </div>

          <!-- Action buttons -->
          <div class="flex justify-center space-x-4 pt-6">
            <button
              @click="cancel"
              class="px-6 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
            >
              Cancel
            </button>
            <button
              @click="uploadAvatar"
              :disabled="!selectedFile || isSaving"
              :class="[
                'px-6 py-2 text-sm font-medium rounded-lg text-white transition duration-200',
                !selectedFile || isSaving
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500',
              ]"
            >
              <span v-if="isSaving" class="flex items-center">
                <svg
                  class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                Uploading...
              </span>
              <span v-else>
                <i class="fas fa-save mr-2"></i>
                Update Avatar
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
