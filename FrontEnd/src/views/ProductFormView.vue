<template>
  <BaseModal :title="isEdit ? 'แก้ไขสินค้า' : 'เพิ่มสินค้าใหม่'" @close="$emit('close')">
    <form class="space-y-4" @submit.prevent="onSubmit">
      <BaseInput v-model="form.name" label="ชื่อสินค้า" required />
      <BaseInput v-model="form.description" type="textarea" label="คำอธิบาย" />

      <div class="grid grid-cols-2 gap-4">
        <BaseInput v-model="form.price" type="number" label="ราคา (฿)" required />
        <BaseInput v-model="form.stock" type="number" label="จำนวนในสต็อก" required />
      </div>

      <BaseInput v-model="form.category" label="หมวดหมู่" required />
      <BaseInput v-model="form.imageUrl" label="URL รูปภาพ" required />

      <div class="flex justify-end gap-3 pt-6 border-t border-slate-100 mt-6">
        <BaseButton variant="outline" @click="$emit('close')">ยกเลิก</BaseButton>
        <BaseButton type="submit" variant="primary">บันทึก</BaseButton>
      </div>
    </form>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import type { Product, ProductPayload } from '../models/product.model';
import { productsService } from '../services/products.service';
import BaseModal from '../components/common/BaseModal.vue';
import BaseInput from '../components/common/BaseInput.vue';
import BaseButton from '../components/common/BaseButton.vue';

const props = defineProps<{ product: Product | null; }>();
const emit = defineEmits(['close', 'saved']);
const isEdit = computed(() => !!props.product);

const form = reactive<ProductPayload>({
  name: '', description: '', price: 0, stock: 0, category: '', imageUrl: '',
});

watch(() => props.product, (newVal) => {
  if (newVal) Object.assign(form, newVal);
  else Object.assign(form, { name: '', description: '', price: 0, stock: 0, category: '', imageUrl: '' });
}, { immediate: true });

async function onSubmit() {
  try {
    if (isEdit.value && props.product) await productsService.updateProduct(props.product.id, form);
    else await productsService.createProduct(form);
    emit('saved'); emit('close');
  } catch (error) { alert('เกิดข้อผิดพลาดในการบันทึก'); }
}
</script>