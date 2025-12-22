<template>
  <!-- การ์ดสินค้าแต่ละชิ้น -->
  <div class="bg-gray-100 rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col">
    <!-- รูปสินค้า -->
    <img :src="product.imageUrl" :alt="product.name" class="w-48 h-48 object-contain mx-auto my-6" />

    <!-- ชื่อสินค้า -->
    <h3 class="font-semibold text-slate-800 text-start">
      {{ product.name }}
    </h3>

    <!-- หมวดหมู่สินค้า -->
    <p class="text-xs text-slate-400 text-start mb-2">
      {{ product.category }}
    </p>

    <!-- ราคาสินค้า -->
    <p class="text-red-500 text-2xl font-bold text-end mb-3">
      ฿{{ product.price }}
    </p>

    <!-- ปุ่มเพิ่มลงรถเข็น (กรณีมี stock) -->
    <button v-if="product.stock > 0" :data-testid="`addOrder-${product.id}`"
      class="mt-auto bg-emerald-500 text-white text-sm py-2 rounded-lg hover:bg-emerald-600" @click="$emit('add')">
      <span class="material-symbols-outlined inline-block align-middle">
        add_shopping_cart
      </span>
      เพิ่มไปยังรถเข็น
    </button>

    <!-- ปุ่มแสดงสถานะสินค้าหมด (กรณี stock = 0) -->
    <button v-else disabled :data-testid="`outOfStock-${product.id}`"
      class="mt-auto bg-slate-200 text-slate-500 text-sm py-2 rounded-lg inline-flex items-center justify-center gap-2">
      <span class="material-symbols-outlined"> block </span>
      สินค้าหมด
    </button>
  </div>
</template>

<script setup lang="ts">
// type ของสินค้า ที่ import มาจาก model ส่วนกลาง
import type { Product } from '../../models/product.model';

// รับ prop product เข้ามา (ข้อมูลของสินค้าตัวนี้)
const props = defineProps<{
  product: Product;
}>();

// ประกาศ emit event 'add' เพื่อให้ parent รู้ว่า user กดเพิ่มลงรถเข็น
const emit = defineEmits<{
  (event: 'add'): void;
}>();
</script>
