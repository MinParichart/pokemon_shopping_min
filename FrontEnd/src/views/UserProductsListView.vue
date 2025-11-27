<template>
  <div>
    <h1 class="text-2xl font-semibold mb-6 text-center">สินค้าทั้งหมด</h1>
    <!-- กล่องครอบช่องค้นหา -->
    <div class="relative w-full max-w-xl mx-auto mb-6">
      <!-- ไอคอน search -->
      <span class="material-symbols-outlined
           absolute left-3 top-1/2 -translate-y-1/2
           text-slate-400 text-xl">
        search
      </span>

      <!-- ช่องค้นหา -->
      <input v-model="search" type="text" placeholder="ค้นหาสินค้าทั้งหมด"
        class="w-full border border-gray-300 rounded-lg px-4 pl-10 py-2 text-sm" />
    </div>

    <div v-if="loading" class="text-sm text-slate-500">กำลังโหลด...</div>

    <div v-else class="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      <ProductCard v-for="product in filteredProducts" :key="product.id" :product="product" @add="addToCart(product)" />
    </div>

    <ToastAdd v-if="toastMessage" :message="toastMessage" :duration="2000" @close="toastMessage = ''" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import ProductCard from "../components/ProductCard.vue";
import ToastAdd from "../components/ToastAdd.vue";
import type { Product } from "../models/product.model";
import { productsService } from "../services/products.service";
import { useCartStore } from "../stores/cart";

const products = ref<Product[]>([]);
const search = ref("");
const loading = ref(false);
const toastMessage = ref("");

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
