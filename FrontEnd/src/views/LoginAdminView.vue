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
          class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />
      </div>

      <div>
        <label class="block text-sm mb-1">Password</label>

        <!-- กล่อง input + รูปตา -->
        <div class="relative">
          <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            required
            class="w-full border border-gray-300 rounded-lg px-3 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />

          <!-- ปุ่มรูปตา -->
          <button
            type="button"
            class="absolute inset-y-0 right-0 px-3 flex items-center text-slate-400"
            @click="showPassword = !showPassword"
          >
            <span class="material-symbols-outlined text-xl leading-none">
              {{ showPassword ? 'visibility' : 'visibility_off' }}
            </span>
          </button>
        </div>
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

// state สำหรับเปิด/ปิด password
const showPassword = ref(false);

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
