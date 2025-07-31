import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { cartApi } from '../services/api.js'

export const useCartStore = defineStore('cart', () => {
  // State
  const cartItems = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  // Getters
  const cartCount = computed(() => {
    return cartItems.value.reduce((total, item) => total + item.quantity, 0)
  })

  const cartTotal = computed(() => {
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
      setError('Failed to load cart items')
      console.error('Cart fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Add item to cart
  async function addToCart(productId, quantity = 1, unitPrice) {
    setLoading(true)
    clearError()

    try {
      const cartItem = {
        productId,
        quantity,
        unitPrice
      }
      
      await cartApi.addToCart(cartItem)
      
      // Update local cart state
      const existingItemIndex = cartItems.value.findIndex(item => item.productId === productId)
      if (existingItemIndex >= 0) {
        cartItems.value[existingItemIndex].quantity += quantity
      } else {
        cartItems.value.push({
          id: Date.now(), // Temporary ID until we fetch from server
          productId,
          quantity,
          unitPrice,
          createAt: new Date().toISOString(),
          updateAt: new Date().toISOString()
        })
      }
      
      // Optionally refresh cart from server to get accurate data
      await fetchCart()
    } catch (err) {
      setError('Failed to add item to cart')
      console.error('Add to cart error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Update cart item quantity
  async function updateCartItem(productId, quantity) {
    if (quantity <= 0) {
      await removeFromCart(productId)
      return
    }

    setLoading(true)
    clearError()

    try {
      await cartApi.updateCartItem(productId, quantity)
      
      // Update local state
      const itemIndex = cartItems.value.findIndex(item => item.productId === productId)
      if (itemIndex >= 0) {
        cartItems.value[itemIndex].quantity = quantity
        cartItems.value[itemIndex].updateAt = new Date().toISOString()
      }
    } catch (err) {
      setError('Failed to update cart item')
      console.error('Update cart item error:', err)
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
      
      // Update local state
      cartItems.value = cartItems.value.filter(item => item.productId !== productId)
    } catch (err) {
      setError('Failed to remove item from cart')
      console.error('Remove from cart error:', err)
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
    } catch (err) {
      setError('Failed to clear cart')
      console.error('Clear cart error:', err)
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
    cartCount,
    cartTotal,
    isEmpty,
    // Actions
    setLoading,
    setError,
    clearError,
    setCartItems,
    fetchCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
  }
})