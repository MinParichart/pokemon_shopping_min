<template>
  <div v-if="count > 0" class="flex gap-3 animate-fade-in h-10">
    <BaseButton variant="primary" @click="$emit('confirm')" class="gap-2">
      <span class="material-symbols-outlined text-[18px]">check_circle</span>
      ยืนยันการสั่งซื้อ
      <span class="ml-1 text-xs bg-white/20 px-1.5 rounded-full">{{ count }}</span>
    </BaseButton>

    <BaseButton variant="danger" @click="$emit('reject')" class="gap-2">
      <span class="material-symbols-outlined text-[18px]">cancel</span>
      ปฏิเสธการสั่งซื้อ
      <span class="ml-1 text-xs bg-white/20 px-1.5 rounded-full">{{ count }}</span>
    </BaseButton>
  </div>
  <div v-else class="h-10"></div>
</template>

<script setup lang="ts">
import BaseButton from '../common/BaseButton.vue';
defineProps<{ count: number }>();
defineEmits(['confirm', 'reject']);
</script>