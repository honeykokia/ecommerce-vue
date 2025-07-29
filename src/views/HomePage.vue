<template>
  <div>
    <header class="bg-white shadow-md p-6">
      <div class="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 class="text-2xl font-bold text-center md:text-3xl md:text-left">
          Welcome to My E-commerce Site
        </h1>
        <ul class="flex flex-wrap justify-center md:justify-end items-center gap-6">
          <li>
            <a
              href="#search"
              class="text-black-500 hover:text-blue-700 border-b-2 border-transparent hover:border-blue-700"
            >
              <i class="fa-solid fa-magnifying-glass text-2xl"></i>
            </a>
          </li>
          <li>
            <a
              href="#cart"
              class="text-black-500 hover:text-blue-700 border-b-2 border-transparent hover:border-blue-700"
            >
              <i class="fa-solid fa-cart-shopping text-2xl"></i>
            </a>
          </li>
          <li>
            <router-link
              to="/login"
              class="bg-gray-200 border-2 p-2 rounded-xl text-black-500 hover:text-blue-700 border-b-2 border-transparent hover:border-blue-700"
            >
              <i class="fa-solid fa-user text-2xl"></i> 登入/註冊
            </router-link>
          </li>
        </ul>
      </div>
    </header>

    <main>
      <section class="w-full p-6 bg-gradient-to-r from-blue-400 to-blue-600 flex items-center">
        <div
          class="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4 px-6"
        >
          <h1 class="text-2xl md:text-4xl font-bold text-white md:w-1/2 mb-6">
            Glad to see you!<br />
            <span class="inline-block mt-4">Let's find something you'll love.</span>
          </h1>
          <div class="bg-white w-[450px] h-[350px] rotate-[350deg] shadow-xl rounded-xl border">
            <!-- 卡片內容 -->
          </div>
        </div>
      </section>

      <section class="w-full mx-auto p-6 bg-gray-200">
        <div class="container mx-auto">
          <h2 class="text-2xl font-bold mb-4">Featured Products</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- 商品卡片 -->
            <div
              class="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <img
                src="https://via.placeholder.com/150"
                alt="Product Image"
                class="w-full h-48 object-cover rounded-t-lg mb-4"
              />
              <h3 class="text-xl font-semibold mb-2">Product Name</h3>
              <p class="text-gray-600 mb-4">$29.99</p>
              <button
                class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300"
              >
                Add to Cart
              </button>
            </div>
            <div
              class="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <img
                src="https://via.placeholder.com/150"
                alt="Product Image"
                class="w-full h-48 object-cover rounded-t-lg mb-4"
              />
              <h3 class="text-xl font-semibold mb-2">Product Name</h3>
              <p class="text-gray-600 mb-4">$39.99</p>
              <button
                class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300"
              >
                Add to Cart
              </button>
            </div>
            <div
              class="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <img
                src="https://via.placeholder.com/150"
                alt="Product Image"
                class="w-full h-48 object-cover rounded-t-lg mb-4"
              />
              <h3 class="text-xl font-semibold mb-2">Product Name</h3>
              <p class="text-gray-600 mb-4">$49.99</p>
              <button
                class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300"
              >
                Add to Cart
              </button>
            </div>
            <div
              class="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <img
                src="https://via.placeholder.com/150"
                alt="Product Image"
                class="w-full h-48 object-cover rounded-t-lg mb-4"
              />
              <h3 class="text-xl font-semibold mb-2">Product Name</h3>
              <p class="text-gray-600 mb-4">$59.99</p>
              <button
                class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300"
              >
                Add to Cart
              </button>
            </div>
            <div
              class="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <img
                src="https://via.placeholder.com/150"
                alt="Product Image"
                class="w-full h-48 object-cover rounded-t-lg mb-4"
              />
              <h3 class="text-xl font-semibold mb-2">Product Name</h3>
              <p class="text-gray-600 mb-4">$69.99</p>
              <button
                class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300"
              >
                Add to Cart
              </button>
            </div>
            <div
              class="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <img
                src="https://via.placeholder.com/150"
                alt="Product Image"
                class="w-full h-48 object-cover rounded-t-lg mb-4"
              />
              <h3 class="text-xl font-semibold mb-2">Product Name</h3>
              <p class="text-gray-600 mb-4">$79.99</p>
              <button
                class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300"
              >
                Add to Cart
              </button>
            </div>
          </div>
          <div class="mt-10 px-4">
            <a
              href="/products"
              class="block w-full text-center py-4 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold rounded-xl shadow hover:scale-105 transition"
            >
              View More Products →
            </a>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
// Vue 3 Composition API setup
</script>
