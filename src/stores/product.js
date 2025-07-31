import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { productApi, categoryApi } from '../services/api.js'

export const useProductStore = defineStore('product', () => {
  // State
  const products = ref([])
  const categories = ref([])
  const selectedCategory = ref(null)
  const searchQuery = ref('')
  const isLoading = ref(false)
  const error = ref(null)

  // Getters
  const filteredProducts = computed(() => {
    let filtered = products.value

    // Filter by category
    if (selectedCategory.value) {
      filtered = filtered.filter(product => 
        product.categoryId === selectedCategory.value
      )
    }

    // Filter by search query
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.shortDescription.toLowerCase().includes(query)
      )
    }

    return filtered
  })

  const getProductById = computed(() => {
    return (id) => products.value.find(product => product.id === id)
  })

  const getCategoryById = computed(() => {
    return (id) => categories.value.find(category => category.id === id)
  })

  // Actions
  async function fetchProducts(params = {}) {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await productApi.getProducts(params)
      products.value = response.data.products || []
    } catch (err) {
      error.value = err.message || 'Failed to fetch products'
      console.error('Error fetching products:', err)
    } finally {
      isLoading.value = false
    }
  }

  async function fetchCategories() {
    try {
      const response = await categoryApi.getCategories()
      categories.value = response.data.categories || []
    } catch (err) {
      console.error('Error fetching categories:', err)
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
      console.error('Error fetching product:', err)
      return null
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
    clearError
  }
})