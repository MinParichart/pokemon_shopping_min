<script setup lang="ts">
import { useRouter } from 'vue-router';
const router = useRouter();

function logout() {
  localStorage.removeItem('token');
  router.replace({ name: 'Login' });
}

</script>

<template>
  <div class="min-h-screen bg-gray-50">

    <header class="sticky top-0 bg-white border-b px-6 py-3 flex justify-between">
      <h1 class="font-semibold">User</h1>
      <nav class="space-x-3 text-sm">
        <!-- router-link คือ ปุ่มหรือลิงก์ที่เปลี่ยนหน้าใน Vue โดยไม่ reload ทั้งหน้าเว็บ”  -->
        <router-link class="underline" :to="{ name: 'UserProducts' }">
          Products
        </router-link>
        <button class="underline" @click="logout">
          Logout
        </button>
      </nav>
    </header>

    <main class="max-w-6xl mx-auto">
      <!-- router-view คือ จุดวางเนื้อหา ของหน้า (component) ที่ตรงกับ route ปัจจุบันใน Vue Router -->
      <router-view />
    </main>
  </div>
</template>