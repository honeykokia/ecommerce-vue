<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { adminApi } from '@/services/api'
import { mockUsers, mockProducts, mockOrders } from '@/services/mockData'

const api = import.meta.env.VITE_API_URL
const router = useRouter()
const userStore = useUserStore()

// Reactive state
const activeTab = ref('users')
const isLoading = ref(false)
const users = ref([])
const products = ref([])
const categories = ref([])
const promotions = ref([])
const orders = ref([])
const tags = ref([])
const showProductForm = ref(false)
const showCategoryForm = ref(false)
const showPromotionForm = ref(false)
const showTagForm = ref(false)
const editingProduct = ref(null)
const editingCategory = ref(null)
const editingPromotion = ref(null)
const editingTag = ref(null)
const selectedImageFile = ref(null)
const imagePreview = ref(null)

// Tab configuration
const tabs = [
  { id: 'users', name: 'Users' },
  { id: 'products', name: 'Products' },
  { id: 'categories', name: 'Categories' },
  { id: 'promotions', name: 'Promotions' },
  { id: 'tags', name: 'Tags' },
  { id: 'orders', name: 'Orders' },
]

// Product form
const productForm = reactive({
  name: '',
  price: 0,
  inStock: 0,
  shortDescription: '',
  imageURL: '',
  rating: 0,
  categoryId: null, 
  promotionId: null,
})

// Category form
const categoryForm = reactive({
  name: '',
  description: '',
})

// Promotion form
const promotionForm = reactive({
  name: '',
  description: '',
  discountPercentage: 0,
  startDate: '',
  endDate: '',
  isActive: true,
})

// Tag form
const tagForm = reactive({
  id: '',
  name: '',
  description: '',
  color: '#3B82F6',
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

const loadCategories = async () => {
  try {
    isLoading.value = true
    const response = await adminApi.getCategories()
    if (response.data && response.data.categories) {
      categories.value = response.data.categories
    }
  } catch (error) {
    console.error('Failed to load categories:', error)
    // Use mock data when API is not available
    categories.value = []
  } finally {
    isLoading.value = false
  }
}

const loadPromotions = async () => {
  try {
    isLoading.value = true
    const response = await adminApi.getPromotions()
    if (response.data && response.data.promotions) {
      promotions.value = response.data.promotions
    }
  } catch (error) {
    console.error('Failed to load promotions:', error)
    // Use mock data when API is not available
    promotions.value = []
  } finally {
    isLoading.value = false
  }
}

const loadTags = async () => {
  try {
    isLoading.value = true
    const response = await adminApi.getTags()
    if (response.data && response.data.tags) {
      tags.value = response.data.tags
    }
  } catch (error) {
    console.error('Failed to load tags:', error)
    // Use mock data when API is not available
    tags.value = []
  } finally {
    isLoading.value = false
  }
}

const updateUserStatus = async (userId, status) => {
  try {
    await adminApi.updateUserStatus(userId, { status })
    // Update local state
    const user = users.value.find((u) => u.id === userId)
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
  selectedImageFile.value = null
  imagePreview.value = product.imageURL ? `${import.meta.env.VITE_API_URL}${product.imageURL}` : null
}

const saveProduct = async () => {
  try {
    // Handle image upload if a file was selected
    if (selectedImageFile.value) {
      const imageURL = await uploadImageFile(selectedImageFile.value)
      productForm.imageURL = imageURL
    }
    
    if (editingProduct.value) {
      // Update existing product
      await adminApi.updateProduct(editingProduct.value.id, productForm)
      const index = products.value.findIndex((p) => p.id === editingProduct.value.id)
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
      products.value = products.value.filter((p) => p.id !== productId)
    } catch (error) {
      console.error('Failed to delete product:', error)
    }
  }
}

const updateOrderStatus = async (orderId, status) => {
  try {
    await adminApi.updateOrderStatus(orderId, { status })
    // Update local state
    const order = orders.value.find((o) => o.id === orderId)
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
      orders.value = orders.value.filter((o) => o.id !== orderId)
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
    imageURL: '',
    rating: 0,
    categoryId: null,
    promotionId: null,
  })
  editingProduct.value = null
  selectedImageFile.value = null
  imagePreview.value = null
}

const handleImageFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    selectedImageFile.value = file
    
    // Create image preview
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const uploadImageFile = async (file) => {
  try {
    const formData = new FormData()
    formData.append('image', file)
    
    // Upload image to server - you may need to adjust this endpoint
    const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/upload/image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    })
    
    if (!response.ok) {
      throw new Error('Failed to upload image')
    }
    
    const result = await response.json()
    return result.imageURL || result.url // Adjust based on your API response
  } catch (error) {
    console.error('Image upload failed:', error)
    // Fallback: return data URL for preview
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target.result)
      reader.readAsDataURL(file)
    })
  }
}

const resetCategoryForm = () => {
  Object.assign(categoryForm, {
    name: '',
    description: '',
  })
  editingCategory.value = null
}

const resetPromotionForm = () => {
  Object.assign(promotionForm, {
    name: '',
    description: '',
    discountType: '',
    discountValue: 0,
    startDate: '',
    endDate: '',
    isActive: true,
  })
  editingPromotion.value = null
}

const resetTagForm = () => {
  Object.assign(tagForm, {
    id: '',
    name: '',
    description: '',
    color: '#3B82F6',
  })
  editingTag.value = null
}

const editCategory = (category) => {
  editingCategory.value = category
  Object.assign(categoryForm, category)
  showCategoryForm.value = true
}

const saveCategory = async () => {
  try {
    if (editingCategory.value) {
      // Update existing category
      await adminApi.updateCategory(editingCategory.value.id, categoryForm)
      const index = categories.value.findIndex((c) => c.id === editingCategory.value.id)
      if (index !== -1) {
        categories.value[index] = { ...editingCategory.value, ...categoryForm }
      }
    } else {
      // Create new category
      const response = await adminApi.createCategory(categoryForm)
      if (response.data && response.data.category) {
        categories.value.push(response.data.category)
      }
    }
    showCategoryForm.value = false
    resetCategoryForm()
    loadCategories()
  } catch (error) {
    console.error('Failed to save category:', error)
  }
}

const deleteCategory = async (categoryId) => {
  if (confirm('Are you sure you want to delete this category?')) {
    try {
      await adminApi.deleteCategory(categoryId)
      categories.value = categories.value.filter((c) => c.id !== categoryId)
    } catch (error) {
      console.error('Failed to delete category:', error)
    }
  }
}

const editPromotion = (promotion) => {
  editingPromotion.value = promotion
  Object.assign(promotionForm, promotion)
  showPromotionForm.value = true
}

const savePromotion = async () => {
  try {
    if (editingPromotion.value) {
      // Update existing promotion
      await adminApi.updatePromotion(editingPromotion.value.id, promotionForm)
      const index = promotions.value.findIndex((p) => p.id === editingPromotion.value.id)
      if (index !== -1) {
        promotions.value[index] = { ...editingPromotion.value, ...promotionForm }
      }
    } else {
      // Create new promotion
      const response = await adminApi.createPromotion(promotionForm)
      if (response.data && response.data.promotion) {
        promotions.value.push(response.data.promotion)
      }
    }
    showPromotionForm.value = false
    resetPromotionForm()
    loadPromotions()
  } catch (error) {
    console.error('Failed to save promotion:', error)
  }
}

const deletePromotion = async (promotionId) => {
  if (confirm('Are you sure you want to delete this promotion?')) {
    try {
      await adminApi.deletePromotion(promotionId)
      promotions.value = promotions.value.filter((p) => p.id !== promotionId)
    } catch (error) {
      console.error('Failed to delete promotion:', error)
    }
  }
}

const editTag = (tag) => {
  editingTag.value = tag
  Object.assign(tagForm, tag)
  showTagForm.value = true
}

const saveTag = async () => {
  try {
    if (editingTag.value) {
      // Update existing tag
      await adminApi.updateTag(editingTag.value.id, tagForm)
      const index = tags.value.findIndex((t) => t.id === editingTag.value.id)
      if (index !== -1) {
        tags.value[index] = { ...editingTag.value, ...tagForm }
      }
    } else {
      // Create new tag
      const response = await adminApi.createTag(tagForm.id, tagForm)
      if (response.data && response.data.tag) {
        tags.value.push(response.data.tag)
      }
    }
    showTagForm.value = false
    resetTagForm()
    loadTags()
  } catch (error) {
    console.error('Failed to save tag:', error)
  }
}

const deleteTag = async (tagId) => {
  if (confirm('Are you sure you want to delete this tag?')) {
    try {
      await adminApi.deleteTag(tagId)
      tags.value = tags.value.filter((t) => t.id !== tagId)
    } catch (error) {
      console.error('Failed to delete tag:', error)
    }
  }
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
    loadCategories() // Load categories for product form
    loadPromotions() // Load promotions for product form
  } else if (activeTab.value === 'categories') {
    loadCategories()
  } else if (activeTab.value === 'promotions') {
    loadPromotions()
  } else if (activeTab.value === 'tags') {
    loadTags()
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
            <!-- <span class="text-sm text-gray-700">Welcome, {{ userStore.userEmail }}</span> -->
            <!-- <button
              @click="logout"
              class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Logout
            </button> -->
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
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
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
              <div
                class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
              ></div>
            </div>
            <div v-else-if="users.length === 0" class="text-center py-8 text-gray-500">
              No users found
            </div>
            <div v-else class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      User
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Email
                    </th>
                                        <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      ROLE
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="user in users" :key="user.id">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div
                          class="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center"
                        >
                          <span class="text-sm font-medium text-gray-700">{{
                            user.name?.charAt(0) || 'U'
                          }}</span>
                        </div>
                        <div class="ml-4">
                          <div class="text-sm font-medium text-gray-900">
                            {{ user.name || 'Unknown' }}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ user.email }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span
                        :class="[
                          'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                          user.role === 'USER'
                            ? 'bg-green-100 text-green-800'
                            : user.role === 'ADMIN'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800',
                        ]"
                      >
                        {{ user.role || 'None' }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span
                        :class="[
                          'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                          user.status === 'ACTIVE'
                            ? 'bg-green-100 text-green-800'
                            : user.status === 'INACTIVE'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800',
                        ]"
                      >
                        {{ user.status || 'ACTIVE' }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <select
                        v-model="user.status"
                        @change="updateUserStatus(user.id, user.status)"
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
              <div
                class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
              ></div>
            </div>
            <div v-else-if="products.length === 0" class="text-center py-8 text-gray-500">
              No products found
            </div>
            <div v-else class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Product
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Price
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Stock
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Category
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="product in products" :key="product.id">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <img
                          :src="`${api}${product.imageURL || '/placeholder-product.jpg'}`"
                          :alt="product.name"
                          class="h-10 w-10 rounded object-cover"
                        />
                        <div class="ml-4">
                          <div class="text-sm font-medium text-gray-900">{{ product.name }}</div>
                          <div class="text-sm text-gray-500">{{ product.shortDescription }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${{ product.originalPrice }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ product.inStock }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ categories.find(c => c.id === product.categoryId)?.name || 'N/A' }}
                    </td>
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

      <!-- Categories Management -->
      <div v-if="activeTab === 'categories'" class="space-y-6">
        <div class="bg-white shadow rounded-lg">
          <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 class="text-lg font-medium text-gray-900">Category Management</h2>
            <button
              @click="showCategoryForm = true; editingCategory = null"
              class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Add Category
            </button>
          </div>
          <div class="px-6 py-4">
            <div v-if="isLoading" class="text-center py-4">
              <div
                class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
              ></div>
            </div>
            <div v-else-if="categories.length === 0" class="text-center py-8 text-gray-500">
              No categories found
            </div>
            <div v-else class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Name
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Description
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="category in categories" :key="category.id">
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {{ category.name }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ category.description }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        @click="editCategory(category)"
                        class="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </button>
                      <button
                        @click="deleteCategory(category.id)"
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

      <!-- Promotions Management -->
      <div v-if="activeTab === 'promotions'" class="space-y-6">
        <div class="bg-white shadow rounded-lg">
          <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 class="text-lg font-medium text-gray-900">Promotion Management</h2>
            <button
              @click="showPromotionForm = true; editingPromotion = null"
              class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Add Promotion
            </button>
          </div>
          <div class="px-6 py-4">
            <div v-if="isLoading" class="text-center py-4">
              <div
                class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
              ></div>
            </div>
            <div v-else-if="promotions.length === 0" class="text-center py-8 text-gray-500">
              No promotions found
            </div>
            <div v-else class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Name
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Discount
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Type
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Start Date
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      End Date
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="promotion in promotions" :key="promotion.id">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm font-medium text-gray-900">{{ promotion.name }}</div>
                      <div class="text-sm text-gray-500">{{ promotion.description }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ promotion.discountValue }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ promotion.discountType === 'PERCENTAGE'? '%' : '$' }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ formatDate(promotion.startDate) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ formatDate(promotion.endDate) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span
                        :class="[
                          'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                          promotion.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800',
                        ]"
                      >
                        {{ promotion.isActive ? 'Active' : 'Inactive' }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        @click="editPromotion(promotion)"
                        class="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </button>
                      <button
                        @click="deletePromotion(promotion.id)"
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

      <!-- Tags Management -->
      <div v-if="activeTab === 'tags'" class="space-y-6">
        <div class="bg-white shadow rounded-lg">
          <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 class="text-lg font-medium text-gray-900">Tags Management</h2>
            <button
              @click="showTagForm = true; editingTag = null; resetTagForm()"
              class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Add Tag
            </button>
          </div>
          <div class="px-6 py-4">
            <div v-if="isLoading" class="text-center py-4">
              <div
                class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
              ></div>
            </div>
            <div v-else-if="tags.length === 0" class="text-center py-8 text-gray-500">
              No tags found
            </div>
            <div v-else class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Tag
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      ID
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Description
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="tag in tags" :key="tag.id">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div
                          class="h-4 w-4 rounded-full mr-3"
                          :style="{ backgroundColor: tag.color || '#3B82F6' }"
                        ></div>
                        <div class="text-sm font-medium text-gray-900">{{ tag.name }}</div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ tag.id }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ tag.description }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        @click="editTag(tag)"
                        class="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </button>
                      <button
                        @click="deleteTag(tag.id)"
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
              <div
                class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
              ></div>
            </div>
            <div v-else-if="orders.length === 0" class="text-center py-8 text-gray-500">
              No orders found
            </div>
            <div v-else class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Order #
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      User
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Total
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Date
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="order in orders" :key="order.id">
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {{ order.merchant_trade_no }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      User #{{ order.userId }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${{ order.amountCents }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span
                        :class="[
                          'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                          order.status === 'COMPLETED'
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'PENDING'
                              ? 'bg-yellow-100 text-yellow-800'
                              : order.status === 'SHIPPED'
                                ? 'bg-blue-100 text-blue-800'
                                : order.status === 'PAID'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-red-100 text-red-800',
                        ]"
                      >
                        {{ order.status }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ formatDate(order.createdAt) }}
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
    <div
      v-if="showProductForm"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
    >
      <div
        class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white"
      >
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
              />
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
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Stock</label>
              <input
                v-model.number="productForm.inStock"
                type="number"
                min="0"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
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
              <label class="block text-sm font-medium text-gray-700">Product Image</label>
              <div class="mt-1 space-y-3">
                <!-- Image preview -->
                <div v-if="imagePreview" class="flex items-center space-x-3">
                  <img 
                    :src="imagePreview" 
                    alt="Product preview"
                    class="h-20 w-20 object-cover rounded border"
                  />
                  <button
                    type="button"
                    @click="selectedImageFile = null; imagePreview = null"
                    class="text-sm text-red-600 hover:text-red-800"
                  >
                    Remove Image
                  </button>
                </div>
                <!-- File input -->
                <input
                  type="file"
                  accept="image/*"
                  @change="handleImageFileSelect"
                  class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <p class="text-xs text-gray-500">Upload an image file (JPG, PNG, etc.)</p>
                <!-- Fallback URL input -->
                <div class="mt-2">
                  <label class="block text-xs text-gray-600 mb-1">Or enter image URL:</label>
                  <input
                    v-model="productForm.imageURL"
                    type="text"
                    placeholder="https://example.com/image.jpg"
                    class="block w-full text-sm rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Rating</label>
              <input
                v-model.number="productForm.rating"
                type="number"
                min="0"
                max="5"
                step="0.1"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Category</label>
              <select
                v-model="productForm.categoryId"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select a category</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Promotion (Optional)</label>
              <select
                v-model="productForm.promotionId"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">No promotion</option>
                <option v-for="promotion in promotions" :key="promotion.id" :value="promotion.id">
                  {{ promotion.name }} ({{ promotion.discountPercentage }}% off)
                </option>
              </select>
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

    <!-- Category Form Modal -->
    <div
      v-if="showCategoryForm"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
    >
      <div
        class="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 lg:w-1/3 shadow-lg rounded-md bg-white"
      >
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ editingCategory ? 'Edit Category' : 'Add New Category' }}
          </h3>
          <form @submit.prevent="saveCategory" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Name</label>
              <input
                v-model="categoryForm.name"
                type="text"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                v-model="categoryForm.description"
                rows="3"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              ></textarea>
            </div>
            <div class="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                @click="showCategoryForm = false"
                class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700"
              >
                {{ editingCategory ? 'Update' : 'Create' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Promotion Form Modal -->
    <div
      v-if="showPromotionForm"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
    >
      <div
        class="relative top-20 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 shadow-lg rounded-md bg-white"
      >
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ editingPromotion ? 'Edit Promotion' : 'Add New Promotion' }}
          </h3>
          <form @submit.prevent="savePromotion" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Name</label>
              <input
                v-model="promotionForm.name"
                type="text"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                v-model="promotionForm.description"
                rows="3"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              ></textarea>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Discount Type</label>
                <select v-model="promotionForm.discountType" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                  <option value="PERCENTAGE">PERCENTAGE</option>
                  <option value="FIXED">FIXED</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Discount Value</label>
                <input
                  v-model.number="promotionForm.discountValue"
                  type="number"
                  :min="promotionForm.discountType === 'PERCENTAGE' ? 0 : 1"
                  :max="promotionForm.discountType === 'PERCENTAGE' ? 100 : null"
                  step="0.01"
                  required
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Start Date</label>
                <input
                  v-model="promotionForm.startDate"
                  type="date"
                  required
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">End Date</label>
                <input
                  v-model="promotionForm.endDate"
                  type="date"
                  required
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label class="flex items-center">
                <input
                  v-model="promotionForm.isActive"
                  type="checkbox"
                  class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <span class="ml-2 text-sm text-gray-700">Active</span>
              </label>
            </div>
            <div class="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                @click="showPromotionForm = false; resetPromotionForm()"
                class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700"
              >
                {{ editingPromotion ? 'Update' : 'Create' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Tag Form Modal -->
    <div
      v-if="showTagForm"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
    >
      <div
        class="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 lg:w-1/3 shadow-lg rounded-md bg-white"
      >
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ editingTag ? 'Edit Tag' : 'Add New Tag' }}
          </h3>
          <form @submit.prevent="saveTag" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Tag ID *</label>
              <input
                v-model="tagForm.id"
                type="text"
                required
                :disabled="editingTag !== null"
                :class="[
                  'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500',
                  editingTag ? 'bg-gray-100' : ''
                ]"
                placeholder="e.g., electronics, fashion"
              />
              <p class="mt-1 text-sm text-gray-500">Unique identifier for the tag (cannot be changed after creation)</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Name *</label>
              <input
                v-model="tagForm.name"
                type="text"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="e.g., Electronics"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                v-model="tagForm.description"
                rows="3"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Optional description for the tag"
              ></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Color</label>
              <div class="mt-1 flex items-center space-x-3">
                <input
                  v-model="tagForm.color"
                  type="color"
                  class="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                />
                <input
                  v-model="tagForm.color"
                  type="text"
                  class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="#3B82F6"
                />
              </div>
            </div>
            <div class="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                @click="showTagForm = false; resetTagForm()"
                class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700"
              >
                {{ editingTag ? 'Update' : 'Create' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

