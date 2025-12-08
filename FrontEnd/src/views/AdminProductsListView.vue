<template>
  <div class="space-y-5">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-semibold">จัดการสินค้า</h1>
      <button @click="openCreateModal"
        class="bg-emerald-500 hover:bg-emerald-600 text-white text-sm px-5 py-2 rounded-lg shadow-sm transition">
        เพิ่มสินค้าใหม่
      </button>
    </div>

    <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div class="flex flex-wrap items-center justify-between gap-3 px-6 pt-4 pb-3 border-b border-slate-200/70">
        <div class="relative w-full max-w-sm">
          <span
            class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
          <input v-model="keyword" type="text" placeholder="ค้นหาสินค้า"
            class="w-full border border-slate-300 rounded-lg px-3 pl-9 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
        </div>
        <p class="text-xs sm:text-sm text-slate-400">ทั้งหมด {{ filteredProducts.length }} รายการ</p>
      </div>

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
          <tr v-for="p in filteredProducts" :key="p.id"
            class="border-b border-slate-100 hover:bg-slate-50/60 transition">
            <td class="px-6 py-4">
              <img :src="p.imageUrl" :alt="p.name" class="w-18 h-18 object-contain rounded-md bg-slate-50" />
            </td>
            <td class="px-6 py-4 text-slate-800">{{ p.name }}</td>
            <td class="px-6 py-4 text-right text-slate-800">฿{{ p.price }}</td>
            <td class="px-6 py-4 text-right text-slate-800">{{ p.stock }}</td>
            <td class="px-6 py-4 text-slate-700">{{ p.category }}</td>
            <td class="px-6 py-4 text-center whitespace-nowrap">

              <button @click="openEditModal(p)"
                class="text-xs text-emerald-600 hover:text-emerald-700 mr-4 transition cursor-pointer" title="แก้ไข">
                <span class="material-symbols-outlined"> edit </span>
              </button>

              <button class="text-xs text-red-500 hover:text-red-600 transition cursor-pointer" @click="remove(p.id)"
                title="ลบ">
                <span class="material-symbols-outlined"> delete </span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="filteredProducts.length === 0" class="px-6 py-5 text-sm text-slate-500 text-center">ไม่มีสินค้า</div>
    </div>

    <ProductFormView v-if="showModal" :product="selectedProduct" @close="closeModal" @saved="load" />

  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import type { Product } from '../models/product.model';
import { productsService } from '../services/products.service';
// Import Form เข้ามา (Path ต้องถูกนะ เช็คดูว่าไฟล์อยู่โฟลเดอร์เดียวกันไหม)
import ProductFormView from './ProductFormView.vue';

const products = ref<Product[]>([]);
const keyword = ref('');

// *** ตัวแปรควบคุม Modal ***
const showModal = ref(false);
const selectedProduct = ref<Product | null>(null);

async function load() {
  products.value = await productsService.getProducts();
}
onMounted(load);

const filteredProducts = computed(() => {
  const k = keyword.value.trim().toLowerCase();
  if (!k) return products.value;
  return products.value.filter(
    (p) => p.name.toLowerCase().includes(k) || (p.category ?? '').toLowerCase().includes(k)
  );
});

async function remove(id: number) {
  if (!confirm('ต้องการลบสินค้านี้หรือไม่?')) return;
  await productsService.deleteProduct(id);
  await load();
}

// *** ฟังก์ชันเปิด Modal แก้ไข ***
function openEditModal(product: Product) {
  selectedProduct.value = product; // ส่งสินค้าตัวนั้นเข้าไป
  showModal.value = true;          // เปิด Modal
}

// *** ฟังก์ชันเปิด Modal สร้างใหม่ (แถมให้) ***
function openCreateModal() {
  selectedProduct.value = null;    // ส่ง null เข้าไปเพื่อให้รู้ว่าเป็นของใหม่
  showModal.value = true;
}

// *** ฟังก์ชันปิด Modal ***
function closeModal() {
  showModal.value = false;
  selectedProduct.value = null;
}
</script>