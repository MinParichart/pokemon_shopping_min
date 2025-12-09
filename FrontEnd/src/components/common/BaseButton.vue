<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    class="inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
    :class="classes"
  >
    <div v-if="loading" class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
    <span v-else class="flex items-center gap-2">
      <slot name="icon"></slot>
      <slot />
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  type: { type: String as () => 'button' | 'submit' | 'reset', default: 'button' },
  variant: { type: String, default: 'primary' }, // primary, danger, outline, text-danger
  loading: Boolean,
  disabled: Boolean,
  block: Boolean, // เต็มความกว้าง
});

const classes = computed(() => {
  let base = props.block ? 'w-full py-2' : 'px-4 py-2';
  
  switch (props.variant) {
    case 'primary': // ปุ่มสีเขียวหลัก
      return `${base} bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm`;
    case 'outline': // ปุ่มขอบเทา (Cancel)
      return `${base} border border-slate-300 text-slate-600 hover:bg-slate-50`;
    case 'danger': // ปุ่มสีแดง
      return `${base} bg-red-500 text-white hover:bg-red-600`;
    case 'text-danger': // ปุ่มไอคอนถังขยะ (ไม่มีพื้นหลัง)
      return 'text-xs text-red-500 hover:text-red-600 p-1';
    case 'text-primary': // ปุ่มไอคอนแก้ไข
      return 'text-xs text-emerald-600 hover:text-emerald-700 p-1';
    default:
      return base;
  }
});
</script>