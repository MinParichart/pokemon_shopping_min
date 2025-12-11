<template>
  <div class="space-y-5">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-semibold">จัดการสินค้า</h1>
      <BaseButton @click="openCreateModal">เพิ่มสินค้าใหม่</BaseButton>
    </div>

    <div class="flex items-center justify-between gap-3 mb-4">
      <div class="w-full max-w-sm">
        <BaseInput v-model="keyword" placeholder="ค้นหาสินค้า">
          <template #icon><span class="material-symbols-outlined">search</span></template>
        </BaseInput>
      </div>
      <p class="text-xs sm:text-sm text-slate-400">ทั้งหมด {{ filteredProducts.length }} รายการ</p>
    </div>

    <ProductTable :products="filteredProducts" @edit="openEditModal" @remove="remove" />

    <ProductFormView v-if="showModal" :product="selectedProduct" @close="closeModal" @saved="load" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import BaseButton from '../components/common/BaseButton.vue';
import BaseInput from '../components/common/BaseInput.vue';
import ProductTable from '../components/product/ProductTable.vue';
import type { Product } from '../models/product.model';
import { productsService } from '../services/products.service';
import ProductFormView from './ProductFormView.vue';

const products = ref<Product[]>([]);
const keyword = ref('');
const showModal = ref(false);
const selectedProduct = ref<Product | null>(null);

async function load() {
  products.value = await productsService.getProducts();
}
onMounted(load);

const filteredProducts = computed(() => {
  const k = keyword.value.trim().toLowerCase();
  if (!k) return products.value;
  return products.value.filter((p) => p.name.toLowerCase().includes(k) || (p.category ?? '').toLowerCase().includes(k));
});

async function remove(id: number) {
  if (!confirm('ต้องการลบสินค้านี้หรือไม่?')) return;
  await productsService.deleteProduct(id);
  await load();
}

function openEditModal(product: Product) { selectedProduct.value = product; showModal.value = true; }
function openCreateModal() { selectedProduct.value = null; showModal.value = true; }
function closeModal() { showModal.value = false; selectedProduct.value = null; }
</script>