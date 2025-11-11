<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue';
import { testConnection } from './services/testAPI';
testConnection();
</script>

<template>
  <HelloWorld />

</template>

<style scoped></style>
