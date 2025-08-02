// Base API configuration
const API_BASE_URL = 'http://localhost:8080'

// Helper function to make API requests
async function apiRequest(url, options = {}) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  // Add token to requests if available
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, config)
    const result = await response.json()

    if (!response.ok) {
      if (result.data.errors) {
        return result.data
      }
      throw new Error(result.message || 'API request failed')
    }

    return result.data
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
