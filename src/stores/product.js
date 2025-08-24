import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { productApi, categoryApi } from '../services/api.js'
import { mockProducts, mockCategories } from '../services/mockData.js'

export const useProductStore = defineStore('product', () => {
  // State
  const products = ref([])
  const categories = ref([])
  const selectedCategory = ref(null)
  const searchQuery = ref('')
  const isLoading = ref(false)
  const error = ref(null)
  const useMockData = ref(false) // Flag to use mock data when API fails

  // Getters
  const filteredProducts = computed(() => {
    let filtered = products.value

    // Filter by category
    if (selectedCategory.value) {
      filtered = filtered.filter((product) => product.categoryId === selectedCategory.value)
    }

    // Filter by search query
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.shortDescription.toLowerCase().includes(query),
      )
    }

    return filtered
  })

  const getProductById = computed(() => {
    return (id) => products.value.find((product) => product.id === id)
  })

  const getCategoryById = computed(() => {
    return (id) => categories.value.find((category) => category.id === id)
  })

  // Actions
  async function fetchProducts(params = {}) {
    isLoading.value = true
    error.value = null
    try {
      const response = await productApi.getProducts(params)
      products.value = response.data.products || []
      useMockData.value = false
    } catch (err) {
      console.warn('API unavailable, using mock data for demo:', err)

      // Use mock data when API fails
      products.value = mockProducts
      useMockData.value = true
      error.value = null // Clear error when using mock data
    } finally {
      isLoading.value = false
    }
  }

  async function fetchCategories() {
    try {
      const response = await categoryApi.getCategories()
      categories.value = response.data.categories || []
      useMockData.value = false
    } catch (err) {
      console.warn('API unavailable, using mock categories:', err)
      // Use mock data when API fails
      categories.value = mockCategories
      useMockData.value = true
    }
  }

  async function fetchProductById(id) {
    isLoading.value = true
    error.value = null

    try {
      const response = await productApi.getProduct(id)
      return response.data.product
    } catch (err) {
      error.value = err.message || 'Failed to fetch product'
      console.warn('API unavailable, using mock data:', err)

      // Return mock product when API fails
      const mockProduct = mockProducts.find((p) => p.id === id)
      return mockProduct || null
    } finally {
      isLoading.value = false
    }
  }

  function setSelectedCategory(categoryId) {
    selectedCategory.value = categoryId
  }

  function setSearchQuery(query) {
    searchQuery.value = query
  }

  function clearFilters() {
    selectedCategory.value = null
    searchQuery.value = ''
  }

  function clearError() {
    error.value = null
  }

  return {
    // State
    products,
    categories,
    selectedCategory,
    searchQuery,
    isLoading,
    error,
    useMockData,
    // Getters
    filteredProducts,
    getProductById,
    getCategoryById,
    // Actions
    fetchProducts,
    fetchCategories,
    fetchProductById,
    setSelectedCategory,
    setSearchQuery,
    clearFilters,
    clearError,
  }
})
