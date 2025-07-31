import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { cartApi } from '../services/api.js'

export const useCartStore = defineStore('cart', () => {
  // State
  const cartItems = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  // Getters
  const itemCount = computed(() => {
    return cartItems.value.reduce((total, item) => total + item.quantity, 0)
  })

  const totalPrice = computed(() => {
    return cartItems.value.reduce((total, item) => total + (item.unitPrice * item.quantity), 0)
  })

  const isEmpty = computed(() => cartItems.value.length === 0)

  // Actions
  function setLoading(loading) {
    isLoading.value = loading
  }

  function setError(errorMessage) {
    error.value = errorMessage
  }

  function clearError() {
    error.value = null
  }

  function setCartItems(items) {
    cartItems.value = items || []
  }

  // Fetch cart from API
  async function fetchCart() {
    setLoading(true)
    clearError()
    
    try {
      const response = await cartApi.getCart()
      if (response.data && response.data.cart) {
        setCartItems(response.data.cart)
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch cart')
      console.error('Error fetching cart:', err)
    } finally {
      setLoading(false)
    }
  }

  // Add item to cart
  async function addToCart(cartItem) {
    setLoading(true)
    clearError()
    
    try {
      await cartApi.addToCart(cartItem)
      // Refresh cart after adding
      await fetchCart()
      return true
    } catch (err) {
      setError(err.message || 'Failed to add item to cart')
      console.error('Error adding to cart:', err)
      return false
    } finally {
      setLoading(false)
    }
  }

  // Update cart item quantity
  async function updateCartItem(productId, quantity) {
    if (quantity <= 0) {
      return removeFromCart(productId)
    }

    setLoading(true)
    clearError()
    
    try {
      await cartApi.updateCartItem(productId, quantity)
      // Update local state optimistically
      const item = cartItems.value.find(item => item.productId === productId)
      if (item) {
        item.quantity = quantity
      }
      return true
    } catch (err) {
      setError(err.message || 'Failed to update cart item')
      console.error('Error updating cart item:', err)
      // Refresh cart to get correct state
      await fetchCart()
      return false
    } finally {
      setLoading(false)
    }
  }

  // Remove item from cart
  async function removeFromCart(productId) {
    setLoading(true)
    clearError()
    
    try {
      await cartApi.removeFromCart(productId)
      // Remove from local state optimistically
      cartItems.value = cartItems.value.filter(item => item.productId !== productId)
      return true
    } catch (err) {
      setError(err.message || 'Failed to remove item from cart')
      console.error('Error removing from cart:', err)
      // Refresh cart to get correct state
      await fetchCart()
      return false
    } finally {
      setLoading(false)
    }
  }

  // Clear entire cart
  async function clearCart() {
    setLoading(true)
    clearError()
    
    try {
      await cartApi.clearCart()
      setCartItems([])
      return true
    } catch (err) {
      setError(err.message || 'Failed to clear cart')
      console.error('Error clearing cart:', err)
      return false
    } finally {
      setLoading(false)
    }
  }

  return {
    // State
    cartItems,
    isLoading,
    error,
    // Getters
    itemCount,
    totalPrice,
    isEmpty,
    // Actions
    setLoading,
    setError,
    clearError,
    fetchCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
  }
})