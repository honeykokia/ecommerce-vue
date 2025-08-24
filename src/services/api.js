import { useUserStore } from '@/stores/user'
import router from '@/router'

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL

// Helper function to make API requests
async function apiRequest(url, options = {}) {
  const userStore = useUserStore()
  const config = {
    headers: {
      ...options.headers,
    },
    ...options,
  }

  // Only set Content-Type for JSON requests
  if (!(options.body instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json'
  }

  // Add token to requests if available
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, config)
    let result;
    const contentType = response.headers.get('content-type')

    // Check if response is JSON or text
    if (contentType && contentType.includes('application/json')) {
      result = await response.json()
    } else if (contentType && contentType.includes('text/html')) {
      result = await response.text()
    } else {
      result = null // Not JSON or text, set to null
    }

    if (response.status === 401) {
      userStore.logout()
      router.push('/login')
    }

    if (!response.ok) {
      throw (result?.data?.errors)
      ?? result
      ?? { message: 'Connection error' };
    }

    return result
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

// User Authentication APIs
export const userApi = {
  // User login
  async login(credentials) {
    return apiRequest('/users/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
  },

  // User registration
  async register(userData) {
    return apiRequest('/users/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  },

  // Get user profile
  async getProfile() {
    return apiRequest('/users/me')
  },

  // Update user profile
  async updateProfile(userData) {
    return apiRequest('/users/me', {
      method: 'PUT',
      body: JSON.stringify(userData),
    })
  },

  // Update user avatar
  async updateAvatar(formData) {
    return apiRequest('/users/me/avatar', {
      method: 'PUT',
      headers: {
        // Don't set Content-Type for FormData, let browser set it with boundary
      },
      body: formData,
    })
  },

  // Change password
  async changePassword(passwordData) {
    return apiRequest('/users/me/password', {
      method: 'PATCH',
      body: JSON.stringify(passwordData),
    })
  },

  // Verify user token
  async verifyToken(token) {
    return apiRequest(`/users/verify/${token}`)
  },

  // Forgot password
  async forgotPassword(emailData) {
    return apiRequest('/users/forgot-password', {
      method: 'POST',
      body: JSON.stringify(emailData),
    })
  },

  // Reset password
  async resetPassword(resetData) {
    return apiRequest('/users/reset-password', {
      method: 'POST',
      body: JSON.stringify(resetData),
    })
  },

  // Resend verification email
  async resendVerificationEmail(emailData) {
    return apiRequest('/users/verify/resend', {
      method: 'POST',
      body: JSON.stringify(emailData),
    })
  },
}

// Order APIs
export const orderApi = {
  // Get user orders
  async getUserOrders() {
    return apiRequest('/orders/me')
  },

  // Get order details
  async getOrderDetails(orderId) {
    return apiRequest(`/orders/${orderId}/items`)
  },

  // Create new order (checkout)
  async createOrder(orderData) {
    return apiRequest('/orders/me', {
      method: 'POST',
      body: JSON.stringify(orderData),
    })
  },
}

// Cart APIs
export const cartApi = {
  // Get user cart
  async getCart() {
    return apiRequest('/carts/me')
  },

  // Add item to cart
  async addToCart(cartItem) {
    return apiRequest('/carts/me', {
      method: 'POST',
      body: JSON.stringify(cartItem),
    })
  },

  // Update cart item quantity
  async updateCartItem(productId, quantity) {
    return apiRequest(`/carts/me/${productId}`, {
      method: 'PATCH',
      body: JSON.stringify({ quantity }),
    })
  },

  // Remove item from cart
  async removeFromCart(productId) {
    return apiRequest(`/carts/me/${productId}`, {
      method: 'DELETE',
    })
  },

  // Clear cart
  async clearCart() {
    return apiRequest('/carts/me', {
      method: 'DELETE',
    })
  },
}

// Product APIs
export const productApi = {
  // Get all products
  async getProducts(params = {}) {
    const queryString = new URLSearchParams(params).toString()
    return apiRequest(`/products${queryString ? `?${queryString}` : ''}`)
  },

  // Get product by ID
  async getProduct(productId) {
    return apiRequest(`/products/${productId}`)
  },
}

// Category APIs
export const categoryApi = {
  // Get all categories
  async getCategories() {
    return apiRequest('/categories')
  },
}

// Promotion APIs
export const promotionApi = {
  // Get all promotions
  async getPromotions() {
    return apiRequest('/promotions')
  },
}

// Admin APIs
export const adminApi = {
  // User management
  async getUsers() {
    return apiRequest('/admin/users')
  },

  async updateUserStatus(userId, statusData) {
    return apiRequest(`/admin/users/${userId}/status`, {
      method: 'PATCH',
      body: JSON.stringify(statusData),
    })
  },

  // Product management
  async createProduct(productData) {
    return apiRequest('/admin/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    })
  },

  async updateProduct(productId, productData) {
    return apiRequest(`/admin/products/${productId}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    })
  },

  async uploadProductImage(productId, file) {
    const formData = new FormData()
    formData.append('file', file)

    return apiRequest(`/admin/products/${productId}/image`, {
      method: 'PUT',
      body: formData,
    })
  },

  async deleteProduct(productId) {
    return apiRequest(`/admin/products/${productId}`, {
      method: 'DELETE',
    })
  },

  // For getting products in admin view, we can reuse the regular product API
  async getProducts() {
    return apiRequest('/products')
  },

  // Order management
  async getOrders() {
    return apiRequest('/admin/orders')
  },

  async getOrderStatusById(orderId) {
    return apiRequest(`/orders/${orderId}/status`)
  },

  async updateOrderStatus(orderId, statusData) {
    return apiRequest(`/admin/orders/${orderId}`, {
      method: 'PATCH',
      body: JSON.stringify(statusData),
    })
  },

  async deleteOrder(orderId) {
    return apiRequest(`/admin/orders/${orderId}`, {
      method: 'DELETE',
    })
  },

  // Category management
  async createCategory(categoryData) {
    return apiRequest('/admin/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    })
  },

  async getCategories() {
    return apiRequest('/categories')
  },

  async updateCategory(categoryId, categoryData) {
    return apiRequest(`/admin/categories/${categoryId}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    })
  },

  async deleteCategory(categoryId) {
    return apiRequest(`/admin/categories/${categoryId}`, {
      method: 'DELETE',
    })
  },

  // Promotion management
  async createPromotion(promotionData) {
    return apiRequest('/admin/promotions', {
      method: 'POST',
      body: JSON.stringify(promotionData),
    })
  },

  async getPromotions() {
    return apiRequest('/promotions')
  },

  async updatePromotion(promotionId, promotionData) {
    return apiRequest(`/admin/promotions/${promotionId}`, {
      method: 'PUT',
      body: JSON.stringify(promotionData),
    })
  },

  async updatePromotionImage(promotionId, file) {
    const formData = new FormData()
    formData.append('file', file)

    return apiRequest(`/admin/promotions/${promotionId}/image`, {
      method: 'PUT',
      body: formData,
    })
  },

  async deletePromotion(promotionId) {
    return apiRequest(`/admin/promotions/${promotionId}`, {
      method: 'DELETE',
    })
  },

  // Tags management
  async getTags() {
    return apiRequest('/admin/tags')
  },

  async createTag(tagData) {
    return apiRequest(`/admin/tags`, {
      method: 'POST',
      body: JSON.stringify(tagData),
    })
  },

  async updateTag(tagId, tagData) {
    return apiRequest(`/admin/tags/${tagId}`, {
      method: 'PUT',
      body: JSON.stringify(tagData),
    })
  },

  async deleteTag(tagId) {
    return apiRequest(`/admin/tags/${tagId}`, {
      method: 'DELETE',
    })
  },
}

// Payment APIs
export const paymentApi = {
  async checkout(paymentData) {
    return apiRequest('/payments/checkout', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    })
  },
}