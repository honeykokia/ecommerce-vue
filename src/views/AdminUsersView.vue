<script setup>
import { ref, onMounted } from 'vue'
import { adminApi } from '../services/api.js'

const users = ref([])
const isLoading = ref(false)
const error = ref(null)
const selectedUser = ref(null)
const showStatusModal = ref(false)
const isUpdating = ref(false)

// Fetch users on component mount
onMounted(() => {
  fetchUsers()
})

// Fetch all users
async function fetchUsers() {
  isLoading.value = true
  error.value = null
  
  try {
    const response = await adminApi.getUsers()
    if (response.data && response.data.users) {
      users.value = response.data.users
    }
  } catch (err) {
    error.value = err.message || 'Failed to fetch users'
  } finally {
    isLoading.value = false
  }
}

// Open status update modal
function openStatusModal(user) {
  selectedUser.value = { ...user }
  showStatusModal.value = true
}

// Close status modal
function closeStatusModal() {
  selectedUser.value = null
  showStatusModal.value = false
}

// Update user status
async function updateUserStatus() {
  if (!selectedUser.value) return
  
  isUpdating.value = true
  
  try {
    await adminApi.updateUserStatus(selectedUser.value.id, {
      status: selectedUser.value.status
    })
    
    // Update local state
    const userIndex = users.value.findIndex(u => u.id === selectedUser.value.id)
    if (userIndex !== -1) {
      users.value[userIndex].status = selectedUser.value.status
    }
    
    closeStatusModal()
  } catch (err) {
    error.value = err.message || 'Failed to update user status'
  } finally {
    isUpdating.value = false
  }
}

// Get status badge color
function getStatusBadgeClass(status) {
  switch (status) {
    case 'ACTIVE':
      return 'bg-green-100 text-green-800'
    case 'INACTIVE':
      return 'bg-yellow-100 text-yellow-800'
    case 'BANNED':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// Format date
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString()
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
        <p class="text-gray-600">Manage user accounts and permissions</p>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
        <div class="flex">
          <i class="fas fa-exclamation-circle mt-0.5 mr-2"></i>
          <span>{{ error }}</span>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="mt-4 text-gray-600">Loading users...</p>
      </div>

      <!-- Users Table -->
      <div v-else class="bg-white shadow rounded-lg overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">All Users</h2>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <i class="fas fa-user text-blue-600"></i>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">
                        {{ user.name || 'Unknown' }}
                      </div>
                      <div class="text-sm text-gray-500">
                        {{ user.email }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="[
                      'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                      getStatusBadgeClass(user.status || 'ACTIVE')
                    ]"
                  >
                    {{ user.status || 'ACTIVE' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(user.createdAt || new Date()) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    @click="openStatusModal(user)"
                    class="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Edit Status
                  </button>
                </td>
              </tr>
              
              <!-- Empty State -->
              <tr v-if="users.length === 0">
                <td colspan="4" class="px-6 py-12 text-center text-gray-500">
                  <i class="fas fa-users text-4xl text-gray-300 mb-4 block"></i>
                  No users found
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- User Status Update Modal -->
      <div v-if="showStatusModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 max-w-md mx-4 w-full">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Update User Status</h3>
          
          <div class="mb-6">
            <div class="flex items-center mb-4">
              <div class="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <i class="fas fa-user text-blue-600"></i>
              </div>
              <div>
                <div class="text-sm font-medium text-gray-900">
                  {{ selectedUser?.name || 'Unknown' }}
                </div>
                <div class="text-sm text-gray-500">
                  {{ selectedUser?.email }}
                </div>
              </div>
            </div>

            <label class="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              v-model="selectedUser.status"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="BANNED">Banned</option>
            </select>
          </div>

          <div class="flex space-x-3">
            <button
              @click="updateUserStatus"
              :disabled="isUpdating"
              :class="[
                'flex-1 py-2 px-4 rounded-lg text-white font-medium transition duration-200',
                isUpdating
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              ]"
            >
              <span v-if="isUpdating" class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Updating...
              </span>
              <span v-else>Update Status</span>
            </button>
            <button
              @click="closeStatusModal"
              :disabled="isUpdating"
              class="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition duration-200 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>