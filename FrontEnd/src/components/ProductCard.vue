<template>
  <div
    class="bg-gray-100 rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col"
  >
    <img
      :src="product.imageUrl"
      :alt="product.name"
      class="w-48 h-48 object-contain mx-auto my-6"
    />
    <h3 class="font-semibold text-slate-800 text-start">
      {{ product.name }}
    </h3>
    <p class="text-xs text-slate-400 text-start mb-2">
      {{ product.category }}
    </p>
    <p class="text-red-500 text-2xl font-bold text-end mb-3">
      ฿{{ product.price }}
    </p>

    <button
      v-if="product.stock > 0"
      class="mt-auto bg-emerald-500 text-white text-sm py-2 rounded-lg hover:bg-emerald-600"
      @click="$emit('add')"
    >
      <span class="material-symbols-outlined inline-block align-middle">
        add_shopping_cart
      </span>
      เพิ่มไปยังรถเข็น
    </button>
    <button
      v-else
      disabled
      class="mt-auto bg-slate-200 text-slate-500 text-sm py-2 rounded-lg inline-flex items-center justify-center gap-2"
    >
      <span class="material-symbols-outlined"> block </span>
      สินค้าหมด
    </button>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '../models/product.model';

const props = defineProps<{
  product: Product;
}>();

const emit = defineEmits<{
  (event: 'add'): void;
}>();
</script>
