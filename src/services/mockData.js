// Mock data for demo purposes - to be removed when backend is ready
export const mockProducts = [
  {
    id: 1,
    name: '無線藍牙耳機 Pro',
    price: 2999,
    promotionId: 1,
    imageUrl: 'https://via.placeholder.com/400x400/3B82F6/FFFFFF?text=藍牙耳機',
    categoryId: 1,
    inStock: 25,
    rating: 4.8,
    soldCount: 156,
    shortDescription: '高音質無線藍牙耳機，具備主動降噪功能，電池續航力長達30小時',
    tags: [
      { id: 1, name: '熱賣' },
      { id: 2, name: '新品' },
    ],
  },
  {
    id: 2,
    name: '智慧型手錶 S7',
    price: 8999,
    promotionId: null,
    imageUrl: 'https://via.placeholder.com/400x400/10B981/FFFFFF?text=智慧手錶',
    categoryId: 2,
    inStock: 12,
    rating: 4.6,
    soldCount: 89,
    shortDescription: '多功能智慧型手錶，支援健康監測、GPS定位、防水設計',
    tags: [{ id: 3, name: '限量' }],
  },
  {
    id: 3,
    name: '無線充電器',
    price: 899,
    promotionId: 1,
    imageUrl: 'https://via.placeholder.com/400x400/F59E0B/FFFFFF?text=無線充電',
    categoryId: 3,
    inStock: 0,
    rating: 4.3,
    soldCount: 234,
    shortDescription: '快速無線充電器，支援Qi標準，適用於各種支援無線充電的設備',
    tags: [],
  },
  {
    id: 4,
    name: '機械鍵盤 RGB',
    price: 3599,
    promotionId: null,
    imageUrl: 'https://via.placeholder.com/400x400/8B5CF6/FFFFFF?text=機械鍵盤',
    categoryId: 4,
    inStock: 8,
    rating: 4.9,
    soldCount: 67,
    shortDescription: 'RGB背光機械鍵盤，青軸手感，適合遊戲和辦公使用',
    tags: [
      { id: 4, name: '遊戲' },
      { id: 1, name: '熱賣' },
    ],
  },
  {
    id: 5,
    name: '4K網路攝影機',
    price: 1599,
    promotionId: 1,
    imageUrl: 'https://via.placeholder.com/400x400/EF4444/FFFFFF?text=攝影機',
    categoryId: 5,
    inStock: 18,
    rating: 4.4,
    soldCount: 123,
    shortDescription: '4K高清網路攝影機，支援夜視功能，適合視訊會議和直播',
    tags: [{ id: 5, name: '4K' }],
  },
  {
    id: 6,
    name: '便攜式行動電源',
    price: 1299,
    promotionId: null,
    imageUrl: 'https://via.placeholder.com/400x400/06B6D4/FFFFFF?text=行動電源',
    categoryId: 6,
    inStock: 45,
    rating: 4.5,
    soldCount: 298,
    shortDescription: '20000mAh大容量行動電源，支援快充協議，輕巧便攜設計',
    tags: [
      { id: 6, name: '大容量' },
      { id: 1, name: '熱賣' },
    ],
  },
]

export const mockCategories = [
  { id: 1, name: '耳機音響', description: '各類耳機和音響設備' },
  { id: 2, name: '智慧穿戴', description: '智慧手錶和穿戴設備' },
  { id: 3, name: '充電配件', description: '各種充電器和充電配件' },
  { id: 4, name: '電腦週邊', description: '鍵盤滑鼠等電腦配件' },
  { id: 5, name: '攝影設備', description: '攝影機和相關設備' },
  { id: 6, name: '行動配件', description: '行動電源和手機配件' },
]

export const mockCart = [
  {
    id: 1,
    userId: 1,
    productId: 1,
    quantity: 2,
    unitPrice: 2999,
    createAt: '2025-01-31T10:00:00',
    updateAt: '2025-01-31T10:00:00',
  },
  {
    id: 2,
    userId: 1,
    productId: 4,
    quantity: 1,
    unitPrice: 3599,
    createAt: '2025-01-31T10:30:00',
    updateAt: '2025-01-31T10:30:00',
  },
]

// Mock users for admin testing
export const mockUsers = [
  {
    id: 1,
    email: 'admin@example.com',
    name: 'Admin User',
    status: 'ACTIVE'
  },
  {
    id: 2,
    email: 'john.doe@example.com',
    name: 'John Doe',
    status: 'ACTIVE'
  },
  {
    id: 3,
    email: 'jane.smith@example.com',
    name: 'Jane Smith',
    status: 'INACTIVE'
  },
  {
    id: 4,
    email: 'banned.user@example.com',
    name: 'Banned User',
    status: 'BANNED'
  }
]

// Mock orders for admin testing  
export const mockOrders = [
  {
    id: 1,
    userId: 2,
    orderNumber: 'ORD123456789',
    status: 'PENDING',
    paymentMethod: 'CREDIT_CARD',
    isPaid: false,
    paidAt: null,
    cancelledAt: null,
    shippingMethod: 'STANDARD',
    shippingAddress: '台北市中正區某某路123號',
    shippingStatus: 'PENDING',
    totalPrice: 5998,
    createAt: '2025-01-31T10:00:00',
    updateAt: '2025-01-31T10:00:00'
  },
  {
    id: 2,
    userId: 3,
    orderNumber: 'ORD987654321',
    status: 'SHIPPED',
    paymentMethod: 'LINE_PAY',
    isPaid: true,
    paidAt: '2025-01-30T15:30:00',
    cancelledAt: null,
    shippingMethod: 'EXPRESS',
    shippingAddress: '高雄市新興區某某街456號',
    shippingStatus: 'SHIPPED',
    totalPrice: 3599,
    createAt: '2025-01-30T14:00:00',
    updateAt: '2025-01-31T09:00:00'
  },
  {
    id: 3,
    userId: 2,
    orderNumber: 'ORD555666777',
    status: 'COMPLETED',
    paymentMethod: 'PAYPAL',
    isPaid: true,
    paidAt: '2025-01-29T11:15:00',
    cancelledAt: null,
    shippingMethod: 'STANDARD',
    shippingAddress: '台中市西區某某巷789號',
    shippingStatus: 'DELIVERED',
    totalPrice: 1299,
    createAt: '2025-01-29T10:00:00',
    updateAt: '2025-01-30T16:00:00'
  }
]
