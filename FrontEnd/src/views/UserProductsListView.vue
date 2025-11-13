<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { httpClient } from '../services/main.service';

const items = ref<any[]>([])
const loading = ref(true);
const error = ref<string | null>(null);

async function load() {
  loading.value = true;
  error.value = null;
  try {
    const response = await httpClient.get('/api/products');
    items.value = response.data ?? [];
  } catch (error: any) {
    error.value = error.response?.data?.message || 'Failed to load products.';
  } finally {
    loading.value = false;
  }
}

onMounted(load);
</script>

<template>
  <section class="p-6">
    <h1 class="text-2xl font-bold mb-4"> Product </h1>
    <p v-if="loading">Loading...</p>
    <p v-else-if="error" class="text-red-600">{{ error }}</p>
    <ul v-else class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <li v-for="(p, i) in items" :key="i" class="border rounded-xl p-4">
        <p class="font-semibold">{{ p.name }}</p>
        <p class="opacity-70">{{ p.price }}</p>
      </li>

    </ul>

  </section>
</template>


<style scoped></style>