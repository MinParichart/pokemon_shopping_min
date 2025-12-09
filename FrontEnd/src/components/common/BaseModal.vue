<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade">
    <div class="w-full bg-white rounded-xl shadow-2xl overflow-hidden animate-scale" :class="maxWidthClass">
      
      <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <h1 class="text-xl font-semibold text-slate-800">{{ title }}</h1>
        <button @click="$emit('close')" class="text-slate-400 hover:text-slate-600 transition">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>

      <div class="p-6 max-h-[80vh] overflow-y-auto">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  title: String,
  size: { type: String, default: 'md' } // sm, md, lg
});

defineEmits(['close']);

const maxWidthClass = computed(() => {
  switch (props.size) {
    case 'sm': return 'max-w-md';
    case 'lg': return 'max-w-4xl';
    default: return 'max-w-2xl';
  }
});
</script>

<style scoped>
.animate-fade { animation: fadeIn 0.2s ease-out; }
.animate-scale { animation: scaleUp 0.2s ease-out; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes scaleUp { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
</style>