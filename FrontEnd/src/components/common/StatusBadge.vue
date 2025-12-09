<template>
  <span class="text-sm font-medium" :class="colorClass">
    {{ label }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ status: string }>();

const normalizeStatus = (s: string) => (s || '').toUpperCase();

const colorClass = computed(() => {
  switch (normalizeStatus(props.status)) {
    case 'PENDING': return 'text-yellow-600';
    case 'CONFIRM': return 'text-emerald-600';
    case 'REJECT': return 'text-red-500';
    case 'CANCEL': return 'text-red-700';
    default: return 'text-slate-600';
  }
});

const label = computed(() => {
  const map: Record<string, string> = {
    'PENDING': 'รอการยืนยันคำสั่งซื้อ',
    'CONFIRM': 'ยืนยันคำสั่งซื้อ',
    'REJECT': 'ปฏิเสธคำสั่งซื้อ',
    'CANCEL': 'ยกเลิกคำสั่งซื้อ',
  };
  return map[normalizeStatus(props.status)] || props.status;
});
</script>