<template>
  <div class="py-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Hero Section -->
      <div class="text-center mb-16">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">About EcommerceVue</h1>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">
          We're passionate about bringing you the best online shopping experience with carefully curated products and exceptional customer service.
        </p>
      </div>

      <!-- Story Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
        <div>
          <h2 class="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
          <p class="text-gray-600 mb-4">
            Founded in 2024, EcommerceVue started with a simple mission: to make quality products accessible to everyone through an intuitive and enjoyable online shopping experience.
          </p>
          <p class="text-gray-600 mb-4">
            What began as a small venture has grown into a trusted platform serving thousands of customers worldwide. We carefully select each product in our catalog to ensure it meets our high standards for quality, functionality, and value.
          </p>
          <p class="text-gray-600">
            Today, we continue to innovate and expand our offerings while maintaining our commitment to exceptional customer service and competitive pricing.
          </p>
        </div>
        <div class="relative">
          <img 
            src="https://via.placeholder.com/500x400/3B82F6/FFFFFF?text=Our+Team" 
            alt="Our Team" 
            class="rounded-lg shadow-lg w-full"
          >
        </div>
      </div>

      <!-- Values Section -->
      <div class="bg-gray-50 rounded-2xl p-8 mb-20">
        <h2 class="text-3xl font-bold text-gray-900 text-center mb-12">Our Values</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Quality First</h3>
            <p class="text-gray-600">We never compromise on quality. Every product is carefully tested and verified before reaching our customers.</p>
          </div>
          <div class="text-center">
            <div class="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-3-5.197m-16 8.197A10 10 0 005.196 2.804m0 0A10 10 0 0015.804 13l-6.61 6.61a2.5 2.5 0 01-3.54 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Customer Focused</h3>
            <p class="text-gray-600">Our customers are at the heart of everything we do. We listen, learn, and continuously improve based on feedback.</p>
          </div>
          <div class="text-center">
            <div class="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Innovation</h3>
            <p class="text-gray-600">We embrace new technologies and ideas to create better shopping experiences and find amazing products.</p>
          </div>
        </div>
      </div>

      <!-- Team Section -->
      <div class="text-center mb-16">
        <h2 class="text-3xl font-bold text-gray-900 mb-12">Meet Our Team</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center">
            <img 
              src="https://via.placeholder.com/200x200/3B82F6/FFFFFF?text=CEO" 
              alt="CEO" 
              class="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
            >
            <h3 class="text-xl font-semibold text-gray-900 mb-1">Sarah Johnson</h3>
            <p class="text-gray-600 mb-2">CEO & Founder</p>
            <p class="text-gray-500 text-sm">Passionate about creating exceptional customer experiences and building meaningful relationships.</p>
          </div>
          <div class="text-center">
            <img 
              src="https://via.placeholder.com/200x200/10B981/FFFFFF?text=CTO" 
              alt="CTO" 
              class="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
            >
            <h3 class="text-xl font-semibold text-gray-900 mb-1">Michael Chen</h3>
            <p class="text-gray-600 mb-2">Chief Technology Officer</p>
            <p class="text-gray-500 text-sm">Leading our technology initiatives to create seamless and innovative shopping experiences.</p>
          </div>
          <div class="text-center">
            <img 
              src="https://via.placeholder.com/200x200/8B5CF6/FFFFFF?text=CPO" 
              alt="CPO" 
              class="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
            >
            <h3 class="text-xl font-semibold text-gray-900 mb-1">Emma Rodriguez</h3>
            <p class="text-gray-600 mb-2">Chief Product Officer</p>
            <p class="text-gray-500 text-sm">Curating amazing products and ensuring every item meets our high standards for quality and value.</p>
          </div>
        </div>
      </div>

      <!-- Contact CTA -->
      <div class="bg-blue-600 rounded-2xl p-8 text-center text-white">
        <h2 class="text-3xl font-bold mb-4">Get in Touch</h2>
        <p class="text-blue-100 mb-6 max-w-2xl mx-auto">
          Have questions or suggestions? We'd love to hear from you. Our team is always ready to help and improve your experience.
        </p>
        <button class="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
          Contact Us
        </button>
      </div>
    </div>
  </div>
</template>
