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
    return cartItems.value.reduce((total, item) => total + item.unitPrice * item.quantity, 0)
  })

  const isCartEmpty = computed(() => cartItems.value.length === 0)

  const getCartItemByProductId = computed(() => {
    return (productId) => cartItems.value.find((item) => item.productId === productId)
  })

  // Actions
  async function fetchCart() {
    isLoading.value = true
    error.value = null

    try {
      const response = await cartApi.getCart()
      cartItems.value = response.data.cart || []
    } catch (err) {
      error.value = err.message || 'Failed to fetch cart'
      console.error('Error fetching cart:', err)
    } finally {
      isLoading.value = false
    }
  }

  async function addToCart(productId, quantity = 1, unitPrice) {
    isLoading.value = true
    error.value = null

    try {
      const cartItem = {
        productId,
        quantity,
        unitPrice,
      }

      await cartApi.addToCart(cartItem)

      // Update local cart state
      const existingItem = cartItems.value.find((item) => item.productId === productId)
      if (existingItem) {
        existingItem.quantity += quantity
      } else {
        cartItems.value.push({
          productId,
          quantity,
          unitPrice,
          id: Date.now(), // Temporary ID until we get the real one from the server
          createAt: new Date().toISOString(),
          updateAt: new Date().toISOString(),
        })
      }

      // Refetch cart to get accurate data from server
      await fetchCart()
    } catch (err) {
      error.value = err.message || 'Failed to add item to cart'
      console.error('Error adding to cart:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function updateCartItemQuantity(productId, quantity) {
    if (quantity <= 0) {
      return removeFromCart(productId)
    }

    // isLoading,value = true
    isLoading.value = false
    error.value = null
    try {
      await cartApi.updateCartItem(productId, quantity)

      // Update local state
      const item = cartItems.value.find((item) => item.productId === productId)
      if (item) {
        item.quantity = quantity
        item.updateAt = new Date().toISOString()
      }
    } catch (err) {
      error.value = err.message || 'Failed to update cart item'
      console.error('Error updating cart item:', err)
      // Refetch cart to sync with server state
      await fetchCart()
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function removeFromCart(productId) {
    isLoading.value = true
    error.value = null

    try {
      await cartApi.removeFromCart(productId)

      // Update local state
      cartItems.value = cartItems.value.filter((item) => item.productId !== productId)
    } catch (err) {
      error.value = err.message || 'Failed to remove item from cart'
      console.error('Error removing from cart:', err)
      // Refetch cart to sync with server state
      await fetchCart()
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function clearCart() {
    isLoading.value = true
    error.value = null

    try {
      await cartApi.clearCart()
      cartItems.value = []
    } catch (err) {
      error.value = err.message || 'Failed to clear cart'
      console.error('Error clearing cart:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  function clearError() {
    error.value = null
  }

  return {
    // State
    cartItems,
    isLoading,
    error,
    // Getters
    cartCount,
    cartTotal,
    isCartEmpty,
    getCartItemByProductId,
    // Actions
    fetchCart,
    addToCart,
    updateCartItemQuantity,
    removeFromCart,
    clearCart,
    clearError,
  }
})
