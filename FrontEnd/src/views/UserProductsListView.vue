<template>
  <div>
    <h1 class="text-2xl font-semibold mb-6 text-center">สินค้าทั้งหมด</h1>

    <input
      v-model="search"
      type="text"
      placeholder="ค้นหาสินค้าทั้งหมด"
      class="w-full mb-6 border rounded-lg px-4 py-2 text-sm"
    />

    <div v-if="loading" class="text-sm text-slate-500">กำลังโหลด...</div>

    <div v-else class="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      <ProductCard
        v-for="p in filteredProducts"
        :key="p.id"
        :product="p"
        @add="addToCart(p)"
      />
    </div>

    <ToastAdd
      v-if="toastMessage"
      :message="toastMessage"
      :duration="2000"
      @close="toastMessage = ''"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { productsService } from '../services/products.service';
import type { Product } from '../models/product.model';
import { useCartStore } from '../stores/cart';
import ToastAdd from '../components/ToastAdd.vue';
import ProductCard from '../components/ProductCard.vue';

const products = ref<Product[]>([]);
const search = ref('');
const loading = ref(false);
const toastMessage = ref('');

const cart = useCartStore();

const filteredProducts = computed(() => {
  if (!search.value) return products.value;
  const keyword = search.value.toLowerCase();
  return products.value.filter((p) => p.name.toLowerCase().includes(keyword));
});

onMounted(async () => {
  loading.value = true;
  try {
    products.value = await productsService.getProducts();
  } finally {
    loading.value = false;
  }
});

function addToCart(p: Product) {
  cart.addProduct(p);
  toastMessage.value = `เพิ่มสินค้า ${p.name} ลงในรถเข็นแล้ว`;
}
</script>
