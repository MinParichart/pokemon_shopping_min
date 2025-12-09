<template>
  <div class="bg-slate-200 p-1 rounded-lg border border-slate-200 flex w-full flex-wrap gap-1">
    <button v-for="tab in tabs" :key="tab.value"
      class="flex-1 text-center px-6 py-2 rounded-md text-sm font-extrabold transition-all duration-200"
      :class="modelValue === tab.value ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'"
      @click="$emit('update:modelValue', tab.value)">
      {{ tab.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{ modelValue: string }>();
defineEmits(['update:modelValue']);

const tabs = [
  { value: 'ALL', label: 'ทั้งหมด' },
  { value: 'PENDING', label: 'รอการยืนยันคำสั่งซื้อ' },
  { value: 'CONFIRM', label: 'ยืนยันคำสั่งซื้อ' },
  { value: 'REJECT', label: 'ปฏิเสธคำสั่งซื้อ' },
  { value: 'CANCEL', label: 'ยกเลิกคำสั่งซื้อ' },
];
</script>