<template>
  <transition name="fade">
    <div v-if="visible"
      class="fixed bottom-4 right-4 bg-white border border-emerald-200 shadow-lg rounded-lg px-4 py-3 flex items-center gap-2 z-[999]">
      <div class="w-2 h-2 rounded-full" :class="type === 'error' ? 'bg-red-500' : 'bg-emerald-500'" />
      <p class="text-sm text-slate-800">{{ message }}</p>
      <button class="text-xs text-slate-400 ml-3" @click="close">x</button>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue';

const props = defineProps<{ message: string; duration?: number; type?: 'success' | 'error' }>();
const emit = defineEmits(['close']);
const visible = ref(true);

function close() {
  visible.value = false;
  emit('close');
}

watchEffect(() => {
  if (props.duration) {
    const timer = setTimeout(close, props.duration);
    return () => clearTimeout(timer);
  }
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>