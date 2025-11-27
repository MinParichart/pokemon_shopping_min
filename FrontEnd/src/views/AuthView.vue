<template>
  <div>
    <h1 class="text-xl font-semibold mb-4 text-center">ลงทะเบียน</h1>

    <form class="space-y-3" @submit.prevent="onSubmit">
      <div>
        <label class="block text-sm mb-1">Username</label>
        <input
          v-model="form.username"
          required
          class="w-full border rounded-lg px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label class="block text-sm mb-1">ชื่อ - นามสกุล</label>
        <input
          v-model="form.fullName"
          required
          class="w-full border rounded-lg px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label class="block text-sm mb-1">เบอร์โทรศัพท์</label>
        <input
          v-model="form.phone"
          required
          class="w-full border rounded-lg px-3 py-2 text-sm"
        />
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-sm mb-1">Password</label>
          <input
            v-model="form.password"
            type="password"
            required
            class="w-full border rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label class="block text-sm mb-1">ยืนยัน Password</label>
          <input
            v-model="form.confirmPassword"
            type="password"
            required
            class="w-full border rounded-lg px-3 py-2 text-sm"
          />
        </div>
      </div>

      <button
        type="submit"
        class="w-full bg-emerald-500 text-white py-2 rounded-lg mt-2"
        :disabled="loading"
      >
        {{ loading ? 'กำลังลงทะเบียน...' : 'ลงทะเบียน' }}
      </button>

      <RouterLink
        to="/login"
        class="block text-center text-xs text-slate-500 mt-3"
      >
        มีบัญชีอยู่แล้ว? เข้าสู่ระบบ
      </RouterLink>
    </form>

    <p v-if="error" class="mt-3 text-xs text-red-500 text-center">
      {{ error }}
    </p>
    <p v-if="success" class="mt-3 text-xs text-emerald-600 text-center">
      ลงทะเบียนสำเร็จ กรุณาเข้าสู่ระบบ
    </p>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import type { RegisterBody } from '../models/auth.model';
import { authService } from '../services/auth.service';

const form = reactive<RegisterBody>({
  username: '',
  fullName: '',
  phone: '',
  password: '',
  confirmPassword: '',
  role: 'user'
});

const loading = ref(false);
const error = ref('');
const success = ref(false);

async function onSubmit() {
  error.value = '';
  success.value = false;
  if (form.password !== form.confirmPassword) {
    error.value = 'Password และ ยืนยัน Password ไม่ตรงกัน';
    return;
  }

  loading.value = true;
  try {
    await authService.register(form);
    success.value = true;
  } catch (_e) {
    error.value = 'ลงทะเบียนไม่สำเร็จ';
  } finally {
    loading.value = false;
  }
}
</script>
