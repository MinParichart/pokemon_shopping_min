<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">

    <div class="w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden animate-fade-in-up">

      <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <h1 class="text-xl font-semibold text-slate-800">
          {{ isEdit ? 'แก้ไขสินค้า' : 'เพิ่มสินค้าใหม่' }}
        </h1>
        <button @click="$emit('close')" class="text-slate-400 hover:text-slate-600 transition">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>

      <div class="p-6 max-h-[80vh] overflow-y-auto">
        <form class="space-y-4" @submit.prevent="onSubmit">
          <div>
            <label class="block text-sm mb-1 font-medium text-slate-700">ชื่อสินค้า</label>
            <input v-model="form.name" required
              class="w-full border border-slate-300 rounded-lg px-4 py-2 text-base focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition" />
          </div>
          <div>
            <label class="block text-sm mb-1 font-medium text-slate-700">คำอธิบาย</label>
            <textarea v-model="form.description" rows="3"
              class="w-full border border-slate-300 rounded-lg px-4 py-2 text-base focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"></textarea>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm mb-1 font-medium text-slate-700">ราคา (฿)</label>
              <input v-model.number="form.price" type="number" min="0" required
                class="w-full border border-slate-300 rounded-lg px-4 py-2 text-base focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition" />
            </div>
            <div>
              <label class="block text-sm mb-1 font-medium text-slate-700">จำนวนในสต็อก</label>
              <input v-model.number="form.stock" type="number" min="0" required
                class="w-full border border-slate-300 rounded-lg px-4 py-2 text-base focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition" />
            </div>
          </div>
          <div>
            <label class="block text-sm mb-1 font-medium text-slate-700">หมวดหมู่
              <span class="text-red-700">*</span>
            </label>
            <input v-model="form.category" required
              class="w-full border border-slate-300 rounded-lg px-4 py-2 text-base focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition" />
          </div>
          <div>
            <label class="block text-sm mb-1 font-medium text-slate-700">URL รูปภาพ</label>
            <input v-model="form.imageUrl" required
              class="w-full border border-slate-300 rounded-lg px-4 py-2 text-base focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition" />
          </div>

          <div class="flex justify-end gap-3 pt-6 border-t border-slate-100 mt-6">
            <button type="button" @click="$emit('close')"
              class="px-6 py-2 text-sm font-medium text-slate-600 rounded-lg border border-slate-300 hover:bg-slate-50 transition">
              ยกเลิก
            </button>
            <button type="submit"
              class="px-6 py-2 text-sm font-medium rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm transition">
              บันทึก
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import type { Product, ProductPayload } from '../models/product.model';
import { productsService } from '../services/products.service';

// รับค่า product เข้ามา (ถ้ามีค่าแปลว่าแก้ไข ถ้า null แปลว่าเพิ่มใหม่)
const props = defineProps<{
  product: Product | null;
}>();

// ส่ง event บอกหน้าแม่
const emit = defineEmits(['close', 'saved']);

// เช็คว่าเป็นโหมดแก้ไขหรือไม่จาก props
const isEdit = computed(() => !!props.product);

const form = reactive<ProductPayload>({
  name: '',
  description: '',
  price: 0,
  stock: 0,
  category: '',
  imageUrl: '',
});

// *** Watcher: คอยดูว่าถ้า props.product เปลี่ยน ให้เอาข้อมูลยัดใส่ฟอร์ม ***
watch(() => props.product, (newVal) => {
  if (newVal) {
    // โหมดแก้ไข: เอาข้อมูลใส่ฟอร์ม
    form.name = newVal.name;
    form.description = newVal.description;
    form.price = newVal.price;
    form.stock = newVal.stock;
    form.category = newVal.category;
    form.imageUrl = newVal.imageUrl;
  } else {
    // โหมดเพิ่มใหม่: ล้างฟอร์ม
    form.name = '';
    form.description = '';
    form.price = 0;
    form.stock = 0;
    form.category = '';
    form.imageUrl = '';
  }
}, { immediate: true });

async function onSubmit() {
  try {
    if (isEdit.value && props.product) {
      // แก้ไข
      await productsService.updateProduct(props.product.id, form);
    } else {
      // เพิ่มใหม่
      await productsService.createProduct(form);
    }
    // ทำเสร็จแล้วบอกหน้าแม่ว่า "บันทึกแล้วนะ" (saved) และ "ปิดได้เลย" (close)
    emit('saved');
    emit('close');
  } catch (error) {
    alert('เกิดข้อผิดพลาดในการบันทึก');
  }
}
</script>

<style scoped>
/* เพิ่ม Animation เล็กน้อยให้ดูนุ่มนวล */
.animate-fade-in-up {
  animation: fadeInUp 0.3s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>