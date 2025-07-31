// Mock data for testing Cart and Product components
// This simulates the API responses for development/testing

export const mockCategories = [
  {
    id: 1,
    name: "電子產品",
    description: "各式電子產品與配件"
  },
  {
    id: 2,
    name: "服飾配件", 
    description: "時尚服飾與配件"
  },
  {
    id: 3,
    name: "家居用品",
    description: "家庭生活用品"
  },
  {
    id: 4,
    name: "美妝保養",
    description: "美妝與個人保養用品"
  }
]

export const mockProducts = [
  {
    id: 1,
    name: "藍芽無線耳機",
    price: 2000,
    promotionId: 1,
    imageUrl: "https://via.placeholder.com/300x300/2563eb/ffffff?text=藍芽耳機",
    categoryId: 1,
    inStock: 15,
    rating: 4.5,
    soldCount: 128,
    shortDescription: "高品質藍芽5.0無線耳機，提供清晰音質與長時間續航",
    tags: [
      { id: 1, name: "熱賣" },
      { id: 2, name: "無線" }
    ]
  },
  {
    id: 2,
    name: "智慧手錶",
    price: 5000,
    promotionId: null,
    imageUrl: "https://via.placeholder.com/300x300/059669/ffffff?text=智慧手錶",
    categoryId: 1,
    inStock: 8,
    rating: 4.2,
    soldCount: 89,
    shortDescription: "多功能智慧手錶，支援健康監測與通知提醒",
    tags: [
      { id: 3, name: "新品" },
      { id: 4, name: "健康" }
    ]
  },
  {
    id: 3,
    name: "時尚背包",
    price: 1500,
    promotionId: 2,
    imageUrl: "https://via.placeholder.com/300x300/dc2626/ffffff?text=時尚背包",
    categoryId: 2,
    inStock: 25,
    rating: 4.3,
    soldCount: 67,
    shortDescription: "輕便時尚背包，適合日常通勤與休閒使用",
    tags: [
      { id: 5, name: "時尚" },
      { id: 6, name: "實用" }
    ]
  },
  {
    id: 4,
    name: "咖啡杯組",
    price: 800,
    promotionId: null,
    imageUrl: "https://via.placeholder.com/300x300/7c3aed/ffffff?text=咖啡杯組",
    categoryId: 3,
    inStock: 0,
    rating: 4.0,
    soldCount: 45,
    shortDescription: "精美陶瓷咖啡杯組，品味生活的完美選擇",
    tags: [
      { id: 7, name: "精美" },
      { id: 8, name: "陶瓷" }
    ]
  },
  {
    id: 5,
    name: "保濕面霜",
    price: 1200,
    promotionId: 1,
    imageUrl: "https://via.placeholder.com/300x300/ea580c/ffffff?text=保濕面霜",
    categoryId: 4,
    inStock: 32,
    rating: 4.7,
    soldCount: 156,
    shortDescription: "深層保濕面霜，適合各種膚質使用",
    tags: [
      { id: 9, name: "保濕" },
      { id: 1, name: "熱賣" }
    ]
  },
  {
    id: 6,
    name: "USB充電器",
    price: 500,
    promotionId: null,
    imageUrl: "https://via.placeholder.com/300x300/1f2937/ffffff?text=USB充電器",
    categoryId: 1,
    inStock: 50,
    rating: 4.1,
    soldCount: 234,
    shortDescription: "快速充電USB充電器，支援多設備同時充電",
    tags: [
      { id: 10, name: "快充" },
      { id: 11, name: "多口" }
    ]
  }
]

export const mockPromotions = [
  {
    id: 1,
    name: "夏季大促銷",
    discountType: "PERCENTAGE",
    discountValue: 20,
    description: "全館商品最高折扣20%",
    startDate: "2025-06-01T00:00:00",
    endDate: "2025-08-31T23:59:59",
    imageUrl: "https://via.placeholder.com/400x200/ef4444/ffffff?text=夏季促銷",
    isActive: true
  },
  {
    id: 2,
    name: "新會員優惠",
    discountType: "FIXED",
    discountValue: 200,
    description: "新會員專屬折抵$200",
    startDate: "2025-01-01T00:00:00",
    endDate: "2025-12-31T23:59:59",
    imageUrl: "https://via.placeholder.com/400x200/3b82f6/ffffff?text=新會員優惠",
    isActive: true
  }
]

export const mockCartItems = [
  {
    id: 1,
    userId: 1,
    productId: 1,
    quantity: 2,
    unitPrice: 1600, // After discount
    createAt: "2025-01-15T10:00:00",
    updateAt: "2025-01-15T10:00:00"
  },
  {
    id: 2,
    userId: 1,
    productId: 3,
    quantity: 1,
    unitPrice: 1300, // After discount
    createAt: "2025-01-15T11:00:00",
    updateAt: "2025-01-15T11:00:00"
  }
]

// Mock API responses
export const mockApiResponses = {
  '/products': {
    timestamp: new Date().toISOString(),
    data: {
      products: mockProducts
    }
  },
  '/categories': {
    timestamp: new Date().toISOString(),
    data: {
      categories: mockCategories
    }
  },
  '/promotions': {
    timestamp: new Date().toISOString(),
    data: {
      promotions: mockPromotions
    }
  },
  '/carts/me': {
    timestamp: new Date().toISOString(),
    data: {
      cart: mockCartItems
    }
  }
}