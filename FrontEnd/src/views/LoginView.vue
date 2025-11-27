<template>
  <div>
    <h1 class="text-xl font-semibold mb-4 text-center">เข้าสู่ระบบ</h1>

    <form class="space-y-4" @submit.prevent="onSubmit">
      <div>
        <label class="block text-sm mb-1">Username</label>
        <input
          v-model="username"
          type="text"
          required
          class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />
      </div>
      <div>
        <label class="block text-sm mb-1">Password</label>
        <input
          v-model="password"
          type="password"
          required
          class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />
      </div>

      <div class="space-y-2 mt-2">
        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-emerald-500 text-white py-2 rounded-lg hover:bg-emerald-600"
        >
          {{ loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ' }}
        </button>
        <RouterLink
          to="/register"
          class="block w-full text-center bg-blue-500 text-white py-2 rounded-lg text-sm hover:bg-blue-600"
        >
          ลงทะเบียน
        </RouterLink>
      </div>
    </form>

    <p v-if="error" class="mt-3 text-xs text-red-500 text-center">
      {{ error }}
    </p>

    <div class="mt-4 text-center">
      <RouterLink
        to="/admin/login"
        class="text-xs text-slate-400 underline"
      >
        เข้าสู่ระบบสำหรับผู้ดูแล (Admin)
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuth } from '../composables/useAuth';

const { loginUser } = useAuth();

const username = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');

async function onSubmit() {
  loading.value = true;
  error.value = '';
  try {
    await loginUser(username.value, password.value);
  } catch (e) {
    error.value = 'เข้าสู่ระบบไม่สำเร็จ กรุณาตรวจสอบข้อมูลอีกครั้ง';
  } finally {
    loading.value = false;
  }
}
</script>
