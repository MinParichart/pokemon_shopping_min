<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-100">
    <div class="w-full max-w-md bg-white rounded-xl shadow-md p-8">
      <div class="flex flex-col items-center mb-6">
        <div class="w-48 h-20 bg-slate-800 text-white flex items-center justify-center rounded-lg mb-4 text-lg font-semibold tracking-widest">
          WUNCA
        </div>
        <p class="text-xs text-slate-500">45th WUNCA - Pokemon Shopping</p>
      </div>
      <RouterView />
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>
