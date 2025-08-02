<script setup>
import NavBar from './components/NavBar.vue'
</script>

<template>
  <header class="header">
    <NavBar />
  </header>
  <main>
    <RouterView />
  </main>
  <footer></footer>
</template>

<style scoped>
.header {
  @apply bg-white shadow-md p-6;
}
</style>
