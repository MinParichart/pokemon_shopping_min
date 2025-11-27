<script setup lang="ts">
import { computed, ref } from "vue";
import ProductCard from "../components/ProductCard.vue";
import ToastAdd from "../components/ToastAdd.vue";
import type { Product } from "../models/product.model";
import { getProducts } from "../services/products.service";
import { useCartStore } from "../stores/cart";

const raw = ref<Product[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

const q = ref("");
const category = ref<string>("all");
const sort = ref<"price-asc" | "price-desc" | "name-asc" | "name-desc">("name-asc");

// แบ่งหน้า
const page = ref(1);
const pageSize = ref(12);

const cart = useCartStore();

// โหลดสินค้า
async function load() {
  loading.value = true; error.value = null;
  try {
    raw.value = await getProducts();
  } catch (error: string | any) {
    error.value = error?.response?.data?.message || "โหลดสินค้าไม่สำเร็จ";
  } finally {
    loading.value = false;
  }
}

// กรอง/เรียง
const filtered = computed(() => {
  let items = [...raw.value];

  // ค้นหา
  const keyword = q.value.trim().toLowerCase();
  if (keyword) items = items.filter(p =>
    p.name.toLowerCase().includes(keyword) ||
    (p.category || "").toLowerCase().includes(keyword)
  );

  // กรองหมวด
  if (category.value !== "all")
    items = items.filter(product => (product.category || "").toLowerCase() === category.value);

  // เรียง
  switch (sort.value) {
    case "price-asc": items.sort((a, b) => a.price - b.price); break;
    case "price-desc": items.sort((a, b) => b.price - a.price); break;
    case "name-desc": items.sort((a, b) => b.name.localeCompare(a.name)); break;
    default: items.sort((a, b) => a.name.localeCompare(b.name));
  }

  return items;
});

// หน้า & total
const total = computed(() => filtered.value.length);
const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)));
const paged = computed(() => {
  const start = (page.value - 1) * pageSize.value;
  return filtered.value.slice(start, start + pageSize.value);
});

// category options (จากข้อมูลจริง)
const categories = computed(() => {
  const s = new Set<string>();
  raw.value.forEach(product => { if (product.category) s.add(product.category.toLowerCase()); });
  return ["all", ...Array.from(s.values())];
});

// Add to cart + toast
const showToast = ref(false);
const toastText = ref("");
function addToCart(product: Product) {
  cart.addItem(product);
  toastText.value = `เพิ่ม ${product.name} ลงรถเข็นแล้ว`;
  showToast.value = true;
}

load();
</script>

<template>
  <section class="p-6">
    <h1 class="text-2xl font-bold text-center mb-4">สินค้าทั้งหมด</h1>

    <!-- Controls -->
    <div class="flex flex-col sm:flex-row gap-3 justify-between items-center mb-4">
      <div class="flex gap-2 w-full sm:w-auto">
        <select v-model="category" class="border rounded-xl px-3 py-2">
          <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
        </select>
        <select v-model="sort" class="border rounded-xl px-3 py-2">
          <option value="name-asc">ชื่อ A→Z</option>
          <option value="name-desc">ชื่อ Z→A</option>
          <option value="price-asc">ราคาน้อย→มาก</option>
          <option value="price-desc">ราคามาก→น้อย</option>
        </select>
      </div>
      <input v-model="q" class="border rounded-xl px-3 py-2 w-full sm:w-96" placeholder="🔎 ค้นหาสินค้าทั้งหมด" />
    </div>

    <p v-if="loading">กำลังโหลด...</p>
    <p v-else-if="error" class="text-red-600">{{ error }}</p>

    <!-- รายการสินค้า -->
    <ul v-else class="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
      <ProductCard v-for="p in paged" :key="p.id" :product="p" :onAdd="addToCart" />
    </ul>

    <!-- Pagination -->
    <div class="flex justify-center items-center gap-2 mt-6" v-if="totalPages > 1">
      <button class="px-3 py-1 border rounded-lg" :disabled="page === 1" @click="page--">ก่อนหน้า</button>
      <span class="text-sm">หน้า {{ page }} / {{ totalPages }}</span>
      <button class="px-3 py-1 border rounded-lg" :disabled="page === totalPages" @click="page++">ถัดไป</button>
    </div>

    <ToastAdd :text="toastText" :show="showToast" @close="showToast = false" />
  </section>
</template>
