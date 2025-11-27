<script setup lang="ts">
import { defineProps } from "vue";
import type { Product } from "../models/product.model";

const props = defineProps<{
  product: Product;
  onAdd?: (product: Product) => void; // event callback
}>();

// ส่วนของฟังก์ชันจัดการการเพิ่มสินค้าไปยังรถเข็น
function handleAdd() {
  if (props.onAdd) {
    props.onAdd(props.product);
  }
}
</script>

<template>
  <li class="border rounded-2xl p-4 shadow-sm hover:shadow-md transition">
    <img
      v-if="product.imageURL"
      :src="product.imageURL"
      :alt="product.name"
      class="h-28 w-28 object-contain mx-auto mb-3"
    />
    <p class="font-semibold leading-tight">{{ product.name }}</p>
    <p class="text-sm opacity-60 -mt-0.5">{{ product.category || 'Pokemon' }}</p>
    <p class="text-red-600 font-bold">฿{{ product.price }}</p>
    <button
      class="px-3 py-1.5 rounded-xl text-white text-sm disabled:opacity-50"
      :class="product.stock > 0 ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-400'"
      :disabled="product.stock <= 0"
      @click="handleAdd"
    >{{ product.stock > 0 ? 'เพิ่มไปยังรถเข็น' : '🚫 สินค้าหมด' }}</button>
  </li>
</template>
