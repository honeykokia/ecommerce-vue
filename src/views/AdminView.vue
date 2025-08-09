<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div class="flex items-center">
            <h1 class="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-700">Welcome, {{ userStore.userName }}</span>
            <button
              @click="logout"
              class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Navigation Tabs -->
    <nav class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex space-x-8">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap',
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            {{ tab.name }}
          </button>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <!-- Users Management -->
      <div v-if="activeTab === 'users'" class="space-y-6">
        <div class="bg-white shadow rounded-lg">
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-lg font-medium text-gray-900">User Management</h2>
          </div>
          <div class="px-6 py-4">
            <div v-if="isLoading" class="text-center py-4">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
            <div v-else-if="users.length === 0" class="text-center py-8 text-gray-500">
              No users found
            </div>
            <div v-else class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="user in users" :key="user.id">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <span class="text-sm font-medium text-gray-700">{{ user.name?.charAt(0) || 'U' }}</span>
                        </div>
                        <div class="ml-4">
                          <div class="text-sm font-medium text-gray-900">{{ user.name || 'Unknown' }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ user.email }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span :class="[
                        'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                        user.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                        user.status === 'INACTIVE' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      ]">
                        {{ user.status || 'ACTIVE' }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <select
                        @change="updateUserStatus(user.id, $event.target.value)"
                        :value="user.status || 'ACTIVE'"
                        class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      >
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                        <option value="BANNED">Banned</option>
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Products Management -->
      <div v-if="activeTab === 'products'" class="space-y-6">
        <div class="bg-white shadow rounded-lg">
          <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 class="text-lg font-medium text-gray-900">Product Management</h2>
            <button
              @click="showProductForm = true; editingProduct = null"
              class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Add Product
            </button>
          </div>
          <div class="px-6 py-4">
            <div v-if="isLoading" class="text-center py-4">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
            <div v-else-if="products.length === 0" class="text-center py-8 text-gray-500">
              No products found
            </div>
            <div v-else class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="product in products" :key="product.id">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <img
                          :src="product.imageUrl || '/placeholder-product.jpg'"
                          :alt="product.name"
                          class="h-10 w-10 rounded object-cover"
                        >
                        <div class="ml-4">
                          <div class="text-sm font-medium text-gray-900">{{ product.name }}</div>
                          <div class="text-sm text-gray-500">{{ product.shortDescription }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${{ product.price }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ product.inStock }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        @click="editProduct(product)"
                        class="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </button>
                      <button
                        @click="deleteProduct(product.id)"
                        class="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Orders Management -->
      <div v-if="activeTab === 'orders'" class="space-y-6">
        <div class="bg-white shadow rounded-lg">
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-lg font-medium text-gray-900">Order Management</h2>
          </div>
          <div class="px-6 py-4">
            <div v-if="isLoading" class="text-center py-4">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
            <div v-else-if="orders.length === 0" class="text-center py-8 text-gray-500">
              No orders found
            </div>
            <div v-else class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order #</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="order in orders" :key="order.id">
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {{ order.orderNumber }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      User #{{ order.userId }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${{ order.totalPrice }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span :class="[
                        'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                        order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                        order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'PAID' ? 'bg-purple-100 text-purple-800' :
                        'bg-red-100 text-red-800'
                      ]">
                        {{ order.status }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ formatDate(order.createAt) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <select
                        @change="updateOrderStatus(order.id, $event.target.value)"
                        :value="order.status"
                        class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      >
                        <option value="PENDING">Pending</option>
                        <option value="PAID">Paid</option>
                        <option value="SHIPPED">Shipped</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="CANCELED">Canceled</option>
                      </select>
                      <button
                        @click="deleteOrder(order.id)"
                        class="text-red-600 hover:text-red-900 ml-2"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Product Form Modal -->
    <div v-if="showProductForm" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ editingProduct ? 'Edit Product' : 'Add New Product' }}
          </h3>
          <form @submit.prevent="saveProduct" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Name</label>
              <input
                v-model="productForm.name"
                type="text"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Price</label>
              <input
                v-model.number="productForm.price"
                type="number"
                min="0"
                step="0.01"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Stock</label>
              <input
                v-model.number="productForm.inStock"
                type="number"
                min="0"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Short Description</label>
              <textarea
                v-model="productForm.shortDescription"
                rows="3"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              ></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Image URL</label>
              <input
                v-model="productForm.imageUrl"
                type="url"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
            </div>
            <div class="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                @click="showProductForm = false"
                class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700"
              >
                {{ editingProduct ? 'Update' : 'Create' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { adminApi } from '@/services/api'
import { mockUsers, mockProducts, mockOrders } from '@/services/mockData'

const router = useRouter()
const userStore = useUserStore()

// Reactive state
const activeTab = ref('users')
const isLoading = ref(false)
const users = ref([])
const products = ref([])
const orders = ref([])
const showProductForm = ref(false)
const editingProduct = ref(null)

// Tab configuration
const tabs = [
  { id: 'users', name: 'Users' },
  { id: 'products', name: 'Products' },
  { id: 'orders', name: 'Orders' }
]

// Product form
const productForm = reactive({
  name: '',
  price: 0,
  inStock: 0,
  shortDescription: '',
  imageUrl: '',
  categoryId: 1 // Default category
})

// Methods
const logout = () => {
  userStore.logout()
  router.push('/login')
}

const loadUsers = async () => {
  try {
    isLoading.value = true
    const response = await adminApi.getUsers()
    if (response.data && response.data.users) {
      users.value = response.data.users
    }
  } catch (error) {
    console.error('Failed to load users:', error)
    // Use mock data when API is not available
    users.value = mockUsers
  } finally {
    isLoading.value = false
  }
}

const loadProducts = async () => {
  try {
    isLoading.value = true
    const response = await adminApi.getProducts()
    if (response.data && response.data.products) {
      products.value = response.data.products
    }
  } catch (error) {
    console.error('Failed to load products:', error)
    // Use mock data when API is not available
    products.value = mockProducts
  } finally {
    isLoading.value = false
  }
}

const loadOrders = async () => {
  try {
    isLoading.value = true
    const response = await adminApi.getOrders()
    if (response.data && response.data.orders) {
      orders.value = response.data.orders
    }
  } catch (error) {
    console.error('Failed to load orders:', error)
    // Use mock data when API is not available
    orders.value = mockOrders
  } finally {
    isLoading.value = false
  }
}

const updateUserStatus = async (userId, status) => {
  try {
    await adminApi.updateUserStatus(userId, { status })
    // Update local state
    const user = users.value.find(u => u.id === userId)
    if (user) {
      user.status = status
    }
  } catch (error) {
    console.error('Failed to update user status:', error)
  }
}

const editProduct = (product) => {
  editingProduct.value = product
  Object.assign(productForm, product)
  showProductForm.value = true
}

const saveProduct = async () => {
  try {
    if (editingProduct.value) {
      // Update existing product
      await adminApi.updateProduct(editingProduct.value.id, productForm)
      const index = products.value.findIndex(p => p.id === editingProduct.value.id)
      if (index !== -1) {
        products.value[index] = { ...editingProduct.value, ...productForm }
      }
    } else {
      // Create new product
      const response = await adminApi.createProduct(productForm)
      if (response.data && response.data.product) {
        products.value.push(response.data.product)
      }
    }
    showProductForm.value = false
    resetProductForm()
  } catch (error) {
    console.error('Failed to save product:', error)
  }
}

const deleteProduct = async (productId) => {
  if (confirm('Are you sure you want to delete this product?')) {
    try {
      await adminApi.deleteProduct(productId)
      products.value = products.value.filter(p => p.id !== productId)
    } catch (error) {
      console.error('Failed to delete product:', error)
    }
  }
}

const updateOrderStatus = async (orderId, status) => {
  try {
    await adminApi.updateOrderStatus(orderId, { status })
    // Update local state
    const order = orders.value.find(o => o.id === orderId)
    if (order) {
      order.status = status
    }
  } catch (error) {
    console.error('Failed to update order status:', error)
  }
}

const deleteOrder = async (orderId) => {
  if (confirm('Are you sure you want to delete this order?')) {
    try {
      await adminApi.deleteOrder(orderId)
      orders.value = orders.value.filter(o => o.id !== orderId)
    } catch (error) {
      console.error('Failed to delete order:', error)
    }
  }
}

const resetProductForm = () => {
  Object.assign(productForm, {
    name: '',
    price: 0,
    inStock: 0,
    shortDescription: '',
    imageUrl: '',
    categoryId: 1
  })
  editingProduct.value = null
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString()
}

// Load data when tab changes
const loadData = () => {
  if (activeTab.value === 'users') {
    loadUsers()
  } else if (activeTab.value === 'products') {
    loadProducts()
  } else if (activeTab.value === 'orders') {
    loadOrders()
  }
}

// Watch for tab changes
const originalActiveTab = activeTab.value
watch(() => activeTab.value, loadData)

// Load initial data
onMounted(() => {
  loadData()
})
</script>