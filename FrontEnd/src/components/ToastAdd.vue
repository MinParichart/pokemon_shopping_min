<template>
  <!-- Toast แจ้งเตือน (ใช้งานร่วมกับ transition ชื่อ fade) -->
  <transition name="fade">
    <!-- กล่อง toast จะแสดงเมื่อ visible = true -->
    <div v-if="visible"
      class="fixed bottom-4 right-4 bg-white border border-emerald-200 shadow-lg rounded-lg px-4 py-3 flex items-center gap-2">
      <!-- จุดสีเขียวด้านหน้า -->
      <div class="w-2 h-2 rounded-full bg-emerald-500" />

      <!-- ข้อความที่รับมาจาก prop -->
      <p class="text-sm text-slate-800">{{ message }}</p>

      <!-- ปุ่มปิด toast ด้วยตัวเอง -->
      <button class="text-xs text-slate-400 ml-3" @click="close">x</button>
    </div>
  </transition>
</template>

<script setup lang="ts">
// import helper จาก Vue
import { defineEmits, defineProps, ref, watchEffect } from 'vue';

// รับค่า message และ duration จาก parent
const props = defineProps<{
  message: string;   // ข้อความที่จะแสดง
  duration?: number; // เวลาในการแสดง (ms) ถ้าไม่ส่งมา = ไม่ auto-close
}>();

// emit event 'close' เพื่อบอก parent ว่า toast ถูกปิดแล้ว
const emit = defineEmits<{
  (event: 'close'): void;
}>();

// state ควบคุมการแสดงผลของ toast
const visible = ref(true);

// ฟังก์ชันปิด toast
function close() {
  visible.value = false;
  emit('close');
}

// ตั้ง timer ให้ปิดเองถ้ามีการส่ง duration เข้ามา
watchEffect(() => {
  if (!props.duration) return;
  const timer = setTimeout(() => {
    close();
  }, props.duration);

  // clear timer ถ้ามีการ re-run effect หรือ component ถูกทำลาย
  return () => clearTimeout(timer);
});
</script>

<style scoped>
/* effect ละลายเข้า-ออก ของ toast */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
