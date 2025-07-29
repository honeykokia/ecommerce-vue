<script setup>
import Advertisement from './Advertisement.vue';
import FeatureList from './FeatureList.vue';

</script>

<template>
  <section class="advertisement">
    <Advertisement />
  </section>

  <section class="featureList">
    <FeatureList />
  </section>
</template>

<style scoped>
.advertisement {
  @apply w-full p-6 bg-gradient-to-r from-blue-400 to-blue-600 flex items-center;
}

.featureList{
  @apply w-full mx-auto p-6 bg-gray-200;
}

</style>
