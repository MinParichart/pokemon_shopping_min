<template>
  <div class="mx-auto max-w-4xl p-8 bg-white rounded-xl shadow-lg">
    <h1 class="text-2xl font-semibold mb-6">
      {{ isEdit ? 'แก้ไขสินค้า' : 'เพิ่มสินค้าใหม่' }}
    </h1>

    <form class="space-y-4" @submit.prevent="onSubmit">
      <div>
        <label class="block text-sm mb-1 font-medium">ชื่อสินค้า</label>
        <input v-model="form.name" required
          class="w-full border rounded-lg px-4 py-2 text-base focus:ring-emerald-500 focus:border-emerald-500" />
      </div>
      <div>
        <label class="block text-sm mb-1 font-medium">คำอธิบาย</label>
        <textarea v-model="form.description" rows="4"
          class="w-full border rounded-lg px-4 py-2 text-base focus:ring-emerald-500 focus:border-emerald-500"></textarea>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm mb-1 font-medium">ราคา (฿)</label>
          <input v-model.number="form.price" type="number" min="0" required
            class="w-full border rounded-lg px-4 py-2 text-base focus:ring-emerald-500 focus:border-emerald-500" />
        </div>
        <div>
          <label class="block text-sm mb-1 font-medium">จำนวนในสต็อก</label>
          <input v-model.number="form.stock" type="number" min="0" required
            class="w-full border rounded-lg px-4 py-2 text-base focus:ring-emerald-500 focus:border-emerald-500" />
        </div>
      </div>
      <div>
        <label class="block text-sm mb-1 font-medium">หมวดหมู่</label>
        <input v-model="form.category" required
          class="w-full border rounded-lg px-4 py-2 text-base focus:ring-emerald-500 focus:border-emerald-500" />
      </div>
      <div>
        <label class="block text-sm mb-1 font-medium">URL รูปภาพ</label>
        <input v-model="form.imageUrl" required
          class="w-full border rounded-lg px-4 py-2 text-base focus:ring-emerald-500 focus:border-emerald-500" />
      </div>

      <div class="flex justify-end gap-3 pt-6">
        <RouterLink to="/admin/products"
          class="px-6 py-2 text-sm rounded-lg border border-slate-300 hover:bg-slate-50 transition">
          ยกเลิก
        </RouterLink>
        <button type="submit"
          class="px-6 py-2 text-sm rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition">
          บันทึก
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { ProductPayload } from '../models/product.model';
import { productsService } from '../services/products.service';

const route = useRoute();
const router = useRouter();

// ตรวจสอบว่าเป็นโหมดแก้ไขหรือไม่
const isEdit = computed(() => !!route.params.id);

const form = reactive<ProductPayload>({
  name: '',
  description: '',
  price: 0,
  stock: 0,
  category: '',
  imageUrl: '',
});

// หากเป็นโหมดแก้ไข ให้ดึงข้อมูลสินค้ามาใส่ในฟอร์ม
onMounted(async () => {
  if (isEdit.value) {
    const id = Number(route.params.id);
    const product = await productsService.getProduct(id);
    form.name = product.name;
    form.description = product.description;
    form.price = product.price;
    form.stock = product.stock;
    form.category = product.category;
    form.imageUrl = product.imageUrl;
  }
});

// ฟังก์ชันส่งฟอร์ม (สร้าง/อัปเดต)
async function onSubmit() {
  if (isEdit.value) {
    const id = Number(route.params.id);
    await productsService.updateProduct(id, form);
  } else {
    await productsService.createProduct(form);
  }
  // นำทางกลับไปหน้าตารางสินค้าเมื่อเสร็จสิ้น
  router.push('/admin/products');
}
</script>