<template>
  <div class="bg-white rounded-xl shadow-sm border p-4 flex flex-col">
    <img :src="product.imageURL" :alt="product.name" class="w-24 h-24 object-contain mx-auto mb-4" />
    <h3 class="font-semibold text-slate-800 text-center">
      {{ product.name }}
    </h3>
    <p class="text-xs text-slate-400 text-center mb-2">
      {{ product.category }}
    </p>
    <p class="text-red-500 font-bold text-center mb-3">
      ฿{{ product.price }}
    </p>

    <button v-if="product.stock > 0"
      class="mt-auto bg-emerald-500 text-white text-sm py-2 rounded-lg hover:bg-emerald-600" @click="$emit('add')">
      เพิ่มไปยังรถเข็น
    </button>
    <button v-else disabled class="mt-auto bg-slate-200 text-slate-500 text-sm py-2 rounded-lg">
      สินค้าหมด
    </button>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '../models/product.model';

defineProps<{
  product: Product;
}>();

defineEmits<{
  (event: 'add'): void;
}>();
</script>
