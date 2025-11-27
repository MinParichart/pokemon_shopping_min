<template>
  <div class="max-w-xl">
    <h1 class="text-2xl font-semibold mb-4">
      {{ isEdit ? 'แก้ไขสินค้า' : 'เพิ่มสินค้าใหม่' }}
    </h1>

    <form class="space-y-3" @submit.prevent="onSubmit">
      <div>
        <label class="block text-sm mb-1">ชื่อสินค้า</label>
        <input
          v-model="form.name"
          required
          class="w-full border rounded-lg px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label class="block text-sm mb-1">คำอธิบาย</label>
        <textarea
          v-model="form.description"
          rows="3"
          class="w-full border rounded-lg px-3 py-2 text-sm"
        ></textarea>
      </div>
      <div>
        <label class="block text-sm mb-1">ราคา (฿)</label>
        <input
          v-model.number="form.price"
          type="number"
          min="0"
          required
          class="w-full border rounded-lg px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label class="block text-sm mb-1">จำนวนในสต็อก</label>
        <input
          v-model.number="form.stock"
          type="number"
          min="0"
          required
          class="w-full border rounded-lg px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label class="block text-sm mb-1">หมวดหมู่</label>
        <input
          v-model="form.category"
          required
          class="w-full border rounded-lg px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label class="block text-sm mb-1">URL รูปภาพ</label>
        <input
          v-model="form.imageUrl"
          required
          class="w-full border rounded-lg px-3 py-2 text-sm"
        />
      </div>

      <div class="flex justify-end gap-3 pt-4">
        <RouterLink
          to="/admin/products"
          class="px-4 py-2 text-sm rounded-lg border"
        >
          ยกเลิก
        </RouterLink>
        <button
          type="submit"
          class="px-4 py-2 text-sm rounded-lg bg-emerald-500 text-white"
        >
          บันทึก
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { ProductPayload } from '../models/product.model';
import { productsService } from '../services/products.service';

const route = useRoute();
const router = useRouter();

const isEdit = computed(() => !!route.params.id);

const form = reactive<ProductPayload>({
  name: '',
  description: '',
  price: 0,
  stock: 0,
  category: '',
  imageUrl: ''
});

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

async function onSubmit() {
  if (isEdit.value) {
    const id = Number(route.params.id);
    await productsService.updateProduct(id, form);
  } else {
    await productsService.createProduct(form);
  }
  router.push('/admin/products');
}
</script>
