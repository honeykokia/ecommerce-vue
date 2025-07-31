import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { productApi, categoryApi, promotionApi } from '../services/api.js'

export const useProductStore = defineStore('product', () => {
  // State
  const products = ref([])
  const categories = ref([])
  const promotions = ref([])
  const currentProduct = ref(null)
  const isLoading = ref(false)
  const error = ref(null)
  
  // Filter state
  const selectedCategory = ref(null)
  const searchQuery = ref('')

  // Getters
  const filteredProducts = computed(() => {
    let filtered = products.value

    // Filter by category
    if (selectedCategory.value) {
      filtered = filtered.filter(product => product.categoryId === selectedCategory.value)
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

  const featuredProducts = computed(() => {
    return products.value.filter(product => product.rating >= 4.0).slice(0, 8)
  })

  const productsByCategory = computed(() => {
    const grouped = {}
    categories.value.forEach(category => {
      grouped[category.id] = products.value.filter(product => product.categoryId === category.id)
    })
    return grouped
  })

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

  function setProducts(productList) {
    products.value = productList || []
  }

  function setCategories(categoryList) {
    categories.value = categoryList || []
  }

  function setPromotions(promotionList) {
    promotions.value = promotionList || []
  }

  function setCurrentProduct(product) {
    currentProduct.value = product
  }

  function setSelectedCategory(categoryId) {
    selectedCategory.value = categoryId
  }

  function setSearchQuery(query) {
    searchQuery.value = query
  }

  // Fetch all products
  async function fetchProducts(params = {}) {
    setLoading(true)
    clearError()

    try {
      const response = await productApi.getProducts(params)
      if (response.data && response.data.products) {
        setProducts(response.data.products)
      }
    } catch (err) {
      setError('Failed to load products')
      console.error('Products fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Fetch single product
  async function fetchProduct(productId) {
    setLoading(true)
    clearError()

    try {
      const response = await productApi.getProduct(productId)
      if (response.data && response.data.product) {
        setCurrentProduct(response.data.product)
        return response.data.product
      }
    } catch (err) {
      setError('Failed to load product details')
      console.error('Product fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Fetch categories
  async function fetchCategories() {
    setLoading(true)
    clearError()

    try {
      const response = await categoryApi.getCategories()
      if (response.data && response.data.categories) {
        setCategories(response.data.categories)
      }
    } catch (err) {
      setError('Failed to load categories')
      console.error('Categories fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Fetch promotions
  async function fetchPromotions() {
    setLoading(true)
    clearError()

    try {
      const response = await promotionApi.getPromotions()
      if (response.data && response.data.promotions) {
        setPromotions(response.data.promotions)
      }
    } catch (err) {
      setError('Failed to load promotions')
      console.error('Promotions fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Search products
  async function searchProducts(query, categoryId = null) {
    const params = {}
    if (query) {
      params.name = query
    }
    if (categoryId) {
      params.categoryId = categoryId
    }
    
    await fetchProducts(params)
    setSearchQuery(query)
    setSelectedCategory(categoryId)
  }

  // Get product by ID from current products list
  function getProductById(productId) {
    return products.value.find(product => product.id === productId)
  }

  // Get category by ID
  function getCategoryById(categoryId) {
    return categories.value.find(category => category.id === categoryId)
  }

  // Get promotion by ID
  function getPromotionById(promotionId) {
    return promotions.value.find(promotion => promotion.id === promotionId)
  }

  // Clear filters
  function clearFilters() {
    setSelectedCategory(null)
    setSearchQuery('')
  }

  return {
    // State
    products,
    categories,
    promotions,
    currentProduct,
    isLoading,
    error,
    selectedCategory,
    searchQuery,
    // Getters
    filteredProducts,
    featuredProducts,
    productsByCategory,
    // Actions
    setLoading,
    setError,
    clearError,
    setProducts,
    setCategories,
    setPromotions,
    setCurrentProduct,
    setSelectedCategory,
    setSearchQuery,
    fetchProducts,
    fetchProduct,
    fetchCategories,
    fetchPromotions,
    searchProducts,
    getProductById,
    getCategoryById,
    getPromotionById,
    clearFilters
  }
})