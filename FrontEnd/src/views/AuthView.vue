<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-50 p-4">
    <div class="w-full max-w-md bg-white border border-slate-200 rounded-xl p-8 shadow-lg">
      <h1 class="text-xl font-semibold mb-6 text-center text-slate-800">ลงทะเบียนสมาชิกใหม่</h1>

      <form class="space-y-4" @submit.prevent="onSubmit">
        <BaseInput v-model="form.username" label="Username" required />
        <BaseInput v-model="form.fullName" label="ชื่อ - นามสกุล" required />
        <BaseInput v-model="form.phone" label="เบอร์โทรศัพท์" required />
        
        <div class="grid grid-cols-2 gap-3">
          <BaseInput v-model="form.password" type="password" label="Password" required />
          <BaseInput v-model="form.confirmPassword" type="password" label="ยืนยัน Password" required />
        </div>

        <div class="pt-2">
          <BaseButton type="submit" variant="primary" block :loading="loading">
            ลงทะเบียน
          </BaseButton>
        </div>

        <div class="text-center mt-4">
          <RouterLink to="/login" class="text-xs text-slate-500 hover:text-emerald-600 hover:underline">
            มีบัญชีอยู่แล้ว? เข้าสู่ระบบ
          </RouterLink>
        </div>
      </form>

      <p v-if="error" class="mt-4 text-xs text-red-500 text-center bg-red-50 p-2 rounded border border-red-100">{{ error }}</p>
      <p v-if="success" class="mt-4 text-xs text-emerald-600 text-center bg-emerald-50 p-2 rounded border border-emerald-100">
        ลงทะเบียนสำเร็จ กรุณาเข้าสู่ระบบ
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import type { RegisterBody } from '../models/auth.model';
import { authService } from '../services/auth.service';
// ✅ Import Components
import BaseInput from '../components/common/BaseInput.vue';
import BaseButton from '../components/common/BaseButton.vue';

const form = reactive<RegisterBody>({
  username: '', fullName: '', phone: '',
  password: '', confirmPassword: '', role: 'user',
});

const loading = ref(false);
const error = ref('');
const success = ref(false);

async function onSubmit() {
  error.value = ''; success.value = false;
  if (form.password !== form.confirmPassword) {
    error.value = 'Password และ ยืนยัน Password ไม่ตรงกัน'; return;
  }
  loading.value = true;
  try {
    await authService.register(form);
    success.value = true;
  } catch (_e) { error.value = 'ลงทะเบียนไม่สำเร็จ (ชื่อผู้ใช้อาจซ้ำ)'; } 
  finally { loading.value = false; }
}
</script>