// API service for payment-related operations
// Based on the API specification from ecommerce-docs

const API_BASE_URL = process.env.VUE_APP_API_BASE_URL || 'http://localhost:8080'

// Helper function to make API requests
const apiRequest = async (url, options = {}) => {
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  }

  const token = localStorage.getItem('authToken')
  if (token) {
    defaultOptions.headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
  }

  return response.json()
}

// Payment API functions
export const paymentApi = {
  // Create order (POST /orders/me)
  createOrder: async (orderData) => {
    return apiRequest('/orders/me', {
      method: 'POST',
      body: JSON.stringify(orderData),
    })
  },

  // Payment checkout (POST /payments/checkout)
  // Note: This endpoint returns HTML for redirect, not JSON
  paymentCheckout: async (checkoutData) => {
    const response = await fetch(`${API_BASE_URL}/payments/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
      body: JSON.stringify(checkoutData),
    })

    if (!response.ok) {
      throw new Error(`Payment checkout failed: ${response.status}`)
    }

    // For ECPay integration, this would return HTML that redirects to payment gateway
    return response.text()
  },

  // Initiate payment (POST /payments/initiate)
  initiatePayment: async (paymentData) => {
    return apiRequest('/payments/initiate', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    })
  },

  // Mock payment for testing (POST /payments/mock)
  mockPayment: async (mockData) => {
    return apiRequest('/payments/mock', {
      method: 'POST',
      body: JSON.stringify(mockData),
    })
  },

  // Get user orders (GET /orders/me)
  getUserOrders: async () => {
    return apiRequest('/orders/me')
  },

  // Get order items (GET /orders/{orderId}/items)
  getOrderItems: async (orderId) => {
    return apiRequest(`/orders/${orderId}/items`)
  },
}

// Cart API functions
export const cartApi = {
  // Get user cart (GET /carts/me)
  getUserCart: async () => {
    return apiRequest('/carts/me')
  },

  // Add item to cart (POST /carts/me)
  addToCart: async (itemData) => {
    return apiRequest('/carts/me', {
      method: 'POST',
      body: JSON.stringify(itemData),
    })
  },

  // Update cart item quantity (PATCH /carts/me/{productId})
  updateCartItem: async (productId, quantity) => {
    return apiRequest(`/carts/me/${productId}`, {
      method: 'PATCH',
      body: JSON.stringify({ quantity }),
    })
  },

  // Remove item from cart (DELETE /carts/me/{productId})
  removeFromCart: async (productId) => {
    return apiRequest(`/carts/me/${productId}`, {
      method: 'DELETE',
    })
  },

  // Clear cart (DELETE /carts/me)
  clearCart: async () => {
    return apiRequest('/carts/me', {
      method: 'DELETE',
    })
  },
}

// Product API functions (for order summary)
export const productApi = {
  // Get products (GET /products)
  getProducts: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return apiRequest(`/products${queryString ? `?${queryString}` : ''}`)
  },

  // Get product by ID (GET /products/{productId})
  getProduct: async (productId) => {
    return apiRequest(`/products/${productId}`)
  },
}

// Export default API object
export default {
  payment: paymentApi,
  cart: cartApi,
  product: productApi,
}