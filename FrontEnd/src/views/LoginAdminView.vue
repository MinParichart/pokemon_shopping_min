<template>
  <div>
    <h1 class="text-xl font-semibold mb-4 text-center">เข้าสู่ระบบผู้ดูแล</h1>

    <form class="space-y-4" @submit.prevent="onSubmit">
      <div>
        <label class="block text-sm mb-1">Username</label>
        <input
          v-model="username"
          type="text"
          required
          class="w-full border rounded-lg px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label class="block text-sm mb-1">Password</label>
        <input
          v-model="password"
          type="password"
          required
          class="w-full border rounded-lg px-3 py-2 text-sm"
        />
      </div>

      <button
        type="submit"
        :disabled="loading"
        class="w-full bg-emerald-500 text-white py-2 rounded-lg mt-2"
      >
        {{ loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบผู้ดูแล' }}
      </button>
    </form>

    <p v-if="error" class="mt-3 text-xs text-red-500 text-center">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuth } from '../composables/useAuth';

const { loginAdmin } = useAuth();
const username = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');

async function onSubmit() {
  loading.value = true;
  error.value = '';
  try {
    await loginAdmin(username.value, password.value);
  } catch (_e) {
    error.value = 'เข้าสู่ระบบไม่สำเร็จ';
  } finally {
    loading.value = false;
  }
}
</script>
