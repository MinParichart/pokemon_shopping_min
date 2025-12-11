<template>
  <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
    <table class="w-full text-base">
      <thead class="bg-slate-50/80 text-sm text-slate-500">
        <tr class="border-b border-slate-200/70">
          <th class="px-6 py-3 text-left font-semibold">รูปภาพสินค้า</th>
          <th class="px-6 py-3 text-left font-semibold">ชื่อสินค้า</th>
          <th class="px-6 py-3 text-right font-semibold">ราคา</th>
          <th class="px-6 py-3 text-right font-semibold">จำนวนคงเหลือ</th>
          <th class="px-6 py-3 text-left font-semibold">หมวดหมู่</th>
          <th class="px-6 py-3 text-center font-semibold">จัดการ</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in products" :key="p.id" class="border-b border-slate-100 hover:bg-slate-50/60 transition">
          <td class="px-6 py-4">
            <img :src="p.imageUrl" :alt="p.name" class="w-18 h-18 object-contain rounded-md bg-slate-50" />
          </td>
          <td class="px-6 py-4 text-slate-800">{{ p.name }}</td>
          <td class="px-6 py-4 text-right text-slate-800">฿{{ p.price }}</td>
          <td class="px-6 py-4 text-right text-slate-800">{{ p.stock }}</td>
          <td class="px-6 py-4 text-slate-700">{{ p.category }}</td>
          <td class="px-6 py-4 text-center whitespace-nowrap">
            <BaseButton variant="text-primary" @click="$emit('edit', p)" title="แก้ไข">
              <span class="material-symbols-outlined cursor-pointer">edit</span>
            </BaseButton>
            <BaseButton variant="text-danger" @click="$emit('remove', p.id)" title="ลบ">
              <span class="material-symbols-outlined cursor-pointer">delete</span>
            </BaseButton>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="products.length === 0" class="px-6 py-5 text-sm text-slate-500 text-center">ไม่มีสินค้า</div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '../../models/product.model';
import BaseButton from '../common/BaseButton.vue';

defineProps<{ products: Product[] }>();
defineEmits(['edit', 'remove']);
</script>