<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-semibold">จัดการสินค้า</h1>
      <RouterLink to="/admin/products/new" class="bg-emerald-500 text-white text-sm px-4 py-2 rounded-lg">
        เพิ่มสินค้าใหม่
      </RouterLink>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-slate-50">
          <tr>
            <th class="px-4 py-2 text-left">รูปภาพสินค้า</th>
            <th class="px-4 py-2 text-left">ชื่อสินค้า</th>
            <th class="px-4 py-2 text-right">ราคา</th>
            <th class="px-4 py-2 text-right">จำนวนคงเหลือ</th>
            <th class="px-4 py-2 text-left">หมวดหมู่</th>
            <th class="px-4 py-2 text-center">จัดการ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in products" :key="p.id" class="border-t border-gray-200 hover:bg-slate-50">
            <td class="px-4 py-2">
              <img :src="p.imageUrl" :alt="p.name" class="w-10 h-10 object-contain" />
            </td>
            <td class="px-4 py-2">{{ p.name }}</td>
            <td class="px-4 py-2 text-right">฿{{ p.price }}</td>
            <td class="px-4 py-2 text-right">{{ p.stock }}</td>
            <td class="px-4 py-2">{{ p.category }}</td>
            <td class="px-4 py-2 text-center">
              <RouterLink :to="`/admin/products/${p.id}/edit`" class="text-xs text-emerald-600 mr-3">
                แก้ไข
              </RouterLink>
              <button class="text-xs text-red-500" @click="remove(p.id)">
                ลบ
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="products.length === 0" class="p-4 text-sm text-slate-500">
        ไม่มีสินค้า
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { Product } from '../models/product.model';
import { productsService } from '../services/products.service';

const products = ref<Product[]>([]);

async function load() {
  products.value = await productsService.getProducts();
}

onMounted(load);

async function remove(id: number) {
  if (!confirm('ต้องการลบสินค้านี้หรือไม่?')) return;
  await productsService.deleteProduct(id);
  await load();
}
</script>
