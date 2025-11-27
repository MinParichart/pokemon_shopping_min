<template>
  <div class="min-h-screen flex flex-col bg-slate-50">
    <header class="bg-white shadow-sm">
      <div class="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div
            class="w-32 h-10 bg-slate-800 text-white flex items-center justify-center rounded-md text-xs font-semibold tracking-widest">
            WUNCA
          </div>
          <RouterLink to="/products" class="text-sm font-medium text-slate-700">
            สินค้าทั้งหมด
          </RouterLink>
        </div>

        <div class="flex items-center gap-4 text-sm">
          <RouterLink to="/cart" class="relative flex items-center gap-1 text-slate-700">
            <span>รถเข็น ({{ cart.count }})</span>
          </RouterLink>

          <RouterLink to="/my-orders" class="text-slate-700">
            รายการสั่งซื้อของฉัน
          </RouterLink>

          <button class="flex items-center gap-1 text-slate-700" @click="logoutToLogin">
            <span>ออกจากระบบ</span>
          </button>
        </div>
      </div>
    </header>

    <main class="flex-1">
      <div class="max-w-6xl mx-auto px-4 py-8">
        <RouterView />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '../composables/useAuth';
import { useCartStore } from '../stores/cart';

const { logoutToLogin } = useAuth();
const cart = useCartStore();
</script>
