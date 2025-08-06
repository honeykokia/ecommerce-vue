<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useUserStore } from '../stores/user.js'
import { userApi } from '../services/api.js'

const userStore = useUserStore()

// Profile data
const profile = reactive({
  email: '',
  name: '',
  image: '/upload/defaultAvater.jpg',
  gender: 1,
  birthday: '',
  phone: '',
  city: '',
  country: '',
  address: '',
})

// Component state
const isEditing = ref(false)
const isLoading = ref(false)
const isSaving = ref(false)
const errors = ref({})
const originalProfile = ref({})

// Load user profile
async function loadProfile() {
  isLoading.value = true
  try {
    const response = await userApi.getProfile()
    if (response.data && response.data.user) {
      Object.assign(profile, response.data.user)
      originalProfile.value = { ...profile }
    }
  } catch (error) {
    userStore.setError(error.message || 'Failed to load profile')
  } finally {
    isLoading.value = false
  }
}

// Toggle edit mode
function toggleEdit() {
  if (isEditing.value) {
    // Cancel editing - restore original data
    Object.assign(profile, originalProfile.value)
    errors.value = {}
  }
  isEditing.value = !isEditing.value
}

// Validate form
function validateForm() {
  const newErrors = {}

  if (!profile.name || profile.name.trim().length === 0) {
    newErrors.name = 'Name is required'
  }

  if (!profile.email) {
    newErrors.email = 'Email is required'
  } else if (!/\S+@\S+\.\S+/.test(profile.email)) {
    newErrors.email = 'Please enter a valid email address'
  }

  if (profile.phone && !/^[0-9\-\+\s\(\)]{10,}$/.test(profile.phone)) {
    newErrors.phone = 'Please enter a valid phone number'
  }

  if (profile.birthday && new Date(profile.birthday) > new Date()) {
    newErrors.birthday = 'Birthday cannot be in the future'
  }

  errors.value = newErrors
  return Object.keys(newErrors).length === 0
}

// Save profile
async function saveProfile() {
  if (!validateForm()) {
    return
  }

  isSaving.value = true
  userStore.clearError()

  try {
    const response = await userApi.updateProfile(profile)

    // Update the original profile data
    originalProfile.value = { ...profile }
    userStore.setUser(profile)

    isEditing.value = false

    // Show success message (you might want to add a toast notification here)
    console.log('Profile updated successfully')
  } catch (error) {
    userStore.setError(error.message || 'Failed to update profile')
  } finally {
    isSaving.value = false
  }
}

// Clear field error
function clearFieldError(field) {
  if (errors.value[field]) {
    delete errors.value[field]
  }
}

// Format date for input
function formatDateForInput(dateString) {
  if (!dateString) return ''
  return new Date(dateString).toISOString().split('T')[0]
}

onMounted(() => {
  loadProfile()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="bg-white rounded-lg shadow-sm mb-6">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-2xl font-bold text-gray-900">My Profile</h1>
              <p class="text-sm text-gray-600 mt-1">Manage your account information</p>
            </div>
            <button
              @click="toggleEdit"
              :disabled="isLoading || isSaving"
              :class="[
                'px-4 py-2 text-sm font-medium rounded-lg transition duration-200',
                isEditing
                  ? 'bg-gray-600 hover:bg-gray-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white',
              ]"
            >
              <i :class="isEditing ? 'fas fa-times' : 'fas fa-edit'" class="mr-2"></i>
              {{ isEditing ? 'Cancel' : 'Edit Profile' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Loading state -->
      <div v-if="isLoading" class="bg-white rounded-lg shadow-sm p-8 text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">Loading profile...</p>
      </div>

      <!-- Error state -->
      <div
        v-else-if="userStore.error"
        class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6"
      >
        <div class="flex">
          <i class="fas fa-exclamation-circle mt-0.5 mr-2"></i>
          <span>{{ userStore.error }}</span>
        </div>
      </div>

      <!-- Profile content -->
      <div v-else class="bg-white rounded-lg shadow-sm">
        <form @submit.prevent="saveProfile" class="p-6">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Profile Image -->
            <div class="lg:col-span-2 flex items-center space-x-6">
              <div class="shrink-0">
                <img
                  :src="profile.image"
                  :alt="profile.name || 'Profile'"
                  class="h-20 w-20 rounded-full object-cover border-4 border-gray-200"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Profile Picture
                </label>
                <router-link
                  to="/profile/avatar"
                  class="inline-flex items-center px-4 py-2 border border-blue-300 text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
                >
                  <i class="fas fa-camera mr-2"></i>
                  Edit Avatar
                </router-link>
              </div>
            </div>

            <!-- Name -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"> Full Name </label>
              <input
                v-if="isEditing"
                v-model="profile.name"
                @input="clearFieldError('name')"
                type="text"
                :class="[
                  'block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm',
                  errors.name ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : '',
                ]"
                placeholder="Enter your full name"
              />
              <p v-else class="text-gray-900 py-2">{{ profile.name || 'Not provided' }}</p>
              <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
            </div>

            <!-- Email -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"> Email Address </label>
              <input
                v-if="isEditing"
                v-model="profile.email"
                @input="clearFieldError('email')"
                type="email"
                :class="[
                  'block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm',
                  errors.email ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : '',
                ]"
                placeholder="Enter your email"
              />
              <p v-else class="text-gray-900 py-2">{{ profile.email || 'Not provided' }}</p>
              <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
            </div>

            <!-- Gender -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"> Gender </label>
              <select
                v-if="isEditing"
                v-model="profile.gender"
                class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option :value="1">Male</option>
                <option :value="2">Female</option>
                <option :value="0">Other</option>
              </select>
              <p v-else class="text-gray-900 py-2">
                {{ profile.gender === 1 ? 'Male' : profile.gender === 2 ? 'Female' : 'Other' }}
              </p>
            </div>

            <!-- Birthday -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"> Birthday </label>
              <input
                v-if="isEditing"
                v-model="profile.birthday"
                @input="clearFieldError('birthday')"
                type="date"
                :max="new Date().toISOString().split('T')[0]"
                :class="[
                  'block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm',
                  errors.birthday ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : '',
                ]"
              />
              <p v-else class="text-gray-900 py-2">
                {{
                  profile.birthday
                    ? new Date(profile.birthday).toLocaleDateString()
                    : 'Not provided'
                }}
              </p>
              <p v-if="errors.birthday" class="mt-1 text-sm text-red-600">{{ errors.birthday }}</p>
            </div>

            <!-- Phone -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"> Phone Number </label>
              <input
                v-if="isEditing"
                v-model="profile.phone"
                @input="clearFieldError('phone')"
                type="tel"
                :class="[
                  'block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm',
                  errors.phone ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : '',
                ]"
                placeholder="Enter your phone number"
              />
              <p v-else class="text-gray-900 py-2">{{ profile.phone || 'Not provided' }}</p>
              <p v-if="errors.phone" class="mt-1 text-sm text-red-600">{{ errors.phone }}</p>
            </div>

            <!-- City -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"> City </label>
              <input
                v-if="isEditing"
                v-model="profile.city"
                type="text"
                class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter your city"
              />
              <p v-else class="text-gray-900 py-2">{{ profile.city || 'Not provided' }}</p>
            </div>

            <!-- Country -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"> Country/Region </label>
              <input
                v-if="isEditing"
                v-model="profile.country"
                type="text"
                class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter your country/region"
              />
              <p v-else class="text-gray-900 py-2">{{ profile.country || 'Not provided' }}</p>
            </div>

            <!-- Address -->
            <div class="lg:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2"> Address </label>
              <textarea
                v-if="isEditing"
                v-model="profile.address"
                rows="3"
                class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter your full address"
              ></textarea>
              <p v-else class="text-gray-900 py-2">{{ profile.address || 'Not provided' }}</p>
            </div>
          </div>

          <!-- Save button -->
          <div v-if="isEditing" class="mt-8 pt-6 border-t border-gray-200">
            <div class="flex justify-end space-x-4">
              <button
                type="button"
                @click="toggleEdit"
                class="px-6 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="isSaving"
                :class="[
                  'px-6 py-2 text-sm font-medium rounded-lg text-white transition duration-200',
                  isSaving
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
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
                  Saving...
                </span>
                <span v-else>Save Changes</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
