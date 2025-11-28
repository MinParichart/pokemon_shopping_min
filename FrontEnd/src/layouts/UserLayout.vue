<template>
  <div class="min-h-screen flex flex-col bg-white">
    <!-- Header -->
    <header class="sticky top-0 z-30 bg-white shadow-sm">
      <div
        class="w-full px-4 sm:px-6 lg:px-10 py-4 flex items-center justify-between"
      >
        <!-- โลโก้ + เมนูซ้าย -->
        <div class="flex items-center gap-3">
          <div
            class="w-32 h-10 bg-slate-800 text-white flex items-center justify-center rounded-md text-xs font-semibold tracking-widest"
          >
            WUNCA
          </div>
          <RouterLink to="/products" class="text-sm font-medium text-slate-700">
            สินค้าทั้งหมด
          </RouterLink>
        </div>

        <!-- เมนูขวา -->
        <div class="flex items-center gap-6 text-sm">
          <!-- รถเข็น -->
          <RouterLink
            to="/cart"
            class="relative inline-flex items-center text-slate-700"
          >
            <span class="material-symbols-outlined text-2xl">
              shopping_cart
            </span>
            <span
              v-if="cart.count > 0"
              class="absolute -top-4 -right-2 min-w-[18px] h-[18px] rounded-full bg-emerald-500 text-white text-[10px] leading-[18px] text-center font-semibold"
            >
              {{ cart.count }}
            </span>
          </RouterLink>

          <!-- โปรไฟล์ + เมนูที่ซ่อนอยู่ -->
          <div class="relative">
            <button
              class="flex items-center justify-center w-9 h-9 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200"
              @click="isProfileOpen = !isProfileOpen"
            >
              <span class="material-symbols-outlined text-xl"> person </span>
            </button>

            <!-- Dropdown เมนู -->
            <div
              v-if="isProfileOpen"
              class="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 text-sm z-50"
            >
              <RouterLink
                to="/my-orders"
                class="block px-4 py-2 hover:bg-slate-50 text-slate-700"
                @click="isProfileOpen = false"
              >
                รายการสั่งซื้อของฉัน
              </RouterLink>

              <button
                type="button"
                class="w-full text-left px-4 py-2 text-red-500 hover:bg-red-50"
                @click="handleLogout"
              >
                ออกจากระบบ
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main content -->
    <main class="flex-1">
      <div class="max-w-7xl mx-auto px-6 lg:px-10 py-8">
        <RouterView />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuth } from '../composables/useAuth';
import { useCartStore } from '../stores/cart';

const { logoutToLogin } = useAuth();
const cart = useCartStore();

// state เปิด/ปิดเมนูโปรไฟล์
const isProfileOpen = ref(false);

function handleLogout() {
  isProfileOpen.value = false;
  logoutToLogin();
}
</script>
