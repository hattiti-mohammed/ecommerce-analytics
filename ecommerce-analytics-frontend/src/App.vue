<script setup lang="ts">
import Dashboard from '@/views/Dashboard.vue';
</script>

<template>
  <div class="app">
    <Dashboard />
  </div>
</template>

<style>
body {
  margin: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  background-color: #f5f7fa;
}

.app {
  min-height: 100vh;
}

* {
  box-sizing: border-box;
}
</style>
