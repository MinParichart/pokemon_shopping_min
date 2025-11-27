<template>
  <transition name="fade">
    <div v-if="visible" class="fixed bottom-6 right-6 bg-white border shadow-lg rounded-xl px-4 py-3 text-sm">
      ✅ {{ text }}
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, watchEffect } from "vue";
import { defineProps, defineEmits } from "vue";

// กำหนด props และ emits เพื่อ
const props = defineProps<{ text: string; show: boolean }>();
const emit = defineEmits<{ (emit: "close"): void }>();

const visible = ref(false);
watchEffect(() => {
  visible.value = props.show;
  if (props.show) setTimeout(() => emit("close"), 1800);
});
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity .2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>