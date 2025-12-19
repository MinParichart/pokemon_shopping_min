<template>
  <div>
    <h1 class="text-2xl font-semibold mb-6 text-center">สินค้าทั้งหมด</h1>
    <div class="relative w-full max-w-xl mx-auto mb-6">
      <span
        class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
      <input v-model="search" type="text" placeholder="ค้นหาสินค้าทั้งหมด"
        class="w-full border border-gray-500 rounded-lg px-4 pl-10 py-2 text-sm" />
    </div>

    <div v-if="loading" class="text-sm text-slate-500">กำลังโหลด...</div>
    <div v-else class="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      <ProductCard v-for="product in filteredProducts" :key="product.id" :product="product" @add="addToCart(product)" />
    </div>

    <BaseToast v-if="toast.show" :message="toast.message" :type="toast.type" @close="toast.show = false" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import ProductCard from '../components/product/ProductCard.vue';
import BaseToast from '../components/common/BaseToast.vue';
import { productsService } from '../services/products.service';
import { useCartStore } from '../stores/cart';
import type { Product } from '../models/product.model';

const products = ref<Product[]>([]);
const search = ref('');
const loading = ref(false);
const cart = useCartStore();
const toast = reactive({ show: false, message: '', type: 'success' as 'success' | 'error' });

const filteredProducts = computed(() => {
  if (!search.value) return products.value;
  return products.value.filter((p) => p.name.toLowerCase().includes(search.value.toLowerCase()));
});

onMounted(async () => {
  loading.value = true;
  try { products.value = await productsService.getProducts(); } finally { loading.value = false; }
});

function addToCart(p: Product) {
  const ok = cart.addProduct(p);
  toast.message = ok ? `เพิ่มสินค้า ${p.name} ลงในรถเข็นแล้ว` : `สินค้า "${p.name}" หมดหรือครบจำนวนแล้ว`;
  toast.type = ok ? 'success' : 'error';
  toast.show = true;
}
</script>