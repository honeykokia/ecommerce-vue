<script setup></script>

<template>
  <div class="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
    <h1 class="text-2xl font-bold text-center md:text-3xl md:text-left">
      Welcome to My E-commerce Site
    </h1>
    <ul class="flex flex-wrap justify-center md:justify-end items-center gap-6">
      <li>
        <RouterLink
          to="/"
          class="text-black-500 hover:text-blue-700 border-b-2 border-transparent hover:border-blue-700"
          ><i class="fa-solid fa-house text-2xl"></i
        ></RouterLink>
      </li>
      <li>
        <a
          href="#search"
          class="text-black-500 hover:text-blue-700 border-b-2 border-transparent hover:border-blue-700"
          ><i class="fa-solid fa-magnifying-glass text-2xl"></i
        ></a>
      </li>
      <li>
        <a
          href="#cart"
          class="text-black-500 hover:text-blue-700 border-b-2 border-transparent hover:border-blue-700"
          ><i class="fa-solid fa-cart-shopping text-2xl"></i
        ></a>
      </li>
      <li>
        <RouterLink
          to="/login"
          class="bg-gray-200 border-2 p-2 rounded-xl text-black-500 hover:text-blue-700 border-b-2 border-transparent hover:border-blue-700"
          ><i class="fa-solid fa-user text-2xl"></i> 登入/註冊</RouterLink
        >
      </li>
    </ul>
  </div>
</template>

<style scoped></style>
