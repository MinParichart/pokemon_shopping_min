<template>
  <div class="min-h-screen flex bg-slate-100">
    <aside class="w-64 bg-white shadow-md">
      <div class="px-4 py-4 border-b flex items-center gap-2">
        <div class="w-28 h-9 bg-slate-800 text-white flex items-center justify-center rounded-md text-xs font-semibold tracking-widest">
          WUNCA
        </div>
        <span class="font-semibold text-sm text-slate-700">ADMIN</span>
      </div>
      <nav class="p-4 flex flex-col gap-2 text-sm">
        <RouterLink
          to="/admin/orders"
          class="px-3 py-2 rounded hover:bg-emerald-50"
          active-class="bg-emerald-100 text-emerald-700 font-medium"
        >
          จัดการการสั่งซื้อ
        </RouterLink>
        <RouterLink
          to="/admin/products"
          class="px-3 py-2 rounded hover:bg-emerald-50"
          active-class="bg-emerald-100 text-emerald-700 font-medium"
        >
          สินค้า
        </RouterLink>
        <button
          class="mt-4 text-left px-3 py-2 rounded text-red-500 hover:bg-red-50"
          @click="logoutToAdminLogin"
        >
          ออกจากระบบ
        </button>
      </nav>
    </aside>

    <main class="flex-1 p-6">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '../composables/useAuth';

const { logoutToAdminLogin } = useAuth();
</script>
